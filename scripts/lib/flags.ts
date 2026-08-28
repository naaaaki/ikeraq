/**
 * 警告フラグの判定（SPEC §7.1）
 *
 * ★ LLM は使わない。すべて決定的なロジックで判定する（SPEC §9.1）。
 * ★ 表記は必ず「疑い」に留め、断定しない（SPEC §7.2）。
 *   断定表現は名誉毀損リスクを生む。label / reason の文言を安易に強めないこと。
 *
 * 閾値は scripts/lib/thresholds.ts に集約し、/about/criteria で全公開する。
 */

import { THRESHOLDS as T } from './thresholds.js';
import { daysBetween, daysSince } from './date.js';
import type { Category, Flag, Repository } from '../../src/types.js';

/** そのリポジトリのスター履歴（実際に取得できた日のみ・古い順） */
export interface StarHistory {
  /** 日次増加の系列。取得しなかった日は含めない */
  deltas: number[];
  /** 直近の日次増加。履歴がなければ null */
  latestDelta: number | null;
  /**
   * 直近の観測日 (YYYY-MM-DD)。
   * ★ 3層構造により毎日は取得しないため、latestDelta が数日前の値のことがある。
   *   古い値を根拠に急増の警告を出し続けないよう、鮮度を見る
   */
  latestDate: string | null;
}

export interface FlagContext {
  history: StarHistory;
  category: Category;
  /** duplicate_suspect: 同時期に現れた類似名リポジトリの id */
  similarIds: string[];
  /** 判定基準日 (YYYY-MM-DD)。観測値の鮮度を見るのに使う */
  today?: string;
  now?: Date;
}

// ---------------------------------------------------------------------------
// 実運用の軸（SPEC §7.1）
// ---------------------------------------------------------------------------

function usabilityFlags(repo: Repository, now: Date): Flag[] {
  const flags: Flag[] = [];

  if (repo.is_archived) {
    flags.push({
      id: 'archived',
      axis: 'usability',
      label: 'アーカイブ済み',
      reason: '作者がアーカイブしています。新しい変更は入りません。',
    });
  }

  const idleDays = daysSince(repo.pushed_at, now);
  if (idleDays >= T.staleDays) {
    flags.push({
      id: 'stale',
      axis: 'usability',
      label: 'メンテ停止の疑い',
      reason: `最終コミットから ${idleDays} 日が経過しています（判定は ${T.staleDays} 日以上）。`,
    });
  }

  if (repo.license_category === 'none') {
    flags.push({
      id: 'no_license',
      axis: 'usability',
      label: '利用条件不明',
      reason:
        'ライセンスが設定されていません。この場合は原則として全権利が留保され、利用できません。',
    });
  }

  if (repo.license_category === 'strong-copyleft') {
    flags.push({
      id: 'copyleft',
      axis: 'usability',
      label: '自社サービス組込み注意',
      reason: `${repo.license_spdx ?? 'コピーレフト系'} です。組み込んだ側のソース公開が必要になる場合があります。`,
    });
  }

  // ★ null は「まだ取得できていない」なので判定しない。0 は「README が無い」なので判定する
  if (repo.readme_length !== null && repo.readme_length < T.thinReadmeLength) {
    // 単機能ライブラリでは正常に起きる。強い警告にしない（SPEC §7.1 の誤検知注意）
    flags.push({
      id: 'thin_readme',
      axis: 'usability',
      label: repo.readme_length === 0 ? 'README がありません' : 'ドキュメントが少なめ',
      reason:
        repo.readme_length === 0
          ? 'README が置かれていません。使い方を知るにはコードを読む必要があります。'
          : `README が ${repo.readme_length} 字です（判定は ${T.thinReadmeLength} 字未満）。単機能のライブラリでは正常な場合もあります。`,
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// 偽スターの軸（SPEC §7.1 / §7.2）
// ---------------------------------------------------------------------------

/** 中央値。平均だと1日の外れ値に引きずられる */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * star_spike の判定（SPEC §7.1 / §7.3）
 *
 * 本判定  : 過去7日の平均の10倍超
 * 代替判定: 履歴が7日に満たない間は、観測できた過去の中央値と比べる（SPEC §7.3）
 *
 * ★ 仕様書 §7.3 は代替として「公開以来の平均増加率（stars / 経過日数）」を挙げているが、
 *   これは判定の向きが逆になるため採用していない。
 *   - 古くて定番のリポジトリ … 生涯平均が小さいので、正常なトレンド入りでも警告が出る
 *   - 新しくて急伸したリポジトリ … 生涯平均が大きいので、本当に疑いたい対象に警告が出ない
 *   疑いたいのは後者なので、実際に観測できた増加の中央値と比べる方式にした。
 *   観測が1日も無い場合は判定せず「判定中」とする。
 *
 * ★ 暫定判定はシグナル数に数えない（SPEC §7.3「信頼度を下げる」）。
 *   数えると、検知直後のリポジトリが軒並み「疑いあり」になり、警告そのものが信用されなくなる。
 */
export function detectStarSpike(
  history: StarHistory,
  today?: string
): { flagged: boolean; provisional: boolean; reason: string | null } {
  const latest = history.latestDelta;
  const past = history.deltas.slice(0, -1);

  // 履歴が1日も無ければ判定できない
  if (latest === null || past.length === 0) {
    return { flagged: false, provisional: true, reason: null };
  }

  // ★ 観測が古い場合は判定しない。3層構造により毎日は取得しないため、
  //   数日前の急増を根拠に警告が出続けるのを防ぐ
  if (today && history.latestDate) {
    const age = daysBetween(today, history.latestDate);
    if (age > T.observationMaxAgeDays) {
      return { flagged: false, provisional: true, reason: null };
    }
  }

  if (latest < T.spikeMinDelta) {
    return { flagged: false, provisional: past.length < T.spikeMinHistoryDays, reason: null };
  }

  const confirmed = past.length >= T.spikeMinHistoryDays;
  const window = confirmed ? past.slice(-T.spikeMinHistoryDays) : past;
  const baseline = confirmed
    ? window.reduce((a, b) => a + b, 0) / window.length // 本判定は仕様どおり平均
    : median(window); // 代替判定は中央値（点数が少ないため）

  // 基準が0以下のとき（それまで増加が止まっていた）は、増加量の下限だけで判定する
  const flagged = baseline > 0 ? latest > baseline * T.spikeMultiplier : true;

  return {
    flagged,
    provisional: !confirmed,
    reason: flagged
      ? `直近の増加 ${latest} が、${confirmed ? `過去${window.length}日の平均` : `観測できた${window.length}日の中央値`} ${baseline.toFixed(1)} の ` +
        `${baseline > 0 ? `${(latest / baseline).toFixed(1)} 倍` : '水準を大きく上回ります'}です。` +
        (confirmed ? '' : ` 履歴が ${history.deltas.length} 日分のため、暫定の判定です。`)
      : null,
  };
}

/** too_new の判定。フラグとシグナルで同じ条件を使うため関数にする（SPEC §7.1 / §7.2） */
export function detectTooNew(repo: Repository, now = new Date()): boolean {
  return daysSince(repo.created_at, now) <= T.tooNewDays && repo.stars > T.tooNewStars;
}

/** 低活動: スター数に対し fork・Issue・contributor が極端に少ない（SPEC §7.1） */
export function detectLowActivity(repo: Repository): boolean {
  if (repo.stars < T.lowActivityMinStars) return false;
  const forkRatio = repo.forks / repo.stars;
  if (forkRatio >= T.lowActivityForkRatio) return false;
  const fewContributors =
    repo.contributors_count !== null && repo.contributors_count <= T.lowActivityContributors;
  const fewIssues = repo.open_issues <= T.lowActivityOpenIssues;
  return fewContributors || fewIssues;
}

/**
 * 実利用の欠如（SPEC §7.2 のシグナル / §7.5 のフォールバック）
 *
 * dependents_count が取れるならそれを使い、取れない場合は代替シグナルを合成する。
 * ★ スクレイピングで "Used by" を取りに行かないこと（SPEC §7.5）。
 */
export function detectNoRealUsage(repo: Repository): { flagged: boolean; signals: string[] } {
  if (repo.dependents_count !== null) {
    return {
      flagged: repo.dependents_count === 0,
      signals: repo.dependents_count === 0 ? ['他のリポジトリから利用されていません'] : [],
    };
  }

  const signals: string[] = [];
  if (repo.releases_count === 0) signals.push('リリースが1度も作られていません');
  if (repo.contributors_count !== null && repo.contributors_count <= 1)
    signals.push('作者以外の貢献者がいません');
  if (repo.open_issues === 0 && repo.stars >= T.noUsageMinStars)
    signals.push('スター数の割に Issue が1件もありません');
  // ★ スター下限が無いと、スター5・fork 0 のような小さなリポジトリを常に拾ってしまう。
  //   §7.5 の意図は「スターは多いのに使われていない」
  if (repo.stars >= T.noUsageMinStars && repo.forks / repo.stars < T.noUsageForkRatio)
    signals.push('スター数に対して fork が極端に少ない');

  return { flagged: signals.length >= T.noUsageSignalsRequired, signals };
}

function fakeStarFlags(repo: Repository, ctx: FlagContext, now: Date): Flag[] {
  const flags: Flag[] = [];

  // 学習教材系は fork されるのが前提。閾値を緩める（SPEC §7.1 の誤検知注意）
  const forkMax = ctx.category === 'learning' ? T.forkRatioMaxLearning : T.forkRatioMax;
  if (repo.stars > 0 && repo.forks / repo.stars > forkMax) {
    flags.push({
      id: 'abnormal_fork_ratio',
      axis: 'fake_star',
      label: '数値に不自然さあり',
      reason: `fork がスターの ${((repo.forks / repo.stars) * 100).toFixed(0)}% です（判定は ${(forkMax * 100).toFixed(0)}% 超）。`,
    });
  }

  if (detectTooNew(repo, now)) {
    flags.push({
      id: 'too_new',
      axis: 'fake_star',
      label: '急成長・実績未知数',
      reason: `作成から ${daysSince(repo.created_at, now)} 日で ${repo.stars.toLocaleString()} スターに達しています。`,
    });
  }

  const spike = detectStarSpike(ctx.history, ctx.today);
  if (spike.flagged) {
    flags.push({
      id: 'star_spike',
      axis: 'fake_star',
      label: spike.provisional ? 'スター急増（暫定判定）' : 'スター急増',
      reason: spike.reason ?? '',
    });
  }

  if (detectLowActivity(repo)) {
    flags.push({
      id: 'low_activity',
      axis: 'fake_star',
      label: '活動量に対しスターが多い',
      reason: `スター ${repo.stars.toLocaleString()} に対し、fork ${repo.forks} / Issue ${repo.open_issues}${
        repo.contributors_count !== null ? ` / 貢献者 ${repo.contributors_count}` : ''
      } です。`,
    });
  }

  if (ctx.similarIds.length > 0) {
    flags.push({
      id: 'duplicate_suspect',
      axis: 'fake_star',
      label: '類似リポジトリ複数あり',
      reason: `同じ時期に似た名前のリポジトリが ${ctx.similarIds.length} 件見つかりました。`,
    });
  }

  return flags;
}

/** そのリポジトリに立つ警告フラグをすべて返す */
export function detectFlags(repo: Repository, ctx: FlagContext): Flag[] {
  const now = ctx.now ?? new Date();
  return [...usabilityFlags(repo, now), ...fakeStarFlags(repo, ctx, now)];
}

/**
 * 名前の正規化。duplicate_suspect の比較に使う。
 * 区切り文字と末尾の数字だけを落とす。
 *
 * ★ 言語サフィックス（-go / -rs など）は落とさない。
 *   落とすと langchain-go と langchain-rs が同一視され、
 *   正当な言語ポートを「重複の疑い」として警告してしまう。
 *   また cargo → car のような意図しない削りも起きる。
 */
export function normalizeRepoName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[._-]/g, '')
    .replace(/\d+$/, '');
}
