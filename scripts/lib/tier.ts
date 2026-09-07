/**
 * 追跡対象の3層管理（SPEC §10.4）
 *
 * 全件を毎日見に行く必要はない。層ごとに更新頻度を変えることで
 * 1日の実リクエストを 300〜500 件程度（枠の1割以下）に収める。
 *
 * ★ 追跡をやめた期間のスター履歴は永久に欠損する。上限は減らさないこと。
 */

import { daysSince, daysBetween } from './date.js';
import type { Repository, TrackingTier } from '../../src/types.js';

/**
 * 「発見」に使う追跡枠（SPEC §10.4）。増やすのは1ヶ月運用してAPI消費の実測が出てから。
 *
 * ★ これは上限そのものではない。紹介文を書いたものは、この枠とは**別に**数える
 *   （trackingCapacity を見ること）。記事つきをこの枠の中で守ると、記事が増えるほど
 *   新しいものを見つける力が落ちる。週3本なら年150件で、6〜7年で枠が全部埋まる（D-013）。
 */
export const TRACKING_LIMIT = 1000;

/**
 * いま許される追跡件数。発見枠 ＋ 紹介文を書いたもの。
 *
 * ★ 記事つきを別枠にするのは、記事を書いた時点で「そのページは読まれる前提」に
 *   なるため。数字の更新が止まったページを残すのは、書いた意味を損なう。
 * ★ 負担はほぼ増えない。記事つきは伸びが止まると休眠層に落ち、週1回しか見に行かない。
 */
export function trackingCapacity(repos: Iterable<Repository>): number {
  let noted = 0;
  for (const r of repos) if (r.human_note !== null) noted++;
  return TRACKING_LIMIT + noted;
}

/**
 * 初期シードで埋める上限。
 * 上限いっぱいまで埋めると、翌日から新規トレンドを1件も追跡できなくなる。
 * 新規用に枠を空けておく（SPEC §10.4 の「トレンド系はほぼカバーできる」を満たす範囲）。
 */
export const SEED_LIMIT = 700;

/** 停滞がこの日数を超えたら休眠層とみなす（SPEC §10.4） */
export const DORMANT_DAYS = 90;

/** 層の判定（SPEC §10.4 の表） */
export function decideTier(repo: Repository, prevStarsDelta: number | null, now = new Date()): TrackingTier {
  const detectedDaysAgo = daysSince(repo.first_seen_at, now);
  const growing = (prevStarsDelta ?? 0) > 0;

  // ホット: 直近30日に検知 or スター増加中
  if (detectedDaysAgo <= 30 || growing) return 'hot';

  // 休眠: 90日以上スターがほぼ動いていない
  if (repo.stars_stagnant_days >= DORMANT_DAYS) return 'dormant';

  return 'normal';
}

/** 今日この層を取得すべきか。hot=毎日 / normal=3日に1回 / dormant=週1回 */
export function shouldFetchToday(repo: Repository, today: string): boolean {
  if (!repo.last_fetched_date) return true;
  const elapsed = daysBetween(today, repo.last_fetched_date);
  switch (repo.tracking_tier) {
    case 'hot':
      return elapsed >= 1;
    case 'normal':
      return elapsed >= 3;
    case 'dormant':
      return elapsed >= 7;
  }
}

/**
 * 追跡枠が足りないときに押し出してよいか。
 *
 * ★ 押し出したリポジトリのスター履歴は二度と取れない（SPEC §10.4）。
 *   条件は「休眠層かつ90日以上停滞」に限定し、それ以外は絶対に外さない。
 *
 * ★ 紹介文を書いたものは絶対に押し出さない（D-013）。
 *   押し出してもページ自体は残るが、スター推移も「今日の増加」も止まる。
 *   読者には「なぜ止まったか」が分からず、気づく手立てもない。
 */
export function evictable(repo: Repository): boolean {
  if (repo.human_note !== null) return false;
  return repo.tracking_tier === 'dormant' && repo.stars_stagnant_days >= DORMANT_DAYS;
}
