/**
 * 判定に使う閾値をすべてここに集める（SPEC §7）
 *
 * ★ この値は /about/criteria でそのまま公開する。
 *   判定基準を隠さないことが、このサイトの信頼の源泉である（SPEC §8.3）。
 *
 * ★ 仕様書 §15 のとおり、重み付け・閾値は「運用しながら調整する前提」の TBD。
 *   変更したら docs/criteria.md も必ず更新すること。
 */

export const THRESHOLDS = {
  /** stale: 最終コミットからの日数がこれ以上ならメンテ停止の疑い（SPEC §7.1） */
  staleDays: 180,

  /** thin_readme: README がこの文字数未満ならドキュメント不足（SPEC §7.1） */
  thinReadmeLength: 500,

  /** abnormal_fork_ratio: forks / stars がこれを超えたら不自然（SPEC §7.1） */
  forkRatioMax: 0.5,
  /**
   * 学習教材系は fork されるのが前提なので、正常でもこの比率になる。
   * カテゴリが learning のときは閾値を緩める（SPEC §7.1 の誤検知注意）
   */
  forkRatioMaxLearning: 1.5,

  /** too_new: 作成からこの日数以内 かつ スターがこれを超えたら急成長（SPEC §7.1） */
  tooNewDays: 30,
  tooNewStars: 5000,

  /** star_spike: 日次増加が過去7日平均のこの倍数を超えたら急増（SPEC §7.1） */
  spikeMultiplier: 10,
  /** 平均が極端に小さいと倍率が暴れるので、最低限の増加数も条件にする */
  spikeMinDelta: 50,
  /** star_spike の判定に必要な履歴日数。これ未満は代替判定（SPEC §7.3） */
  spikeMinHistoryDays: 7,

  /** low_activity: この規模のスターがあるのに活動が伴わない場合に立てる */
  lowActivityMinStars: 1000,
  lowActivityForkRatio: 0.02,
  lowActivityContributors: 2,
  lowActivityOpenIssues: 2,

  /** 実利用の欠如（SPEC §7.5 の代替シグナル）。この本数以上そろったら該当 */
  noUsageSignalsRequired: 2,
  noUsageForkRatio: 0.01,
  noUsageIssueMinStars: 1000,

  /** duplicate_suspect: 類似名がこの日数以内に複数現れたら（SPEC §7.1） */
  duplicateWindowDays: 14,

  /** usability_score の減点（SPEC §7.4） */
  penalty: {
    archived: 50,
    no_license: 40,
    stale: 30,
    copyleft: 15,
    thin_readme: 10,
  },

  /** 個別ページの生成基準（SPEC §2.4） */
  pageGeneration: {
    minStars: 1000,
    minDailyDelta: 300,
  },

  /** index 判定に必要な履歴日数（SPEC §2.5） */
  indexableSnapshotDays: 7,
} as const;
