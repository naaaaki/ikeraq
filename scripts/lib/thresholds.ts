/**
 * 判定に使う閾値をすべてここに集める（SPEC §7 / D-004）
 *
 * ★ この値は /about/criteria でそのまま公開する。
 *   判定基準を隠さないことが、このサイトの誠実さの担保になる（SPEC §8.3）。
 *
 * ★ 偽スター判定の閾値は D-004 で全廃した。
 * ★ 仕様書 §15 のとおり、重み付け・閾値は「運用しながら調整する前提」の TBD。
 *   変更したら docs/criteria.md も必ず更新すること。
 */

import type { FlagId } from '../../src/types.js';

export const THRESHOLDS = {
  /** stale: 最終コミットからの日数がこれ以上ならメンテ停止の疑い（SPEC §7.1） */
  staleDays: 180,

  /** thin_readme: README がこの文字数未満ならドキュメント不足（SPEC §7.1） */
  thinReadmeLength: 500,

  /** usability_score の減点（SPEC §7.4） */
  penalty: {
    archived: 50,
    no_license: 40,
    stale: 30,
    copyleft: 15,
    thin_readme: 10,
  } satisfies Record<FlagId, number>,

  /** 個別ページの生成基準（SPEC §2.4） */
  pageGeneration: {
    minStars: 1000,
    minDailyDelta: 300,
  },

  /** index 判定に必要な履歴日数（SPEC §2.5） */
  indexableSnapshotDays: 7,
} as const;
