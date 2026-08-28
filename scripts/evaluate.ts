/**
 * 機械判定（SPEC §11-4）
 *
 * 収集したデータに、フラグ・カテゴリ・スコア・index 判定を付けて保存し直す。
 * 日次パイプラインでは collect.ts の直後に実行する。
 *
 * ★ LLM / 外部API を一切呼ばない。ネットワークアクセスなしで完結する（SPEC §9.1）。
 *   そのため何度でも安全に再実行でき、閾値を変えたら流し直せる。
 *
 *   npm run evaluate            判定して保存
 *   npm run evaluate -- --dry-run   保存せず結果だけ出す
 */

import { categorize } from './lib/categorize.js';
import { detectFlags } from './lib/flags.js';
import { buildSimilarityIndex } from './lib/similarity.js';
import { fakeStarSuspicion, isIndexable, shouldGeneratePage, usabilityScore } from './lib/score.js';
import { THRESHOLDS as T } from './lib/thresholds.js';
import { todayJST } from './lib/date.js';
import {
  listSnapshotDates,
  loadAllRepos,
  loadSnapshot,
  saveRepoIfChanged,
} from './lib/storage.js';
import type { DailySnapshot, FakeStarSuspicion, Repository } from '../src/types.js';
import type { StarHistory } from './lib/flags.js';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const today = todayJST();

  const repos = await loadAllRepos();
  if (repos.length === 0) {
    console.log('[evaluate] 追跡対象がありません。先に `npm run seed` と `npm run collect` を実行してください');
    return;
  }
  console.log(`[evaluate] 対象 ${repos.length} 件${dryRun ? '（dry-run）' : ''}`);

  // ------------------------------------------------------------------
  // スター履歴を組み立てる。実際に取得できた日だけを使う（SPEC §6.2）
  // ------------------------------------------------------------------
  const histories = await buildHistories();
  const latestDeltas = await loadLatestDeltas();

  // duplicate_suspect 用に、同時期に現れた類似名をあらかじめ突き合わせる
  const similar = buildSimilarityIndex(repos);

  const summary = { none: 0, low: 0, medium: 0, high: 0 } as Record<FakeStarSuspicion, number>;
  let flaggedCount = 0;
  let indexableCount = 0;
  let pageCount = 0;
  let written = 0;

  for (const repo of repos) {
    const history = histories.get(repo.id) ?? { deltas: [], latestDelta: null };
    const category = categorize(repo.topics, repo.language, repo.name);

    const flags = detectFlags(repo, {
      history,
      category,
      similarIds: similar.get(repo.id) ?? [],
    });
    const suspicion = fakeStarSuspicion(repo, history);

    const evaluated: Repository = {
      ...repo,
      category,
      flags,
      usability_score: usabilityScore(flags),
      fake_star_suspicion: suspicion.level,
    };
    // is_indexable は確定後のフラグ・疑いを見て判定する（SPEC §2.5）
    evaluated.is_indexable = isIndexable(evaluated);

    summary[suspicion.level]++;
    if (flags.length > 0) flaggedCount++;
    if (evaluated.is_indexable) indexableCount++;
    if (shouldGeneratePage(evaluated, latestDeltas.get(repo.id) ?? null)) pageCount++;

    if (!dryRun && (await saveRepoIfChanged(evaluated))) written++;
  }

  console.log('');
  console.log('===== 判定結果 =====');
  console.log(`警告フラグあり : ${flaggedCount} 件`);
  console.log(
    `偽スター疑い   : none ${summary.none} / low ${summary.low} / medium ${summary.medium} / high ${summary.high}`
  );
  console.log(`個別ページ生成 : ${pageCount} 件（SPEC §2.4 の生成基準）`);
  console.log(`うち index 対象: ${indexableCount} 件（SPEC §2.5）`);
  console.log(`履歴の必要日数 : ${T.spikeMinHistoryDays} 日（未満は暫定判定・SPEC §7.3）`);
  if (!dryRun) console.log(`\n[evaluate] ${written} 件を更新しました（${today}）`);
}

// ---------------------------------------------------------------------------
// スナップショットからスター履歴を組み立てる
// ---------------------------------------------------------------------------

async function buildHistories(): Promise<Map<string, StarHistory>> {
  const dates = await listSnapshotDates();
  const histories = new Map<string, StarHistory>();

  for (const date of dates) {
    const snapshot = await loadSnapshot(date);
    if (!snapshot) continue;
    for (const entry of snapshot.entries) {
      // ★ 見ていない日・差分が不明な日は履歴に入れない。
      //   入れると「動かなかった日」と混ざり、急増の判定が鈍る
      if (!entry.fetched || entry.stars_delta === null) continue;
      const h = histories.get(entry.repo_id) ?? { deltas: [], latestDelta: null };
      h.deltas.push(entry.stars_delta);
      h.latestDelta = entry.stars_delta;
      histories.set(entry.repo_id, h);
    }
  }
  return histories;
}

/** 最新スナップショットの日次増加。個別ページの生成基準に使う（SPEC §2.4） */
async function loadLatestDeltas(): Promise<Map<string, number>> {
  const dates = await listSnapshotDates();
  const latest = dates.at(-1);
  if (!latest) return new Map();
  const snapshot: DailySnapshot | null = await loadSnapshot(latest);
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
