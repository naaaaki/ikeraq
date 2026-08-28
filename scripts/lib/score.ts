/**
 * スコアと公開判定（SPEC §2.4 / §2.5 / §7.4 / D-004）
 *
 * ★ 偽スター疑い（fake_star_suspicion）は D-004 で廃止した。
 *   残っているのは「実運用に耐えるか」の1軸だけ。
 */

import { THRESHOLDS as T } from './thresholds.js';
import type { Flag, FlagId, Repository } from '../../src/types.js';

/**
 * usability_score（0-100）実運用に耐えるか（SPEC §7.4）
 *
 * スコアは単独で表示せず、必ずフラグの内訳とセットで見せること。
 * 数字だけを出すと、何が問題なのか読み手に伝わらない。
 */
export function usabilityScore(flags: Flag[]): number {
  // 減点表への登録漏れは型で検出する（thresholds.ts の satisfies）
  const penalties: Record<FlagId, number> = T.penalty;
  let score = 100;
  for (const flag of flags) score -= penalties[flag.id] ?? 0;
  return Math.max(0, score);
}

/**
 * 個別ページを「生成する」か（SPEC §2.4）
 *
 * ★ 全件を個別ページ化しない。これが scaled content abuse を避ける要（SPEC §2.3 S1）。
 * ★ 日本語の紹介文があるものは必ず作る。それがこのサイトの主役だから（D-001）。
 */
export function shouldGeneratePage(repo: Repository, latestDelta: number | null): boolean {
  if (repo.human_note !== null) return true; // 紹介文を書いたもの
  if (repo.stars >= T.pageGeneration.minStars) return true;
  if ((latestDelta ?? 0) >= T.pageGeneration.minDailyDelta) return true;
  if (repo.flags.length > 0) return true; // 注意喚起に価値がある
  return false;
}

/**
 * 個別ページを「index させる」か（SPEC §2.5）
 *
 * ★ 生成と index は別の判定。
 * ★ usability_score は index 判定に使わない。
 *   低スコア＝価値がない、ではなく、低スコアであること自体が読者への情報だから。
 * ★ 英語 description を訳しただけのページは作らない・index しない（SPEC §2.3 S6）。
 *   独自の価値は「日本語の紹介文」「警告」「スター推移」のいずれかで担保する。
 */
export function isIndexable(repo: Repository, latestDelta: number | null): boolean {
  // そもそもページを作らないものを index 対象に数えない（sitemap に404が並ぶのを防ぐ）
  if (!shouldGeneratePage(repo, latestDelta)) return false;

  return (
    repo.human_note !== null ||
    repo.flags.length > 0 ||
    repo.snapshot_days >= T.indexableSnapshotDays
  );
}
