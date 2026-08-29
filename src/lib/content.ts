/**
 * サイト本体が使うデータの読み込み（ビルド時のみ）
 *
 * 収集スクリプトが書いた data/ を、そのままページに渡せる形にまとめる。
 * ★ ここで数値を作らない。スナップショットに無い日を埋めたりしないこと（SPEC §6.2）。
 *
 * データが1件も無い状態でもビルドが通るようにしてある。
 * 収集が始まる前でもサイトの形を確認できるようにするため。
 */

import type { DailySnapshot, Repository } from '../types.js';
import { plainText, splitSections } from './note.js';
import { listSnapshotDates, loadAllRepos, loadSnapshot } from '../../scripts/lib/storage.js';
import { loadNotes, type Note } from '../../scripts/lib/notes.js';

export interface RepoView {
  repo: Repository;
  /** 日本語の紹介文。書いてあるものだけ入る（全件には付かない・D-002） */
  note: Note | null;
  /**
   * 紹介文の「見出しの一文」。★一覧に出す日本語はこれ。
   * 記事を書くときに、その1行のために書いたもの。英語 description の代わりに使う
   */
  lead: string | null;
  /** 最新スナップショットでの1日あたりの増加。取得していなければ null */
  delta: number | null;
  /** スター数の推移。{ date, stars }。実際に取得した日だけ入る */
  history: { date: string; stars: number }[];
  /**
   * トレンド上位に入った日数。殿堂入りの判定に使う。
   * ★ 記録した日数がそのまま効くので、追跡を止めた期間は永久に取り戻せない（SPEC §10.4）
   */
  trendDays: number;
}

export interface SiteData {
  repos: RepoView[];
  byId: Map<string, RepoView>;
  /** 最新スナップショットの日付。1件も無ければ null */
  latestDate: string | null;
  /** 記録している日数（＝スナップショットの数） */
  snapshotCount: number;
  /** 紹介文を書いた本数 */
  noteCount: number;
  /** 日次アーカイブ用。日付 → その日に載った repo_id を順位順に並べたもの */
  days: { date: string; repoIds: string[] }[];
}

/**
 * 「その日のトレンド上位」とみなす順位。
 * 殿堂入りは「たまたま1日伸びた」ではなく「何度も上位に入った」を示すページなので、
 * ここを緩めると意味が消える
 */
export const TREND_RANK = 50;
/** 殿堂入りの条件。上位に入った日数がこれ以上 */
export const HALL_OF_FAME_DAYS = 3;

let cache: Promise<SiteData> | null = null;

/** ビルド中に何度も呼ばれるので、1回だけ読んで使い回す */
export function getSiteData(): Promise<SiteData> {
  cache ??= build();
  return cache;
}

async function build(): Promise<SiteData> {
  const [repos, notes, dates] = await Promise.all([loadAllRepos(), loadNotes(), listSnapshotDates()]);

  // 推移グラフ用に、全スナップショットを1回だけ読んで repo_id ごとにまとめ直す
  const snapshots: DailySnapshot[] = [];
  for (const date of dates) {
    const snap = await loadSnapshot(date);
    if (snap) snapshots.push(snap);
  }

  const history = new Map<string, { date: string; stars: number }[]>();
  const trendDays = new Map<string, number>();
  for (const snap of snapshots) {
    for (const entry of snap.entries) {
      // ★ 見ていない日は履歴に入れない。線を引くために埋めるのは事実の捏造になる
      if (!entry.fetched) continue;
      const list = history.get(entry.repo_id) ?? [];
      list.push({ date: snap.date, stars: entry.stars });
      history.set(entry.repo_id, list);
      if (entry.rank !== null && entry.rank <= TREND_RANK) {
        trendDays.set(entry.repo_id, (trendDays.get(entry.repo_id) ?? 0) + 1);
      }
    }
  }

  const days = snapshots.map((snap) => ({
    date: snap.date,
    repoIds: [...snap.entries]
      .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER))
      .map((e) => e.repo_id),
  }));

  const latest = snapshots.at(-1) ?? null;
  const deltas = new Map<string, number | null>();
  for (const entry of latest?.entries ?? []) {
    deltas.set(entry.repo_id, entry.stars_delta);
  }

  const views: RepoView[] = repos.map((repo) => {
    const note = notes.get(repo.id) ?? null;
    const lead = note ? (splitSections(note.body).sections.get('見出しの一文') ?? null) : null;
    return {
      repo,
      note,
      lead: lead ? plainText(lead) : null,
      delta: deltas.get(repo.id) ?? null,
      history: history.get(repo.id) ?? [],
      trendDays: trendDays.get(repo.id) ?? 0,
    };
  });

  return {
    repos: views,
    byId: new Map(views.map((v) => [v.repo.id, v])),
    latestDate: latest?.date ?? null,
    snapshotCount: dates.length,
    noteCount: views.filter((v) => v.note !== null).length,
    days,
  };
}

// ---------------------------------------------------------------------------
// 並べ替え
// ---------------------------------------------------------------------------

/**
 * 「今日伸びている順」。
 * 増加数が取れていないものは後ろに送り、その中ではスター数で並べる。
 * ★ 収集が始まる前は増加数が1件も無い。その場合でも一覧が空にならないようにしてある
 */
export function byMomentum(a: RepoView, b: RepoView): number {
  const da = a.delta ?? -1;
  const db = b.delta ?? -1;
  if (da !== db) return db - da;
  return b.repo.stars - a.repo.stars;
}

/**
 * 紹介文があるものを先頭に固める（一覧ページ用）。
 *
 * ★ 一覧は「気になるものを選ぶ場所」。日本語の解説を書いたものが
 *   150件の中に埋もれると、書いた意味がなくなる。
 *   同じ条件どうしの並びは byMomentum に従う。
 *
 * ★ 日次アーカイブには使わない。その日に記録した順位をそのまま残すため。
 */
export function byNoteFirst(a: RepoView, b: RepoView): number {
  const an = a.note ? 0 : 1;
  const bn = b.note ? 0 : 1;
  if (an !== bn) return an - bn;
  return byMomentum(a, b);
}

/** 集計。サイドバーのカテゴリ・言語の件数に使う */
export function countBy<T>(items: T[], key: (item: T) => string | null): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (k === null) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}
