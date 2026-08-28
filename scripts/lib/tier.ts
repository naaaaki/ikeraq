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

/** 追跡対象の上限（SPEC §10.4）。増やすのは1ヶ月運用してAPI消費の実測が出てから */
export const TRACKING_LIMIT = 1000;

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
 */
export function evictable(repo: Repository): boolean {
  return repo.tracking_tier === 'dormant' && repo.stars_stagnant_days >= DORMANT_DAYS;
}
