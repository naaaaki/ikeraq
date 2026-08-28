/**
 * スコアと index 判定（SPEC §2.4 / §2.5 / §7.2 / §7.4）
 *
 * ★ スコアは2軸に分ける。混ぜないこと（SPEC §7 冒頭）。
 *   usability_score      = 実運用に耐えるか（ライセンス・メンテ状況）
 *   fake_star_suspicion  = 数字が信用できるか（偽スターの疑い）
 *
 *   「AGPL だから使いにくい」と「スターが怪しい」を同じ数字に潰さない。
 */

import { THRESHOLDS as T } from './thresholds.js';
import { detectLowActivity, detectNoRealUsage, detectStarSpike } from './flags.js';
import { daysSince } from './date.js';
import type { FakeStarSuspicion, Flag, Repository } from '../../src/types.js';
import type { StarHistory } from './flags.js';

/**
 * usability_score（0-100）★実運用可否のみ（SPEC §7.4）
 *
 * 偽スター系のフラグはここに含めない。
 * スコアは単独で表示せず、必ずフラグの内訳とセットで見せること。
 */
export function usabilityScore(flags: Flag[]): number {
  let score = 100;
  for (const flag of flags) {
    if (flag.axis !== 'usability') continue;
    const penalty = (T.penalty as Record<string, number>)[flag.id];
    if (penalty) score -= penalty;
  }
  return Math.max(0, score);
}

/**
 * 偽スター疑いの判定（SPEC §7.2）
 *
 * 論文 StarScout のシグナルを、GitHub API で取れる範囲で簡易再現する。
 * 該当シグナル数 0→none / 1→low / 2→medium / 3以上→high
 *
 * ★ 断定しない。表記は必ず「疑い」に留める。
 */
export function fakeStarSuspicion(
  repo: Repository,
  history: StarHistory,
  now = new Date()
): { level: FakeStarSuspicion; signals: string[] } {
  const signals: string[] = [];

  const spike = detectStarSpike(repo, history, now);
  if (spike.flagged) {
    signals.push(spike.provisional ? 'スター速度の異常（暫定）' : 'スター速度の異常');
  }

  if (detectLowActivity(repo)) signals.push('低活動');

  const ageDays = daysSince(repo.created_at, now);
  if (ageDays <= T.tooNewDays && repo.stars > T.tooNewStars) signals.push('新規性');

  if (detectNoRealUsage(repo).flagged) signals.push('実利用の欠如');

  const level: FakeStarSuspicion =
    signals.length === 0 ? 'none' : signals.length === 1 ? 'low' : signals.length === 2 ? 'medium' : 'high';

  return { level, signals };
}

/**
 * 履歴が足りず、判定を確定できない状態か（SPEC §7.3）
 * UI では「判定中」と表示し、確定した判定と区別する。
 */
export function isSuspicionProvisional(repo: Repository): boolean {
  return repo.snapshot_days < T.spikeMinHistoryDays;
}

/**
 * 個別ページを「生成する」か（SPEC §2.4）
 *
 * ★ 全件を個別ページ化しない。これが scaled content abuse を避ける要（SPEC §2.3 S1）。
 */
export function shouldGeneratePage(
  repo: Repository,
  latestDelta: number | null
): boolean {
  if (repo.stars >= T.pageGeneration.minStars) return true;
  if ((latestDelta ?? 0) >= T.pageGeneration.minDailyDelta) return true;
  if (repo.flags.length > 0) return true; // 注意喚起に価値がある
  if (repo.human_note !== null) return true; // 手動で「注目」指定したもの
  return false;
}

/**
 * 個別ページを「index させる」か（SPEC §2.5）
 *
 * ★ 生成と index は別の判定。
 *   警告つきこそ本サイトが見せたいコンテンツなので、必ず index する。
 * ★ usability_score は index 判定に使わない。
 *   低スコア＝価値がない、ではなく、低スコアであること自体が読者への情報だから。
 */
export function isIndexable(repo: Repository): boolean {
  return (
    repo.flags.length > 0 ||
    repo.fake_star_suspicion !== 'none' ||
    repo.human_note !== null ||
    repo.snapshot_days >= T.indexableSnapshotDays
  );
}
