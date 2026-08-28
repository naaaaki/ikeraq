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
import { daysSince } from './date.js';
import type { Category, Flag, Repository } from '../../src/types.js';

/** そのリポジトリのスター履歴（実際に取得できた日のみ・古い順） */
export interface StarHistory {
  /** 日次増加の系列。取得しなかった日は含めない */
  deltas: number[];
  /** 直近の日次増加。履歴がなければ null */
  latestDelta: number | null;
}

export interface FlagContext {
  history: StarHistory;
  category: Category;
  /** duplicate_suspect: 同時期に現れた類似名リポジトリの id */
  similarIds: string[];
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

  // 単機能ライブラリでは正常に起きる。強い警告にしない（SPEC §7.1 の誤検知注意）
  if (repo.readme_length > 0 && repo.readme_length < T.thinReadmeLength) {
    flags.push({
      id: 'thin_readme',
      axis: 'usability',
      label: 'ドキュメントが少なめ',
      reason: `README が ${repo.readme_length} 字です（判定は ${T.thinReadmeLength} 字未満）。単機能のライブラリでは正常な場合もあります。`,
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// 偽スターの軸（SPEC §7.1 / §7.2）
// ---------------------------------------------------------------------------

/** star_spike の判定。履歴が7日に満たない場合は代替判定を使う（SPEC §7.3） */
export function detectStarSpike(
  repo: Repository,
  history: StarHistory,
  now = new Date()
): { flagged: boolean; provisional: boolean; reason: string | null } {
  const latest = history.latestDelta;
  if (latest === null || latest < T.spikeMinDelta) {
    return { flagged: false, provisional: false, reason: null };
  }

  const past = history.deltas.slice(0, -1);
  if (past.length >= T.spikeMinHistoryDays) {
    const window = past.slice(-T.spikeMinHistoryDays);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    const flagged = avg > 0 ? latest > avg * T.spikeMultiplier : true;
    return {
      flagged,
      provisional: false,
      reason: flagged
        ? `直近の増加 ${latest} が、過去${window.length}日の平均 ${avg.toFixed(1)} の ${(latest / Math.max(avg, 1)).toFixed(1)} 倍です。`
        : null,
    };
  }

  // ★ 履歴が足りない場合の代替判定（SPEC §7.3）。
  //   新規に検知したリポジトリは常にこの状態になるため、恒久的に必要なロジック。
  const ageDays = Math.max(daysSince(repo.created_at, now), 1);
  const lifetimeAvg = repo.stars / ageDays;
  const flagged = latest > lifetimeAvg * T.spikeMultiplier;
  return {
    flagged,
    provisional: true,
    reason: flagged
      ? `直近の増加 ${latest} が、公開以来の平均 ${lifetimeAvg.toFixed(1)}/日 を大きく上回ります。当サイトの履歴が ${history.deltas.length} 日分のため、暫定の判定です。`
      : null,
  };
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
  if (repo.open_issues === 0 && repo.stars >= T.noUsageIssueMinStars)
    signals.push('スター数の割に Issue が1件もありません');
  if (repo.stars > 0 && repo.forks / repo.stars < T.noUsageForkRatio)
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

  const ageDays = daysSince(repo.created_at, now);
  if (ageDays <= T.tooNewDays && repo.stars > T.tooNewStars) {
    flags.push({
      id: 'too_new',
      axis: 'fake_star',
      label: '急成長・実績未知数',
      reason: `作成から ${ageDays} 日で ${repo.stars.toLocaleString()} スターに達しています。`,
    });
  }

  const spike = detectStarSpike(repo, ctx.history, now);
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
 * 区切り文字・数字・よくある接尾辞を落として比べる。
 */
export function normalizeRepoName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[._-]/g, '')
    .replace(/\d+$/, '')
    .replace(/(js|py|go|rs|ai|app|tool|cli|sdk)$/, '');
}
