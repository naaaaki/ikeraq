/**
 * サイト本体が使うデータの読み込み（ビルド時のみ）
 *
 * 収集スクリプトが書いた data/ を、そのままページに渡せる形にまとめる。
 * ★ ここで数値を作らない。スナップショットに無い日を埋めたりしないこと（SPEC §6.2）。
 *
 * データが1件も無い状態でもビルドが通るようにしてある。
 * 収集が始まる前でもサイトの形を確認できるようにするため。
 */

import type { DailySnapshot, LicenseCategory, Repository } from '../types.js';
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
   * トレンド上位に入った日数。
   *
   * ★ いまはどのページにも出していない。集計だけ続けている。
   *   「トレンド」ページの判定に使っていたが、D-011 で累積（スター×フォーク）に変えた。
   * ★ それでも数え続けるのは、記録した日数がそのまま効くため。
   *   追跡を止めた期間は永久に取り戻せない（SPEC §10.4）。将来の週次まとめで使う。
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
 * 「その日の上位」とみなす順位。trendDays（何日上位に入ったか）の集計に使う。
 *
 * ★「トレンド」ページの判定には使っていない（D-011）。いまはどのページにも
 *   出していないが、毎日の記録は後から作り直せないので、集計だけ続けている。
 */
export const DAILY_TOP_RANK = 50;

/**
 * 「トレンド」ページに載せる条件。スターとフォークの、それぞれの順位がこれ以内。
 *
 * ★ 足し算にしない。スターは数十万、フォークは数万で桁がひとつ違うため、
 *   合計で並べるとフォークがほとんど効かず、スターだけの順位とほぼ同じになる
 *   （実測：上位30件のうち27件が一致）。「両方の上位に入っていること」を条件に
 *   すると、スターは高いがフォークが極端に少ないもの（読まれただけのリンク集など）
 *   が落ちて、条件として意味を持つ。
 */
export const TREND_TOP = 100;

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
      if (entry.rank !== null && entry.rank <= DAILY_TOP_RANK) {
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

/**
 * 「トレンド」ページに載せるもの。スターとフォークの両方で上位に入っているもの。
 *
 * ★「今日のトレンド」（トップ）が1日の伸びを見るのに対して、こちらは積み上がった
 *   大きさを見る。同じ「トレンド」でも、見ている軸が違う。
 *
 * ★ 判定を2か所に書かない。ヘッダーの出し分けと一覧が同じ規則を使う。
 *   条件を満たすものが0件のあいだ、ヘッダーに「トレンド」を出さない
 *   （押しても空のページに着くだけで、初めて来た人の印象を落とすため）。
 *
 * ★ 毎日の順位（trendDays）は使わない。あちらは「いま伸びているか」であって、
 *   積み上げてきた大きさではない。追跡を始めた時期が早いものほど有利になる
 *   （順位をつける母数が日ごとに違うため）。
 */
export function trendItems(site: SiteData): RepoView[] {
  /**
   * ★ 母数が上限そのものに近いと、追跡している全部が「上位100位」になり、
   *   スター200程度のものまで定番として並ぶ。データを入れ直した直後に必ず起きる。
   *   0件を返せばヘッダーからも消えるので、既存の出し分けにそのまま乗る。
   */
  if (site.repos.length < TREND_TOP * 2) return [];

  const topBy = (key: 'stars' | 'forks') =>
    new Set(
      [...site.repos]
        .filter((v) => Number.isFinite(v.repo[key]))
        .sort((a, b) => b.repo[key] - a.repo[key])
        .slice(0, TREND_TOP)
        .map((v) => v.repo.id)
    );

  const byStars = topBy('stars');
  const byForks = topBy('forks');

  /**
   * ★ 並びに byNoteFirst を使わない。あれは2番目の鍵が「今日の伸び」なので、
   *   「伸びではなく積み上がった大きさ」を見るこのページと正面から食い違う。
   *   実際、スター47万の public-apis が7位、angular が最下位付近に来ていた。
   *   紹介文を先に固めるところだけ同じにして、そのあとはスターの多い順にする。
   */
  return site.repos
    .filter((v) => byStars.has(v.repo.id) && byForks.has(v.repo.id))
    .sort((a, b) => {
      const an = a.note ? 0 : 1;
      const bn = b.note ? 0 : 1;
      if (an !== bn) return an - bn;
      return b.repo.stars - a.repo.stars;
    });
}

/**
 * カテゴリごとの件数。
 *
 * ★「そのほか」は件数が最大でも必ず最後に置く。
 *   件数順にそのまま並べると、分類できなかった残り物が一番目立つ位置に来て、
 *   分け方が雑なサイトに見える。数え方は1か所に集約する。
 */
export function categoryCounts(site: SiteData): { key: string; count: number }[] {
  const counts = countBy(site.repos, (v) => v.repo.category ?? 'other');
  return [...counts.filter((c) => c.key !== 'other'), ...counts.filter((c) => c.key === 'other')];
}

// ---------------------------------------------------------------------------
// ライセンスで選ぶ
//
// ★ このサイトが持っていて GitHub が出さない判断が「仕事で使えるか」。
//   全件に付いているのに、個別ページを開かないと見られなかった。
//   ここで絞り込めるようにする。新しく計算するものは無い。
//
// ★ 断定しない（CLAUDE.md ルール4）。SPDX ID からの機械的な分類なので、
//   「使ってよい」ではなく「その傾向がある」までしか言わない。
//   最終判断は原文を読むこと、と各ページに必ず添える。
// ---------------------------------------------------------------------------

export type LicenseGroupKey = 'commercial' | 'copyleft' | 'unknown';

export interface LicenseGroup {
  key: LicenseGroupKey;
  /** 見出し。ページの主題そのもの */
  heading: string;
  /** ナビ・チップ用の短い名前 */
  short: string;
  /** 何を集めたページなのかの説明。断定しない言い方に揃える */
  lede: string;
  /** 検索結果に出る一文 */
  description: string;
  /** この group に含める license_category */
  members: LicenseCategory[];
  /**
   * 色の意味。★個別ページのライセンスバッジ（.lic / .warn / .danger）と同じ意味に揃える。
   * 同じ判断に別の色を使うと、色が意味を持たなくなる。
   */
  tone: 'ok' | 'warn' | 'danger';
}

export const LICENSE_GROUPS: LicenseGroup[] = [
  {
    key: 'commercial',
    heading: '商用に使いやすいもの',
    short: '商用に使いやすい',
    lede: 'MIT・Apache-2.0・BSD など、商用利用や組み込みの障害になりにくいライセンスのものを集めています。ライセンスの種類から機械的に分けているだけなので、使う前に原文の条項（著作権表示の掲載義務など）は必ず確認してください。',
    description:
      'MIT・Apache-2.0・BSD など、商用利用の障害になりにくいライセンスのリポジトリを集めています。仕事で使えるかどうかで探すためのページです。',
    members: ['permissive'],
    tone: 'ok',
  },
  {
    key: 'copyleft',
    heading: '自社サービスへの組込みに注意',
    short: '組込みに注意',
    lede: 'GPL・AGPL・LGPL・MPL など、コピーレフト系のライセンスのものを集めています。組み込んだ側のソース公開が必要になる場合があります。使えないという意味ではなく、条件を確認してから判断すべきもの、という意味です。',
    description:
      'GPL・AGPL・LGPL など、自社サービスに組み込むと公開義務が生じる場合があるライセンスのリポジトリを集めています。',
    members: ['strong-copyleft', 'weak-copyleft'],
    tone: 'warn',
  },
  {
    key: 'unknown',
    heading: '利用条件が確認できないもの',
    short: '条件が不明',
    lede: 'ライセンスが置かれていない、または GitHub がライセンスを特定できなかったものを集めています。ライセンスが無い場合、原則としてすべての権利が作者に留保されます。実際には条項が書かれている場合もあるので、使う前にリポジトリ本体を確認してください。',
    description:
      'ライセンスが設定されていない、または特定できなかったリポジトリを集めています。原則として全権利が作者に留保されるため、利用前の確認が要ります。',
    members: ['none', 'unknown'],
    tone: 'danger',
  },
];

export function licenseGroup(key: string): LicenseGroup | null {
  return LICENSE_GROUPS.find((g) => g.key === key) ?? null;
}

export function licenseGroupItems(site: SiteData, group: LicenseGroup): RepoView[] {
  return site.repos.filter((v) => group.members.includes(v.repo.license_category)).sort(byNoteFirst);
}

/**
 * ライセンス区分 × カテゴリの掛け合わせページを作る対象。
 *
 * ★ 件数が少ない組み合わせはページにしない。空に近い一覧を量産すると、
 *   サイト全体が中身の薄いページの集まりとして扱われる（SPEC §2.5）。
 * ★「そのほか」は作らない。読む人に何も伝えない語で1ページ増やす意味がない
 *   （個別ページのパンくずと同じ判断）。
 */
export const LICENSE_CROSS_MIN = 10;

export function licenseCrossCategories(items: RepoView[]): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const v of items) {
    const k = v.repo.category ?? 'other';
    if (k === 'other') continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .filter((c) => c.count >= LICENSE_CROSS_MIN)
    .sort((a, b) => b.count - a.count);
}
