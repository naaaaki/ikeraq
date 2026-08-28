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
  // ★ スナップショットの読み込みは1回で済ませる（全ファイル×2回読むのは無駄）
  const { histories, latestDeltas } = await buildHistories();

  // duplicate_suspect 用に、同時期に現れた類似名をあらかじめ突き合わせる
  const similar = buildSimilarityIndex(repos);

  const summary = { none: 0, low: 0, medium: 0, high: 0 } as Record<FakeStarSuspicion, number>;
  let flaggedCount = 0;
  let indexableCount = 0;
  let pageCount = 0;
  let provisionalCount = 0;
  let written = 0;

  for (const repo of repos) {
    const history = histories.get(repo.id) ?? { deltas: [], latestDelta: null, latestDate: null };
    const latestDelta = latestDeltas.get(repo.id) ?? null;
    const category = categorize(repo.topics, repo.language, repo.name);

    const flags = detectFlags(repo, {
      history,
      category,
      similarIds: similar.get(repo.id) ?? [],
      today,
    });
    const suspicion = fakeStarSuspicion(repo, history, new Date(), today);

    const evaluated: Repository = {
      ...repo,
      category,
      flags,
      usability_score: usabilityScore(flags),
      fake_star_suspicion: suspicion.level,
      // ★ 根拠を保存する。「実利用の欠如」はフラグを持たないシグナルなので、
      //   これが無いと理由を表示できない警告が生まれる（SPEC §8.3）
      suspicion_signals: suspicion.signals,
      suspicion_provisional: suspicion.provisional,
    };
    // is_indexable は確定後のフラグ・疑いを見て判定する（SPEC §2.5）
    evaluated.is_indexable = isIndexable(evaluated, latestDelta);

    summary[suspicion.level]++;
    if (flags.length > 0) flaggedCount++;
    if (evaluated.is_indexable) indexableCount++;
    if (shouldGeneratePage(evaluated, latestDelta)) pageCount++;
    if (suspicion.provisional) provisionalCount++;

    if (!dryRun && (await saveRepoIfChanged(evaluated))) written++;
  }

  console.log('');
  console.log('===== 判定結果 =====');
  console.log(`警告フラグあり : ${flaggedCount} 件`);
  console.log(
    `偽スター疑い   : none ${summary.none} / low ${summary.low} / medium ${summary.medium} / high ${summary.high}`
  );
  console.log(`  うち判定中   : ${provisionalCount} 件（履歴 ${T.spikeMinHistoryDays} 日未満・SPEC §7.3）`);
  console.log(`個別ページ生成 : ${pageCount} 件（SPEC §2.4 の生成基準）`);
  console.log(`うち index 対象: ${indexableCount} 件（生成対象の内数・SPEC §2.5）`);
  if (!dryRun) console.log(`\n[evaluate] ${written} 件を更新しました（${today}）`);
}

// ---------------------------------------------------------------------------
// スナップショットからスター履歴を組み立てる
// ---------------------------------------------------------------------------

async function buildHistories(): Promise<{
  histories: Map<string, StarHistory>;
  latestDeltas: Map<string, number>;
}> {
  const dates = await listSnapshotDates();
  const histories = new Map<string, StarHistory>();
  const latestDeltas = new Map<string, number>();
  const lastDate = dates.at(-1);

  for (const date of dates) {
    const snapshot: DailySnapshot | null = await loadSnapshot(date);
    if (!snapshot) continue;
    for (const entry of snapshot.entries) {
      // ★ 見ていない日・差分が不明な日は履歴に入れない。
      //   入れると「動かなかった日」と混ざり、急増の判定が鈍る
      if (!entry.fetched || entry.stars_delta === null) continue;
      const h = histories.get(entry.repo_id) ?? { deltas: [], latestDelta: null, latestDate: null };
      h.deltas.push(entry.stars_delta);
      h.latestDelta = entry.stars_delta;
      h.latestDate = snapshot.date;
      histories.set(entry.repo_id, h);

      // 最新スナップショットの増加は、個別ページの生成基準に使う（SPEC §2.4）
      if (snapshot.date === lastDate) latestDeltas.set(entry.repo_id, entry.stars_delta);
    }
  }
  return { histories, latestDeltas };
}

main().catch((e) => {
  console.error('[evaluate] 失敗', e);
  process.exit(1);
});
