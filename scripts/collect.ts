/**
 * 日次収集パイプライン（SPEC §11）
 *
 *   1. 収集       主: GitHub Search API / 従: Trending（失敗許容）
 *   2. 差分検出   前日スナップショットと比較して stars_delta を算出
 *   3. メタデータ 追跡層に応じて対象を絞って取得（同時実行数を制限）
 *   4. 機械判定   ← Phase 1 で evaluate.ts として実装する
 *   5. データ保存 snapshots/YYYY-MM-DD.json と repos/{owner}/{name}.json
 *
 * ★ Phase 0 の目的は「スナップショットの蓄積を最速で始めること」。
 *   この履歴は後から遡って取得できない（SPEC §6.2）。
 *
 * ★ 部分的な失敗でパイプラインを止めない（SPEC §11 エラー時の原則）。
 */

import {
  GitHubClient,
  CONCURRENCY,
  STAR_RANGES,
  RequestBudgetExceededError,
  mapLimited,
} from './lib/github.js';
import { categorizeLicense } from './lib/license.js';
import { buildReadmeExcerpt } from './lib/readme.js';
import { fetchTrending } from './lib/trending.js';
import { notify } from './lib/notify.js';
import { addDays, daysBetween, todayJST } from './lib/date.js';
import { decideTier, shouldFetchToday, evictable, TRACKING_LIMIT } from './lib/tier.js';
import { newRepository } from './lib/repository.js';
import {
  loadAllRepos,
  loadLatestSnapshotBefore,
  saveRepoIfChanged,
  saveSnapshot,
} from './lib/storage.js';
import type { DailySnapshot, GitHubRepo, Repository, SnapshotEntry } from '../src/types.js';

/** 発見クエリ（SPEC §11-1）。主軸は Search API */
const DISCOVERY_QUERIES = (today: string): string[] => [
  `created:>${addDays(today, -30)}`, // 新しくて勢いのあるもの
  `pushed:>${addDays(today, -7)}`, // 直近で動いているもの
];

/** 発見時の最低スター数。これ未満は追跡対象にしない */
const DISCOVERY_MIN_STARS = 200;

/** 1日の発見件数の上限。追跡対象の増えすぎを防ぐ */
const MAX_NEW_PER_DAY = 150;

/**
 * 1回の実行で投げるリクエスト数の上限。
 * seed 直後は全件が未取得になるため、これが無いと5,000req/時を使い切り、
 * 待機し続けてジョブがタイムアウトする（＝通知も飛ばずに静かに止まる）。
 */
const REQUEST_BUDGET = 3000;

/** 「スターがほぼ動いていない」と見なす1日あたりの増加数（SPEC §10.4 休眠層） */
const STAGNANT_DELTA_THRESHOLD = 1;

async function main() {
  const startedAt = Date.now();
  const today = todayJST();
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const debugLimit = limitArg ? Number(limitArg.split('=')[1]) : null;

  console.log(`[collect] ${today} の収集を開始します${dryRun ? '（dry-run）' : ''}`);

  const client = new GitHubClient({
    token: process.env.GITHUB_TOKEN ?? '',
    maxRequests: REQUEST_BUDGET,
  });
  const rate = await client.getRateLimit();
  console.log(`[collect] レート制限: ${rate.remaining}/${rate.limit}`);

  // ------------------------------------------------------------------
  // 既存の追跡対象を読み込む
  // ------------------------------------------------------------------
  const existing = await loadAllRepos();
  const repos = new Map(existing.map((r) => [r.id, r]));
  console.log(`[collect] 追跡対象: ${repos.size} 件`);

  const prevSnapshot = await loadLatestSnapshotBefore(today);
  // ★ 実際に取得できた日の値だけを比較元にする。
  //   見ていない日の値と比べると、差分が0や数日分に化ける
  const prevEntries = (prevSnapshot?.entries ?? []).filter((e) => e.fetched);
  const prevStars = new Map(prevEntries.map((e) => [e.repo_id, e.stars]));
  const prevDelta = new Map(prevEntries.map((e) => [e.repo_id, e.stars_delta]));
  const prevDays = prevSnapshot ? daysBetween(today, prevSnapshot.date) : null;
  if (prevSnapshot) {
    console.log(`[collect] 前回スナップショット: ${prevSnapshot.date}（${prevDays}日前）`);
  } else {
    console.log('[collect] 前回スナップショットなし。初回実行として続行します');
  }

  // ------------------------------------------------------------------
  // 1. 発見（Search API が主軸・SPEC §10.3）
  // ------------------------------------------------------------------
  const discovered = new Map<string, GitHubRepo>();
  for (const query of DISCOVERY_QUERIES(today)) {
    try {
      // ★ レンジ分割しないと静かに上位1,000件で打ち切られる（SPEC §10.4）
      const found = await client.searchReposRanged(query, STAR_RANGES);
      for (const r of found) {
        if (r.stargazers_count >= DISCOVERY_MIN_STARS) discovered.set(r.full_name, r);
      }
    } catch (e) {
      // 1クエリの失敗で全体を止めない
      console.warn(`[collect] 検索に失敗したためスキップ: ${query}`, e);
    }
  }
  console.log(`[collect] 検索で ${discovered.size} 件を取得`);

  // 従: Trending（失敗許容・1日1回のみ）
  const trending = await fetchTrending();
  const trendingOk = trending !== null;
  if (trendingOk) console.log(`[collect] Trending: ${trending.length} 件`);

  // ------------------------------------------------------------------
  // 追跡対象の更新（上限 1,000 件・SPEC §10.4）
  // ------------------------------------------------------------------
  const newIds: string[] = [];
  const evictedIds: string[] = [];

  /**
   * 追跡枠を1つ空ける。空けられなければ false。
   * ★ 押し出したリポジトリのスター履歴は二度と取れない。
   *   条件は「休眠層かつ90日以上停滞」に限定し、必ずログに残す（SPEC §10.4）。
   */
  const makeRoom = (): boolean => {
    if (repos.size < TRACKING_LIMIT) return true;
    const victim = [...repos.values()]
      .filter(evictable)
      .sort((a, b) => b.stars_stagnant_days - a.stars_stagnant_days)[0];
    if (!victim) return false;
    repos.delete(victim.id);
    evictedIds.push(victim.id);
    console.log(
      `[collect] 追跡停止: ${victim.id}（${victim.stars_stagnant_days}日間停滞・履歴は復元できません）`
    );
    return true;
  };

  const addRepo = (gh: GitHubRepo): boolean => {
    if (repos.has(gh.full_name)) return false;
    if (newIds.length >= MAX_NEW_PER_DAY) return false;
    if (!makeRoom()) return false;
    repos.set(gh.full_name, newRepository(gh));
    newIds.push(gh.full_name);
    return true;
  };

  // 従: Trending 由来を先に入れる。件数が少なく、トレンド性が高いため
  //     検索結果に無いものは個別に取得する（そうしないと1件も追加されない）
  for (const id of trending ?? []) {
    if (repos.has(id)) continue;
    let gh = discovered.get(id);
    if (!gh) {
      const [owner, name] = id.split('/');
      if (!owner || !name) continue;
      try {
        gh = (await client.getRepo(owner, name)) ?? undefined;
      } catch (e) {
        console.warn(`[collect] Trending 由来の取得に失敗: ${id}`, e);
        continue;
      }
    }
    if (gh && gh.stargazers_count >= DISCOVERY_MIN_STARS) addRepo(gh);
  }

  // 主: 検索結果。スター数の多い順に追加する
  const candidates = [...discovered.values()].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );
  let roomExhausted = false;
  for (const gh of candidates) {
    if (newIds.length >= MAX_NEW_PER_DAY) break;
    if (repos.has(gh.full_name)) continue;
    if (!addRepo(gh)) {
      roomExhausted = true;
      break;
    }
  }
  if (roomExhausted) {
    console.warn(
      `[collect] 追跡上限 ${TRACKING_LIMIT} 件に到達し、押し出せる休眠リポジトリもありません。` +
        `新規の追加を打ち切ります（SPEC §10.4 の上限見直しを検討してください）`
    );
  }
  console.log(
    `[collect] 新規検知: ${newIds.length} 件 / 追跡停止: ${evictedIds.length} 件 / 追跡合計: ${repos.size} 件`
  );

  // ------------------------------------------------------------------
  // 2〜3. 取得対象の選定（3層構造・SPEC §10.4）とメタデータ取得
  // ------------------------------------------------------------------
  let targets = [...repos.values()].filter(
    (r) => newIds.includes(r.id) || shouldFetchToday(r, today)
  );
  if (debugLimit) targets = targets.slice(0, debugLimit);

  const tierCount = { hot: 0, normal: 0, dormant: 0 };
  for (const r of targets) tierCount[r.tracking_tier]++;
  console.log(
    `[collect] 取得対象 ${targets.length} 件 ` +
      `(hot:${tierCount.hot} normal:${tierCount.normal} dormant:${tierCount.dormant})`
  );

  // ★ Promise.all で全件を一括並列実行しない（SPEC §10.2）。同時実行数を絞る
  const results = await mapLimited(targets, CONCURRENCY, async (repo) => {
    // 予算を使い切ったら、以降は取得せず次回に回す
    if (!client.hasBudget()) throw new RequestBudgetExceededError(repo.id);
    const search = discovered.get(repo.id);
    return fetchRepositoryDetail(client, repo, search, today);
  });

  /** この日に実際に取得できた repo_id。スナップショットの fetched に使う */
  const fetchedIds = new Set<string>();
  let skipped = 0;
  let deferred = 0;
  for (const result of results) {
    if ('ok' in result) {
      if (result.ok === null) {
        // 404 = 削除・非公開化。追跡からは外さず記録だけ残す
        skipped++;
        continue;
      }
      repos.set(result.ok.id, result.ok);
      fetchedIds.add(result.ok.id);
    } else if (result.error instanceof RequestBudgetExceededError) {
      deferred++;
    } else {
      // 1件の失敗で全体を止めない（SPEC §11）
      skipped++;
      console.warn(`[collect] 取得失敗のためスキップ: ${result.item.id}`, result.error);
    }
  }
  const fetched = fetchedIds.size;
  console.log(
    `[collect] 取得成功 ${fetched} 件 / スキップ ${skipped} 件 / 次回に繰り越し ${deferred} 件`
  );

  // ------------------------------------------------------------------
  // 2. 差分検出 → スナップショット組み立て（★最重要資産・SPEC §6.2）
  //
  // ★ 記録するのは「この日に実際に取得したもの」だけ。
  //   見ていないリポジトリの古い数値を今日の観測値として書くと、
  //   偽スター判定（差別化の核）の土台データが汚れる。後から直せない。
  // ------------------------------------------------------------------
  const entries: SnapshotEntry[] = [...fetchedIds].map((id) => {
    const repo = repos.get(id)!;
    const before = prevStars.get(id);
    const rawDelta = before === undefined ? null : repo.stars - before;
    // 前回が数日前なら1日あたりに均す。日数差を無視すると star_spike が誤検知する
    const delta =
      rawDelta === null || !prevDays || prevDays <= 1 ? rawDelta : Math.round(rawDelta / prevDays);
    return {
      repo_id: id,
      stars: repo.stars,
      stars_delta: delta,
      stars_delta_raw: rawDelta,
      forks: repo.forks,
      rank: null,
      fetched: true,
    };
  });

  // 順位は差分が分かっているものだけで採番する
  entries
    .filter((e) => e.stars_delta !== null)
    .sort((a, b) => b.stars_delta! - a.stars_delta!)
    .forEach((e, i) => {
      e.rank = i + 1;
    });

  // 層の再判定と滞留日数の更新。★取得できた日だけ動かす
  for (const entry of entries) {
    const repo = repos.get(entry.repo_id)!;
    if (entry.stars_delta !== null) {
      // 差分が分からない日（初回検知など）は停滞と見なさない
      const stagnant = entry.stars_delta < STAGNANT_DELTA_THRESHOLD;
      repo.stars_stagnant_days = stagnant ? repo.stars_stagnant_days + 1 : 0;
    }
    repo.snapshot_days += 1;
    repo.tracking_tier = decideTier(repo, entry.stars_delta ?? prevDelta.get(repo.id) ?? null);
  }

  const snapshot: DailySnapshot = {
    date: today,
    generated_at: new Date().toISOString(),
    prev_snapshot_date: prevSnapshot?.date ?? null,
    entries,
    new_repo_ids: newIds,
    stats: {
      entry_count: entries.length,
      new_count: newIds.length,
      fetched_count: fetched,
      skipped_count: skipped,
      deferred_count: deferred,
      trending_ok: trendingOk,
      duration_sec: Math.round((Date.now() - startedAt) / 1000),
    },
  };

  // ------------------------------------------------------------------
  // 5. 保存
  // ------------------------------------------------------------------
  if (dryRun) {
    console.log('[collect] dry-run のため保存しません');
    console.log(JSON.stringify(snapshot.stats, null, 2));
  } else {
    // 変わったファイルだけ書き出す。全件書くと毎日1,000ファイルの差分が出る（SPEC §9.4）
    let written = 0;
    for (const repo of repos.values()) {
      if (await saveRepoIfChanged(repo)) written++;
    }
    const file = await saveSnapshot(snapshot);
    console.log(`[collect] リポジトリ ${written} 件を更新 / スナップショット: ${file}`);
  }

  const lines = [
    `記録件数: ${snapshot.stats.entry_count} / 新規: ${snapshot.stats.new_count}`,
    `取得: ${fetched} 件 / スキップ: ${skipped} 件 / 繰り越し: ${deferred} 件`,
    `追跡合計: ${repos.size} 件（追跡停止 ${evictedIds.length} 件）`,
    `Trending: ${trendingOk ? 'OK' : '取得失敗（Search API のみで続行）'}`,
    `API リクエスト: ${client.requestCount} 回 / core 残り ${client.remaining}`,
    `所要時間: ${snapshot.stats.duration_sec} 秒`,
  ];
  const level = !trendingOk || deferred > 0 || skipped > fetched ? 'warn' : 'info';
  await notify(level, `日次収集 完了 (${today})`, lines);
}

// ---------------------------------------------------------------------------
// 個別リポジトリのメタデータ取得（SPEC §11-3）
// ---------------------------------------------------------------------------

async function fetchRepositoryDetail(
  client: GitHubClient,
  repo: Repository,
  searchResult: GitHubRepo | undefined,
  today: string
): Promise<Repository | null> {
  // 検索で既に取れているものは /repos を叩き直さない（API 節約）。
  // ただし検索結果には subscribers_count が無いので watchers は埋めない
  const gh = searchResult ?? (await client.getRepo(repo.owner, repo.name));
  if (!gh) return null; // 削除・非公開化

  // README は毎日は要らない。初回と、まだ取れていない場合のみ取得する
  let readmeExcerpt = repo.readme_excerpt;
  let readmeLength = repo.readme_length;
  let hasJa = repo.has_japanese_readme;
  if (readmeLength === null) {
    // ★ README が取れなくても、スター数の記録は必ず残す（それが Phase 0 の目的）。
    //   ただし「取得に失敗した（不明）」と「README が無い（0字）」は区別する。
    //   混ぜると、ドキュメントが最も薄いケースが無警告で素通りする
    try {
      const readme = await client.getReadme(repo.owner, repo.name);
      if (readme === null) {
        readmeLength = 0; // 404 = README が置かれていない
        readmeExcerpt = '';
      } else {
        readmeLength = readme.length;
        readmeExcerpt = buildReadmeExcerpt(readme);
        hasJa =
          (await optional(() => client.hasJapaneseReadme(repo.owner, repo.name), `ja-README ${repo.id}`)) ??
          hasJa;
      }
    } catch (e) {
      if (e instanceof RequestBudgetExceededError) throw e;
      // 取得失敗。null のままにして、次回また試す
      console.warn(`[collect] README ${repo.id} の取得に失敗しました（次回再試行します）`, e);
    }
  }

  // 貢献者数・リリース数は変化が遅い。週1回だけ更新する
  let contributors = repo.contributors_count;
  let releases = repo.releases_count;
  const staleCounts = !repo.last_fetched_date || daysBetween(today, repo.last_fetched_date) >= 7;
  if (staleCounts) {
    contributors =
      (await optional(() => client.getContributorsCount(repo.owner, repo.name), `contributors ${repo.id}`)) ??
      contributors;
    releases =
      (await optional(() => client.getReleasesCount(repo.owner, repo.name), `releases ${repo.id}`)) ??
      releases;
  }

  return {
    ...repo,
    description_en: gh.description,
    language: gh.language,
    topics: gh.topics ?? repo.topics,
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    // subscribers_count は検索結果に含まれない。無いときは既存値を保つ（0 にしない）
    watchers: gh.subscribers_count ?? repo.watchers,
    open_issues: gh.open_issues_count,
    created_at: gh.created_at,
    pushed_at: gh.pushed_at,
    is_archived: gh.archived,
    license_spdx: gh.license?.spdx_id ?? null,
    license_category: categorizeLicense(gh.license?.spdx_id),
    readme_excerpt: readmeExcerpt,
    readme_length: readmeLength,
    has_japanese_readme: hasJa,
    contributors_count: contributors,
    releases_count: releases,
    last_fetched_date: today,
  };
}

/**
 * 補助的な項目の取得。失敗しても null を返し、リポジトリ本体の更新は続行する。
 * 予算切れだけは呼び出し元に伝える（打ち切りの判断は上位で行う）。
 */
async function optional<T>(fn: () => Promise<T>, label: string): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof RequestBudgetExceededError) throw e;
    console.warn(`[collect] ${label} の取得に失敗しました（この項目のみ諦めます）`, e);
    return null;
  }
}

main().catch(async (e) => {
  console.error('[collect] 致命的なエラー', e);
  // ★ 気づかないまま止まっているのが最悪（SPEC §17.2）
  await notify('error', '日次収集 失敗', [String(e?.message ?? e).slice(0, 1500)]);
  process.exit(1);
});
