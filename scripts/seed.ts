/**
 * 初期シード（SPEC §10.4「初期シード（Phase 0 初日）」）
 *
 *   新しめで勢いのあるもの:   created:>{1年前} stars:>200  → 上位500件
 *   定番だが再登場しうるもの: stars:>5000 pushed:>{60日前} → 上位500件
 *
 * 1回だけ実行する。以降の追跡対象の追加は collect.ts が日々行う。
 *
 * ★ 追跡対象を絞りすぎると、追跡しなかった期間のスター履歴は永久に欠損する。
 *   上限は 1,000 件（SPEC §10.4）。減らさないこと。
 */

import { GitHubClient } from './lib/github.js';
import { addDays, todayJST } from './lib/date.js';
import { loadAllRepos, saveRepo } from './lib/storage.js';
import { TRACKING_LIMIT } from './lib/tier.js';
import { newRepository } from './lib/repository.js';
import type { GitHubRepo } from '../src/types.js';

/** 各クエリからの取得上限。合計で TRACKING_LIMIT に収まるようにする */
const PER_QUERY_LIMIT = 500;

async function main() {
  const today = todayJST();
  const dryRun = process.argv.includes('--dry-run');
  const client = new GitHubClient({ token: process.env.GITHUB_TOKEN ?? '' });

  const existing = await loadAllRepos();
  const repos = new Map(existing.map((r) => [r.id, r]));
  console.log(`[seed] 既存の追跡対象: ${repos.size} 件`);

  const collected = new Map<string, GitHubRepo>();

  // ★ Search API は1クエリ1,000件が上限。stars でレンジ分割する（SPEC §10.4）
  const queries: Array<{ label: string; base: string; ranges: string[] }> = [
    {
      label: '新しめで勢いのあるもの',
      base: `created:>${addDays(today, -365)}`,
      ranges: ['200..500', '500..1000', '1000..5000', '>5000'],
    },
    {
      label: '定番だがトレンドに再登場しうるもの',
      base: `pushed:>${addDays(today, -60)}`,
      ranges: ['5000..10000', '10000..30000', '>30000'],
    },
  ];

  for (const q of queries) {
    console.log(`[seed] ${q.label}: ${q.base}`);
    const found = await client.searchReposRanged(q.base, q.ranges);
    const top = found
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, PER_QUERY_LIMIT);
    for (const r of top) collected.set(r.full_name, r);
    console.log(`[seed]   → ${top.length} 件（累計 ${collected.size} 件）`);
  }

  let added = 0;
  const sorted = [...collected.values()].sort((a, b) => b.stargazers_count - a.stargazers_count);
  for (const gh of sorted) {
    if (repos.has(gh.full_name)) continue;
    if (repos.size >= TRACKING_LIMIT) {
      console.log(`[seed] 上限 ${TRACKING_LIMIT} 件に到達したので打ち切ります`);
      break;
    }
    const repo = newRepository(gh);
    repos.set(repo.id, repo);
    if (!dryRun) await saveRepo(repo);
    added++;
  }

  console.log(
    `[seed] ${dryRun ? '（dry-run）' : ''}新規 ${added} 件を追加。追跡対象は合計 ${repos.size} 件`
  );
  console.log(`[seed] API リクエスト: ${client.requestCount} 回 / 残り ${client.remaining}`);
  console.log('[seed] 次は `npm run collect` を毎日動かして、スナップショットを貯めてください');
}

main().catch((e) => {
  console.error('[seed] 失敗', e);
  process.exit(1);
});
