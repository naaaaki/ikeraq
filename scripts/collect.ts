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

import { GitHubClient, CONCURRENCY, STAR_RANGES, mapLimited } from './lib/github.js';
import { categorizeLicense } from './lib/license.js';
import { buildReadmeExcerpt } from './lib/readme.js';
import { fetchTrending } from './lib/trending.js';
import { notify } from './lib/notify.js';
import { addDays, daysBetween, todayJST } from './lib/date.js';
import { decideTier, shouldFetchToday, TRACKING_LIMIT } from './lib/tier.js';
import { newRepository } from './lib/repository.js';
import {
  listSnapshotDates,
  loadAllRepos,
  loadLatestSnapshotBefore,
  saveRepo,
  saveSnapshot,
} from './lib/storage.js';
import type {
  DailySnapshot,
  GitHubRepo,
  Repository,
  SnapshotEntry,
} from '../src/types.js';

/** 発見クエリ（SPEC §11-1）。主軸は Search API */
const DISCOVERY_QUERIES = (today: string): string[] => [
  `created:>${addDays(today, -30)}`, // 新しくて勢いのあるもの
  `pushed:>${addDays(today, -7)}`, // 直近で動いているもの
];

/** 発見時の最低スター数。これ未満は追跡対象にしない */
const DISCOVERY_MIN_STARS = 200;

/** 1日の発見件数の上限。追跡対象の増えすぎを防ぐ */
const MAX_NEW_PER_DAY = 150;

/** 「スターがほぼ動いていない」と見なす1日あたりの増加数（SPEC §10.4 休眠層） */
const STAGNANT_DELTA_THRESHOLD = 1;

async function main() {
  const startedAt = Date.now();
  const today = todayJST();
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const debugLimit = limitArg ? Number(limitArg.split('=')[1]) : null;

  console.log(`[collect] ${today} の収集を開始します${dryRun ? '（dry-run）' : ''}`);

  const client = new GitHubClient({ token: process.env.GITHUB_TOKEN ?? '' });
  const rate = await client.getRateLimit();
  console.log(`[collect] レート制限: ${rate.remaining}/${rate.limit}`);

  // ------------------------------------------------------------------
  // 既存の追跡対象を読み込む
  // ------------------------------------------------------------------
  const existing = await loadAllRepos();
  const repos = new Map(existing.map((r) => [r.id, r]));
  console.log(`[collect] 追跡対象: ${repos.size} 件`);

  const prevSnapshot = await loadLatestSnapshotBefore(today);
  const prevStars = new Map(prevSnapshot?.entries.map((e) => [e.repo_id, e.stars]) ?? []);
  const prevDelta = new Map(prevSnapshot?.entries.map((e) => [e.repo_id, e.stars_delta]) ?? []);
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
  const candidates = [...discovered.values()].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );
  for (const gh of candidates) {
    if (repos.has(gh.full_name)) continue;
    if (repos.size >= TRACKING_LIMIT) {
      console.warn(`[collect] 追跡上限 ${TRACKING_LIMIT} 件に到達。新規の追加を打ち切ります`);
      break;
    }
    if (newIds.length >= MAX_NEW_PER_DAY) break;
    repos.set(gh.full_name, newRepository(gh));
    newIds.push(gh.full_name);
  }
  // Trending 由来は件数が少ないので上限内なら優先的に追加する
  for (const id of trending ?? []) {
    if (repos.has(id) || repos.size >= TRACKING_LIMIT) continue;
    const gh = discovered.get(id);
    if (!gh) continue;
    repos.set(id, newRepository(gh));
    newIds.push(id);
  }
  console.log(`[collect] 新規検知: ${newIds.length} 件 / 追跡合計: ${repos.size} 件`);

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
    const search = discovered.get(repo.id);
    return fetchRepositoryDetail(client, repo, search, today);
  });

  let fetched = 0;
  let skipped = 0;
  for (const result of results) {
    if ('ok' in result) {
      if (result.ok === null) {
        // 404 = 削除・非公開化。追跡からは外さず記録だけ残す
        skipped++;
        continue;
      }
      repos.set(result.ok.id, result.ok);
      fetched++;
    } else {
      // 1件の失敗で全体を止めない（SPEC §11）
      skipped++;
      console.warn(`[collect] 取得失敗のためスキップ: ${result.item.id}`, result.error);
    }
  }
  console.log(`[collect] 取得成功 ${fetched} 件 / スキップ ${skipped} 件`);

  // ------------------------------------------------------------------
  // 2. 差分検出 → スナップショット組み立て（★最重要資産・SPEC §6.2）
  // ------------------------------------------------------------------
  const entries: SnapshotEntry[] = [...repos.values()].map((repo) => {
    const before = prevStars.get(repo.id);
    // 前回が数日前なら1日あたりに均す。日数差を無視すると star_spike が誤検知する
    const rawDelta = before === undefined ? null : repo.stars - before;
    const delta =
      rawDelta === null || !prevDays || prevDays <= 1 ? rawDelta : Math.round(rawDelta / prevDays);
    return {
      repo_id: repo.id,
      stars: repo.stars,
      stars_delta: delta,
      forks: repo.forks,
      rank: null,
    };
  });

  entries
    .slice()
    .sort((a, b) => (b.stars_delta ?? -1) - (a.stars_delta ?? -1))
    .forEach((e, i) => {
      e.rank = e.stars_delta === null ? null : i + 1;
    });

  // 層の再判定と滞留日数の更新
  const snapshotCount = (await listSnapshotDates()).length + 1;
  for (const entry of entries) {
    const repo = repos.get(entry.repo_id)!;
    const stagnant = (entry.stars_delta ?? 0) < STAGNANT_DELTA_THRESHOLD;
    repo.stars_stagnant_days = stagnant ? repo.stars_stagnant_days + 1 : 0;
    repo.snapshot_days = Math.min(repo.snapshot_days + 1, snapshotCount);
    repo.tracking_tier = decideTier(repo, entry.stars_delta ?? prevDelta.get(repo.id) ?? null);
  }

  const snapshot: DailySnapshot = {
    date: today,
    generated_at: new Date().toISOString(),
    entries,
    new_repo_ids: newIds,
    stats: {
      entry_count: entries.length,
      new_count: newIds.length,
      fetched_count: fetched,
      skipped_count: skipped,
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
    for (const repo of repos.values()) await saveRepo(repo);
    const file = await saveSnapshot(snapshot);
    console.log(`[collect] 保存しました: ${file}`);
  }

  const lines = [
    `件数: ${snapshot.stats.entry_count} / 新規: ${snapshot.stats.new_count}`,
    `取得: ${fetched} 件 / スキップ: ${skipped} 件`,
    `Trending: ${trendingOk ? 'OK' : '取得失敗（Search API のみで続行）'}`,
    `API リクエスト: ${client.requestCount} 回 / 残り ${client.remaining}`,
    `所要時間: ${snapshot.stats.duration_sec} 秒`,
  ];
  await notify(trendingOk ? 'info' : 'warn', `日次収集 完了 (${today})`, lines);
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
  // 検索で既に取れているものは /repos を叩き直さない（API 節約）
  const gh = searchResult ?? (await client.getRepo(repo.owner, repo.name));
  if (!gh) return null; // 削除・非公開化

  // README は毎日は要らない。初回と、まだ取れていない場合のみ取得する
  let readmeExcerpt = repo.readme_excerpt;
  let readmeLength = repo.readme_length;
  let hasJa = repo.has_japanese_readme;
  if (!repo.last_fetched_date || readmeLength === 0) {
    const readme = await client.getReadme(repo.owner, repo.name);
    if (readme !== null) {
      readmeLength = readme.length;
      readmeExcerpt = buildReadmeExcerpt(readme);
      hasJa = await client.hasJapaneseReadme(repo.owner, repo.name);
    }
  }

  // 貢献者数・リリース数は変化が遅い。週1回だけ更新する
  let contributors = repo.contributors_count;
  let releases = repo.releases_count;
  const staleCounts =
    !repo.last_fetched_date || daysBetween(today, repo.last_fetched_date) >= 7;
  if (staleCounts) {
    contributors = await client.getContributorsCount(repo.owner, repo.name);
    releases = await client.getReleasesCount(repo.owner, repo.name);
  }

  return {
    ...repo,
    description_en: gh.description,
    language: gh.language,
    topics: gh.topics ?? repo.topics,
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    watchers: gh.subscribers_count ?? gh.watchers_count,
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

main().catch(async (e) => {
  console.error('[collect] 致命的なエラー', e);
  // ★ 気づかないまま止まっているのが最悪（SPEC §17.2）
  await notify('error', '日次収集 失敗', [String(e?.message ?? e).slice(0, 1500)]);
  process.exit(1);
});
