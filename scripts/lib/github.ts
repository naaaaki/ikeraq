/**
 * GitHub REST API クライアント（SPEC §10.1 / §10.2）
 *
 * 実装要件（SPEC §10.2 を必ず守ること）:
 *   - Promise.all で全件を一括並列実行しない
 *   - 同時実行数は 5〜10 に制限する
 *   - X-RateLimit-Remaining を監視し、枯渇時は待機する
 *   - 429 / 403 応答時は指数バックオフ
 *
 * 外部依存を持たない（Node 標準の fetch のみ）。
 * 依存が増えるほど「勝手に壊れる」経路が増えるため（SPEC §17.2）。
 */

import type { GitHubRepo } from '../../src/types.js';

const API = 'https://api.github.com';

/** 同時実行数の上限（SPEC §10.2） */
export const CONCURRENCY = 6;

/** リトライ回数の上限 */
const MAX_RETRIES = 5;

/**
 * レート制限の枠は用途ごとに独立している。
 *   core   … 通常の REST API。5,000 req/時
 *   search … Search API。30 req/分
 * 1つのカウンタで両方を管理すると、検索を1回投げただけで
 * 「残り30 = 枯渇」と誤判定し、以降の全リクエストが待機してしまう。
 */
type RateResource = 'core' | 'search';

/** 残数がこれを下回ったらリセットまで待つ。枠ごとに値が違う */
const RATE_LIMIT_FLOOR: Record<RateResource, number> = {
  core: 100,
  search: 3,
};

/** レート制限で待つ上限。これを超える待機が必要なら諦めて次回に回す */
const MAX_WAIT_MS = 15 * 60 * 1000;

/** レート制限に達し、リトライしても回復しなかった */
export class RateLimitExhaustedError extends Error {}

/** レート制限ではない 403。リトライしても永久に失敗するので即座に諦める */
export class ForbiddenError extends Error {}

/** レスポンスが期待した形式で読めなかった（API のレスポンス構造変更・SPEC §17.2-1） */
export class ResponseParseError extends Error {}

/** 1回の実行に割り当てたリクエスト数を使い切った */
export class RequestBudgetExceededError extends Error {}

// ---------------------------------------------------------------------------
// 同時実行数リミッタ（p-limit 相当・依存を増やさないため自前実装）
// ---------------------------------------------------------------------------

type Task<T> = () => Promise<T>;

export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  const next = () => {
    active--;
    const run = queue.shift();
    if (run) run();
  };

  return function limit<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        active++;
        task().then(resolve, reject).finally(next);
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
  };
}

/**
 * 同時実行数を絞って items を処理する。
 * 1件の失敗で全体を止めない（SPEC §11「部分的な失敗でサイト更新は止めない」）ため、
 * 結果は { ok } / { error } のどちらかを返す。
 */
export async function mapLimited<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<Array<{ item: T; ok: R } | { item: T; error: unknown }>> {
  const limit = createLimiter(concurrency);
  return Promise.all(
    items.map((item, i) =>
      limit(async () => {
        try {
          return { item, ok: await fn(item, i) };
        } catch (error) {
          return { item, error };
        }
      })
    )
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// クライアント本体
// ---------------------------------------------------------------------------

export interface GitHubClientOptions {
  token: string;
  /**
   * 1回の実行で投げるリクエスト数の上限。
   * 初回実行のように対象が一気に増えたとき、枠を使い切って
   * 待機し続けジョブがタイムアウトするのを防ぐ（残りは翌日に回す）。
   */
  maxRequests?: number;
}

interface RateState {
  remaining: number;
  resetAt: number | null;
}

export interface ApiResponse {
  status: number;
  /** JSON なら parse 済みの値、それ以外は生の文字列 */
  body: unknown;
  headers: Headers;
}

export class GitHubClient {
  private token: string;
  private maxRequests: number;

  private rates: Record<RateResource, RateState> = {
    core: { remaining: Infinity, resetAt: null },
    search: { remaining: Infinity, resetAt: null },
  };

  /** このプロセスで投げたリクエスト数（コスト実測用・SPEC §10.4） */
  public requestCount = 0;

  constructor(opts: GitHubClientOptions) {
    if (!opts.token) {
      throw new Error(
        'GITHUB_TOKEN が未設定です。PAT を Secrets / .env に登録してください（SPEC §10.1）'
      );
    }
    this.token = opts.token;
    this.maxRequests = opts.maxRequests ?? Infinity;
  }

  /** 通常APIの残数（ログ表示用） */
  get remaining(): number {
    return this.rates.core.remaining;
  }

  get searchRemaining(): number {
    return this.rates.search.remaining;
  }

  /** リクエスト予算が残っているか。呼び出し側はこれを見て打ち切る */
  hasBudget(): boolean {
    return this.requestCount < this.maxRequests;
  }

  private resourceOf(path: string): RateResource {
    return path.startsWith('/search/') || path.includes('/search/') ? 'search' : 'core';
  }

  /**
   * 生のリクエスト。レート制限とバックオフをここに集約する。
   * 404 は「存在しない」を意味することが多いので null を返し、呼び出し側で扱う。
   */
  async request(path: string, init: RequestInit = {}): Promise<ApiResponse | null> {
    const url = path.startsWith('http') ? path : `${API}${path}`;
    const resource = this.resourceOf(path);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (!this.hasBudget()) {
        throw new RequestBudgetExceededError(
          `リクエスト予算 ${this.maxRequests} 回を使い切りました。残りは次回の実行に回します`
        );
      }
      await this.waitIfRateLimited(resource);

      this.requestCount++;
      const res = await fetch(url, {
        ...init,
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'ikeraq-collector',
          Authorization: `Bearer ${this.token}`,
          ...(init.headers as Record<string, string> | undefined),
        },
      });

      this.readRateLimitHeaders(resource, res.headers);

      if (res.status === 404) return null;

      if (res.ok) return this.parseBody(res, url);

      const bodyText = await res.text();

      // ★ 403 にはレート制限とは無関係のものがある（貢献者が極端に多いリポジトリ等）。
      //   これをリトライすると、31秒待った末に必ず失敗する。即座に諦める。
      if (res.status === 403 && !isRateLimitResponse(res, bodyText)) {
        throw new ForbiddenError(
          `403 Forbidden（レート制限ではない）: ${url}\n${bodyText.slice(0, 200)}`
        );
      }

      // レート制限・二次制限・一時障害は指数バックオフでリトライ
      if (res.status === 429 || res.status === 403 || res.status >= 500) {
        if (attempt === MAX_RETRIES) {
          throw new RateLimitExhaustedError(
            `${res.status} ${res.statusText} — リトライ上限に達しました: ${url}`
          );
        }
        const wait = this.retryDelayMs(res, attempt);
        console.warn(
          `[github] ${res.status} — ${Math.round(wait / 1000)}秒待機してリトライ (${attempt + 1}/${MAX_RETRIES}): ${url}`
        );
        await sleep(wait);
        continue;
      }

      throw new Error(`GitHub API ${res.status} ${res.statusText}: ${url}\n${bodyText.slice(0, 300)}`);
    }

    throw new Error(`到達不能: ${url}`);
  }

  /**
   * Content-Type を見てから読む。
   * README は Accept: raw を指定するため JSON ではなく Markdown が返る。
   * すべてを JSON.parse にかけると、README の取得が必ず例外になる。
   */
  private async parseBody(res: Response, url: string): Promise<ApiResponse> {
    const text = await res.text();
    const contentType = res.headers.get('content-type') ?? '';
    const base = { status: res.status, headers: res.headers };

    if (!text) return { ...base, body: null };
    if (!contentType.includes('json')) return { ...base, body: text };

    try {
      return { ...base, body: JSON.parse(text) };
    } catch (e) {
      // API のレスポンス構造変更。該当件だけスキップして続行させる（SPEC §17.2-1）
      throw new ResponseParseError(
        `JSON として読めませんでした: ${url}（${(e as Error).message}）`
      );
    }
  }

  private retryDelayMs(res: Response, attempt: number): number {
    const retryAfter = res.headers.get('retry-after');
    if (retryAfter) return Number(retryAfter) * 1000 + 1000;

    const reset = res.headers.get('x-ratelimit-reset');
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0' && reset) {
      const waitMs = Number(reset) * 1000 - Date.now();
      if (waitMs > 0) return Math.min(waitMs + 2000, MAX_WAIT_MS);
    }
    // 指数バックオフ（1s, 2s, 4s, 8s, 16s）
    return 1000 * 2 ** attempt;
  }

  private readRateLimitHeaders(resource: RateResource, headers: Headers) {
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    // どの枠のヘッダかは x-ratelimit-resource が教えてくれる。無ければパスから推定した値を使う
    const actual = (headers.get('x-ratelimit-resource') as RateResource | null) ?? resource;
    const state = this.rates[actual] ?? this.rates[resource];
    if (remaining !== null) state.remaining = Number(remaining);
    if (reset !== null) state.resetAt = Number(reset) * 1000;
  }

  /** 枠が尽きかけていたらリセットまで待つ（SPEC §10.2） */
  private async waitIfRateLimited(resource: RateResource) {
    const state = this.rates[resource];
    if (state.remaining > RATE_LIMIT_FLOOR[resource]) return;
    if (!state.resetAt) return;

    const waitMs = state.resetAt - Date.now();
    if (waitMs <= 0) {
      state.remaining = Infinity; // リセット済み。次のレスポンスで再取得される
      return;
    }
    if (waitMs > MAX_WAIT_MS) {
      throw new RateLimitExhaustedError(
        `${resource} のレート制限リセットまで ${Math.ceil(waitMs / 60000)} 分あります。今回は打ち切ります`
      );
    }
    console.warn(
      `[github] ${resource} のレート制限が残り ${state.remaining}。${Math.ceil(waitMs / 1000)}秒待機します`
    );
    await sleep(waitMs + 2000);
    state.remaining = Infinity;
  }

  // -------------------------------------------------------------------------
  // Search API
  // -------------------------------------------------------------------------

  /**
   * 1クエリ分の検索。Search API は最大1,000件（100件×10ページ）しか返さない。
   * それを超える件数が必要な場合は searchReposRanged() を使うこと（SPEC §10.4）。
   */
  async searchRepos(query: string, maxItems = 1000): Promise<GitHubRepo[]> {
    const perPage = 100;
    const out: GitHubRepo[] = [];
    let totalCount: number | null = null;

    for (let page = 1; page <= 10; page++) {
      if (out.length >= maxItems) break;
      const res = await this.request(
        `/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`
      );
      if (!res) break;
      const body = res.body as { total_count: number; items: GitHubRepo[] };
      if (!body || !Array.isArray(body.items)) {
        throw new ResponseParseError(`検索レスポンスに items がありません: ${query}`);
      }
      if (totalCount === null) totalCount = body.total_count;
      out.push(...body.items);
      if (body.items.length < perPage) break;
    }

    if (totalCount !== null && totalCount > 1000) {
      console.warn(
        `[github] 該当 ${totalCount} 件に対し 1,000 件で打ち切られています。` +
          `レンジ分割が必要です（SPEC §10.4）: ${query}`
      );
    }
    return out.slice(0, maxItems);
  }

  /**
   * stars のレンジで分割して 1,000 件制限を回避する（SPEC §10.4）。
   * 分割せずに書くと静かに上位1,000件で打ち切られ、気づきにくいバグになる。
   */
  async searchReposRanged(
    baseQuery: string,
    ranges: string[],
    maxPerRange = 1000
  ): Promise<GitHubRepo[]> {
    const seen = new Map<string, GitHubRepo>();
    for (const range of ranges) {
      const query = `${baseQuery} stars:${range}`;
      const items = await this.searchRepos(query, maxPerRange);
      console.log(`[github] search "${query}" → ${items.length} 件`);
      for (const item of items) seen.set(item.full_name, item);
    }
    return [...seen.values()];
  }

  // -------------------------------------------------------------------------
  // リポジトリ個別のメタデータ
  // -------------------------------------------------------------------------

  async getRepo(owner: string, name: string): Promise<GitHubRepo | null> {
    const res = await this.request(`/repos/${owner}/${name}`);
    return res ? (res.body as GitHubRepo) : null;
  }

  /** README 本文。存在しなければ null */
  async getReadme(owner: string, name: string): Promise<string | null> {
    const res = await this.request(`/repos/${owner}/${name}/readme`, {
      headers: { Accept: 'application/vnd.github.raw' },
    });
    if (!res) return null;
    if (typeof res.body === 'string') return res.body;
    // raw が効かず JSON（base64）で返ってきた場合のフォールバック
    const json = res.body as { content?: string; encoding?: string } | null;
    if (json?.content && json.encoding === 'base64') {
      return Buffer.from(json.content, 'base64').toString('utf8');
    }
    return null;
  }

  /** 日本語 README（README.ja.md 等）の有無（SPEC §6.1） */
  async hasJapaneseReadme(owner: string, name: string): Promise<boolean> {
    const res = await this.request(`/repos/${owner}/${name}/contents/`);
    if (!res || !Array.isArray(res.body)) return false;
    const names = (res.body as Array<{ name: string; type: string }>)
      .filter((e) => e.type === 'file')
      .map((e) => e.name.toLowerCase());
    return names.some((n) => /^readme[._-](ja|jp|ja-jp|japanese)\.(md|rst|txt)$/.test(n));
  }

  /**
   * 件数だけが欲しいものは per_page=1 で Link ヘッダの last ページ番号を読む。
   * 全ページを取得するより圧倒的に安い。
   */
  private async countViaLinkHeader(path: string): Promise<number | null> {
    const res = await this.request(`${path}${path.includes('?') ? '&' : '?'}per_page=1`);
    if (!res) return null;
    const link = res.headers.get('link');
    if (link) {
      const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
      if (match) return Number(match[1]);
    }
    return Array.isArray(res.body) ? res.body.length : 0;
  }

  /**
   * 貢献者数。大規模リポジトリでは GitHub 側が 403 を返すことがあるため、
   * 取得できない場合は null（＝不明）を返す。0 と混同しないこと。
   */
  async getContributorsCount(owner: string, name: string): Promise<number | null> {
    try {
      return await this.countViaLinkHeader(`/repos/${owner}/${name}/contributors?anon=1`);
    } catch (e) {
      if (e instanceof ForbiddenError) return null;
      throw e;
    }
  }

  /** リリース数（dependents_count の代替シグナル・SPEC §7.5） */
  async getReleasesCount(owner: string, name: string): Promise<number | null> {
    try {
      return await this.countViaLinkHeader(`/repos/${owner}/${name}/releases`);
    } catch (e) {
      if (e instanceof ForbiddenError) return null;
      throw e;
    }
  }

  /** 現在のレート制限状況 */
  async getRateLimit(): Promise<{ limit: number; remaining: number; reset: number }> {
    const res = await this.request('/rate_limit');
    const body = res!.body as {
      resources: { core: { limit: number; remaining: number; reset: number } };
    };
    return body.resources.core;
  }
}

/** レート制限由来の 403 かどうか。そうでなければリトライしても無駄 */
export function isRateLimitResponse(res: { headers: Headers }, bodyText: string): boolean {
  if (res.headers.get('retry-after')) return true;
  if (res.headers.get('x-ratelimit-remaining') === '0') return true;
  return /rate limit|secondary rate|abuse detection/i.test(bodyText);
}

/**
 * SPEC §10.4 の初期シードで使う stars レンジ。
 * GitHub のレンジ指定は両端を含むため、境界が重ならないようずらしてある。
 */
export const STAR_RANGES = ['200..500', '501..1000', '1001..5000', '>5000'];
