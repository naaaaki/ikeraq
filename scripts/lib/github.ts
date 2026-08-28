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

/** 残リクエストがこれを下回ったらリセットまで待つ */
const RATE_LIMIT_FLOOR = 100;

/** リトライ回数の上限 */
const MAX_RETRIES = 5;

export class RateLimitExhaustedError extends Error {}

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
  /** テスト用。省略時は実時間 */
  now?: () => number;
}

export class GitHubClient {
  private token: string;
  /** 直近のレスポンスから読んだ残数。監視ログ用 */
  public remaining = Infinity;
  public rateLimitResetAt: number | null = null;
  /** このプロセスで投げたリクエスト数（コスト実測用・SPEC §10.4） */
  public requestCount = 0;

  constructor(opts: GitHubClientOptions) {
    if (!opts.token) {
      throw new Error(
        'GITHUB_TOKEN が未設定です。PAT を Secrets / .env に登録してください（SPEC §10.1）'
      );
    }
    this.token = opts.token;
  }

  /**
   * 生のリクエスト。レート制限とバックオフをここに集約する。
   * 404 は「存在しない」を意味することが多いので null を返し、呼び出し側で扱う。
   */
  async request(
    path: string,
    init: RequestInit = {}
  ): Promise<{ status: number; body: unknown; headers: Headers } | null> {
    const url = path.startsWith('http') ? path : `${API}${path}`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      await this.waitIfRateLimited();

      this.requestCount++;
      const res = await fetch(url, {
        ...init,
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'wakuru-collector',
          Authorization: `Bearer ${this.token}`,
          ...(init.headers as Record<string, string> | undefined),
        },
      });

      this.readRateLimitHeaders(res.headers);

      if (res.status === 404) return null;

      if (res.ok) {
        const text = await res.text();
        return {
          status: res.status,
          body: text ? JSON.parse(text) : null,
          headers: res.headers,
        };
      }

      // レート制限・二次制限・一時障害は指数バックオフでリトライ
      if (res.status === 429 || res.status === 403 || res.status >= 500) {
        const wait = this.retryDelayMs(res, attempt);
        if (attempt === MAX_RETRIES) {
          throw new RateLimitExhaustedError(
            `${res.status} ${res.statusText} — リトライ上限に達しました: ${url}`
          );
        }
        console.warn(
          `[github] ${res.status} — ${Math.round(wait / 1000)}秒待機してリトライ (${attempt + 1}/${MAX_RETRIES}): ${url}`
        );
        await sleep(wait);
        continue;
      }

      const body = await res.text();
      throw new Error(`GitHub API ${res.status} ${res.statusText}: ${url}\n${body.slice(0, 300)}`);
    }

    throw new Error(`到達不能: ${url}`);
  }

  private retryDelayMs(res: Response, attempt: number): number {
    const retryAfter = res.headers.get('retry-after');
    if (retryAfter) return Number(retryAfter) * 1000 + 1000;

    const reset = res.headers.get('x-ratelimit-reset');
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0' && reset) {
      const waitMs = Number(reset) * 1000 - Date.now();
      // リセット待ちが長すぎる場合も待つ。止まるよりは遅れる方がよい（SPEC §11）
      if (waitMs > 0) return Math.min(waitMs + 2000, 60 * 60 * 1000);
    }
    // 指数バックオフ（1s, 2s, 4s, 8s, 16s）
    return 1000 * 2 ** attempt;
  }

  private readRateLimitHeaders(headers: Headers) {
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    if (remaining !== null) this.remaining = Number(remaining);
    if (reset !== null) this.rateLimitResetAt = Number(reset) * 1000;
  }

  /** 枠が尽きかけていたらリセットまで待つ（SPEC §10.2） */
  private async waitIfRateLimited() {
    if (this.remaining > RATE_LIMIT_FLOOR) return;
    if (!this.rateLimitResetAt) return;
    const waitMs = this.rateLimitResetAt - Date.now();
    if (waitMs <= 0) {
      this.remaining = Infinity; // リセット済み。次のレスポンスで再取得される
      return;
    }
    console.warn(
      `[github] レート制限が残り ${this.remaining}。${Math.ceil(waitMs / 1000)}秒待機します`
    );
    await sleep(waitMs + 2000);
    this.remaining = Infinity;
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
      if (totalCount === null) totalCount = body.total_count;
      out.push(...body.items);
      if (body.items.length < perPage) break;
      // Search API は毎分30リクエストの別枠。念のため間隔を空ける
      await sleep(2000);
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
    // raw 指定なので body は文字列だが、JSON パースに失敗する場合に備える
    return typeof res.body === 'string' ? res.body : null;
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

  /** 貢献者数。大規模リポジトリでは GitHub 側が概算を返すことがある */
  async getContributorsCount(owner: string, name: string): Promise<number | null> {
    return this.countViaLinkHeader(`/repos/${owner}/${name}/contributors?anon=1`);
  }

  /** リリース数（dependents_count の代替シグナル・SPEC §7.5） */
  async getReleasesCount(owner: string, name: string): Promise<number | null> {
    return this.countViaLinkHeader(`/repos/${owner}/${name}/releases`);
  }

  /** 現在のレート制限状況 */
  async getRateLimit(): Promise<{ limit: number; remaining: number; reset: number }> {
    const res = await this.request('/rate_limit');
    const body = res!.body as { resources: { core: { limit: number; remaining: number; reset: number } } };
    return body.resources.core;
  }
}

/**
 * SPEC §10.4 の初期シードで使う stars レンジ。
 * Search API の 1,000 件制限を回避するための分割。
 */
export const STAR_RANGES = ['200..500', '500..1000', '1000..5000', '>5000'];
