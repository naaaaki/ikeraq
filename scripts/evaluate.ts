/**
 * 機械判定（SPEC §11-4 / D-004）
 *
 * 収集したデータに、日本語の紹介文・カテゴリ・警告フラグ・スコア・公開判定を付けて保存する。
 * 日次パイプラインでは collect.ts の直後に実行する。
 *
 * ★ LLM / 外部API を一切呼ばない。ネットワークアクセスなしで完結する（SPEC §9.1）。
 *   そのため何度でも安全に再実行でき、閾値を変えたら流し直せる。
 *
 *   npm run evaluate                判定して保存
 *   npm run evaluate -- --dry-run   保存せず結果だけ出す
 */

import { categorize } from './lib/categorize.js';
import { detectFlags } from './lib/flags.js';
import { loadNotes } from './lib/notes.js';
import { isIndexable, shouldGeneratePage, usabilityScore } from './lib/score.js';
import { todayJST } from './lib/date.js';
import {
  listSnapshotDates,
  loadAllRepos,
  loadSnapshot,
  saveRepoIfChanged,
} from './lib/storage.js';
import type { Repository } from '../src/types.js';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const today = todayJST();

  const repos = await loadAllRepos();
  if (repos.length === 0) {
    console.log('[evaluate] 追跡対象がありません。先に `npm run seed` と `npm run collect` を実行してください');
    return;
  }

  // ★ 日本語の紹介文を取り込む。これがこのサイトの主役（D-002）
  const notes = await loadNotes();
  const latestDeltas = await loadLatestDeltas();
  console.log(`[evaluate] 対象 ${repos.length} 件 / 紹介文 ${notes.size} 件${dryRun ? '（dry-run）' : ''}`);

  let flaggedCount = 0;
  let indexableCount = 0;
  let pageCount = 0;
  let written = 0;

  for (const repo of repos) {
    const flags = detectFlags(repo);
    const evaluated: Repository = {
      ...repo,
      category: categorize(repo.topics, repo.language, repo.name),
      human_note: notes.get(repo.id)?.body ?? null,
      flags,
      usability_score: usabilityScore(flags),
    };
    const latestDelta = latestDeltas.get(repo.id) ?? null;
    evaluated.is_indexable = isIndexable(evaluated, latestDelta);

    if (flags.length > 0) flaggedCount++;
    if (evaluated.is_indexable) indexableCount++;
    if (shouldGeneratePage(evaluated, latestDelta)) pageCount++;

    if (!dryRun && (await saveRepoIfChanged(evaluated))) written++;
  }

  console.log('');
  console.log('===== 判定結果 =====');
  console.log(`日本語の紹介文 : ${notes.size} 件 ★このサイトの主役`);
  console.log(`警告フラグあり : ${flaggedCount} 件`);
  console.log(`個別ページ生成 : ${pageCount} 件（SPEC §2.4 の生成基準）`);
  console.log(`うち index 対象: ${indexableCount} 件（生成対象の内数・SPEC §2.5）`);
  if (!dryRun) console.log(`\n[evaluate] ${written} 件を更新しました（${today}）`);
}

/** 最新スナップショットの日次増加。個別ページの生成基準に使う（SPEC §2.4） */
async function loadLatestDeltas(): Promise<Map<string, number>> {
  const dates = await listSnapshotDates();
  const latest = dates.at(-1);
  if (!latest) return new Map();
  const snapshot = await loadSnapshot(latest);
  if (!snapshot) return new Map();
  return new Map(
    snapshot.entries
      .filter((e) => e.fetched && e.stars_delta !== null)
      .map((e) => [e.repo_id, e.stars_delta as number])
  );
}

main().catch((e) => {
  console.error('[evaluate] 失敗', e);
  process.exit(1);
});
