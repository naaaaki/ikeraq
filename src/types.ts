/**
 * Wakuru データモデル定義（SPEC §6）
 *
 * このファイルは scripts（収集・判定）と src（Astro 表示）の両方から参照する。
 * データ構造の変更は必ずここから行うこと。
 */

// ---------------------------------------------------------------------------
// ライセンス
// ---------------------------------------------------------------------------

/** ライセンス区分（SPEC §6.1） */
export type LicenseCategory =
  | 'permissive' // MIT / Apache-2.0 / BSD 等
  | 'weak-copyleft' // LGPL / MPL 等
  | 'strong-copyleft' // GPL / AGPL 等
  | 'none' // ライセンス未設定
  | 'unknown'; // 判定不能

// ---------------------------------------------------------------------------
// カテゴリ（SPEC §6.3・ルールベース分類。LLM は使わない）
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  'ai-agent',
  'llm',
  'dev-tool',
  'infra',
  'web-frontend',
  'backend',
  'data',
  'security',
  'mobile',
  'game',
  'learning',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

// ---------------------------------------------------------------------------
// 警告フラグ（SPEC §7.1）
// ---------------------------------------------------------------------------

/** 実運用可否の軸に効くフラグ */
export const USABILITY_FLAGS = [
  'stale',
  'archived',
  'no_license',
  'copyleft',
  'thin_readme',
] as const;

/** 偽スター疑いの軸に効くフラグ */
export const FAKE_STAR_FLAGS = [
  'abnormal_fork_ratio',
  'too_new',
  'star_spike',
  'low_activity',
  'duplicate_suspect',
] as const;

export type UsabilityFlagId = (typeof USABILITY_FLAGS)[number];
export type FakeStarFlagId = (typeof FAKE_STAR_FLAGS)[number];
export type FlagId = UsabilityFlagId | FakeStarFlagId;

/** フラグがどちらの軸のものか（SPEC §7 の2軸分離） */
export type FlagAxis = 'usability' | 'fake_star';

export interface Flag {
  id: FlagId;
  axis: FlagAxis;
  /** 日本語の表示文言（例: 「⚠ メンテ停止の疑い」） */
  label: string;
  /** なぜ立ったかの説明。/about/criteria と個別ページで表示する */
  reason: string;
}

/** 偽スター疑い（SPEC §7.2）。断定はしない */
export type FakeStarSuspicion = 'none' | 'low' | 'medium' | 'high';

// ---------------------------------------------------------------------------
// 追跡層（SPEC §10.4）
// ---------------------------------------------------------------------------

export type TrackingTier =
  | 'hot' // 毎日
  | 'normal' // 3日に1回
  | 'dormant'; // 週1回

// ---------------------------------------------------------------------------
// repositories（マスタ）SPEC §6.1
// data/repos/{owner}/{name}.json に1リポジトリ1ファイルで保存する
// ---------------------------------------------------------------------------

export interface Repository {
  /** `owner/name`（主キー） */
  id: string;
  owner: string;
  name: string;

  /** GitHub 原文の description。翻訳・要約はしない（SPEC §9.1） */
  description_en: string | null;
  /** 手動コメント。人間が書く。任意（SPEC §17.1） */
  human_note: string | null;

  language: string | null;
  topics: string[];

  stars: number;
  forks: number;
  /**
   * 本当のウォッチャー数（API の subscribers_count）。
   * 検索APIのレスポンスには含まれないため、個別取得するまで null。
   * ★ API の watchers_count はスター数と同じ値なので使わないこと
   */
  watchers: number | null;
  open_issues: number;

  /** リポジトリ作成日 (ISO8601) */
  created_at: string;
  /** 最終コミット日 (ISO8601) */
  pushed_at: string;
  is_archived: boolean;

  license_spdx: string | null;
  license_category: LicenseCategory;

  /** README 抜粋。最大500字（SPEC §8.2） */
  readme_excerpt: string;
  /**
   * README の文字数。薄さ判定用。
   * ★ null = まだ取得できていない（判定対象外）
   *   0    = README が存在しない（判定対象。最も薄いケース）
   *   この2つを混ぜると「READMEが無い」が無警告で素通りする
   */
  readme_length: number | null;
  /** README.ja.md 等の有無 */
  has_japanese_readme: boolean;

  contributors_count: number | null;
  /** dependents_count の代替候補（SPEC §7.5） */
  releases_count: number | null;
  /** 取得可否を Phase 0 で検証（SPEC §7.5） */
  dependents_count: number | null;
  ossf_scorecard: number | null;

  /** topics と language からのルールベース分類（SPEC §6.3） */
  category: Category | null;

  // --- 機械判定の結果（Phase 1 で埋める。Phase 0 では初期値のまま） ---
  flags: Flag[];
  /** 0-100。実運用可否のみ（SPEC §7.4） */
  usability_score: number;
  /** 数字が信用できるか。usability_score とは別軸（SPEC §7.2） */
  fake_star_suspicion: FakeStarSuspicion;
  /**
   * どのシグナルで疑いが立ったか。
   * ★「実利用の欠如」はフラグを持たないシグナルなので、これを保存しないと
   *   「理由の表示できない警告」が生まれる。根拠の公開は §8.3 の要件
   */
  suspicion_signals: string[];
  /**
   * 履歴が足りず、判定が暫定である（SPEC §7.3）。
   * UI では「判定中」と表示し、確定した判定と区別する
   */
  suspicion_provisional: boolean;

  /** 蓄積されたスナップショット日数（SPEC §2.5 の index 判定で使用） */
  snapshot_days: number;
  /** index 判定の結果（SPEC §2.5） */
  is_indexable: boolean;

  /** 本サイトが最初に検知した日時 (ISO8601) */
  first_seen_at: string;

  // --- 追跡管理（SPEC §10.4） ---
  tracking_tier: TrackingTier;
  /** 最後にメタデータを取得した日 (YYYY-MM-DD) */
  last_fetched_date: string;
  /** スターがほぼ動いていない連続日数。休眠層の判定に使う（SPEC §10.4） */
  stars_stagnant_days: number;
}

// ---------------------------------------------------------------------------
// daily_snapshots（時系列）SPEC §6.2 ★最重要資産
// data/snapshots/YYYY-MM-DD.json に1日1ファイルで保存する
// この履歴は後から遡って取得できない
// ---------------------------------------------------------------------------

export interface SnapshotEntry {
  repo_id: string;
  stars: number;
  /**
   * 1日あたりに均した増加数。前日データがなければ null。
   * 前回スナップショットが数日前の場合は日数で割ってある
   */
  stars_delta: number | null;
  /** 均す前の生の増加数。後から判定ロジックを見直せるように残す */
  stars_delta_raw: number | null;
  forks: number;
  /** その日の順位（stars_delta 降順）。取得していない日は null */
  rank: number | null;
  /**
   * この日に実際に GitHub から取得したか。
   * 3層構造により毎日は取得しないため、
   * 「スターが動かなかった日」と「見ていない日」を区別する必要がある
   */
  fetched: boolean;
}

export interface DailySnapshot {
  /** YYYY-MM-DD (JST基準) */
  date: string;
  /** 生成時刻 (ISO8601) */
  generated_at: string;
  /** 差分の比較元にしたスナップショットの日付。何日分の差か復元できるようにする */
  prev_snapshot_date: string | null;
  entries: SnapshotEntry[];
  /** その日に初めて検知したリポジトリの id */
  new_repo_ids: string[];
  /** 収集の実行結果メモ。監視（SPEC §17.2）で使う */
  stats: SnapshotStats;
}

export interface SnapshotStats {
  /** スナップショットに載った件数 */
  entry_count: number;
  /** 新規検知件数 */
  new_count: number;
  /** メタデータを取得した件数 */
  fetched_count: number;
  /** 取得に失敗してスキップした件数（SPEC §11 エラー時の原則） */
  skipped_count: number;
  /** リクエスト予算を使い切って次回に回した件数 */
  deferred_count: number;
  /** Trending 取得に成功したか（失敗許容・SPEC §10.3） */
  trending_ok: boolean;
  /** 収集にかかった秒数 */
  duration_sec: number;
}

// ---------------------------------------------------------------------------
// GitHub API のレスポンス（必要な範囲だけ型付けする）
// ---------------------------------------------------------------------------

export interface GitHubRepo {
  full_name: string;
  owner: { login: string };
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  subscribers_count?: number;
  open_issues_count: number;
  created_at: string;
  pushed_at: string;
  archived: boolean;
  license: { spdx_id: string | null } | null;
}
