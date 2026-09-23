/**
 * 一覧ページのページ分け
 *
 * ★ 1ページ目の URL は変えない。/category/x/ のまま。2ページ目から /category/x/page/2/。
 *   すでに外からリンクされている URL を壊さないため。
 *
 * ★ 1,000件前後を1枚に出すと、日次ページが2MBを超えた（2026-09-24 計測）。
 *   1行がおよそ2KBあるので、50件で100KB前後に収まる。
 */
export const LIST_PAGE_SIZE = 50;

export interface PagerInfo {
  /** 1から数える */
  current: number;
  total: number;
  /** 1ページ目の URL（末尾スラッシュつき） */
  basePath: string;
  /** このページの先頭が、全体の何件目か（0から） */
  offset: number;
  /** 全体の件数 */
  allCount: number;
  /** このページに載る件数 */
  count: number;
}

export interface PageSlice<T> {
  /** Astro の rest パラメータに渡す値。1ページ目は undefined */
  param: string | undefined;
  items: T[];
  pager: PagerInfo;
}

export function pageHref(basePath: string, n: number): string {
  return n <= 1 ? basePath : `${basePath}page/${n}/`;
}

/** 0件でも1ページは作る（空のときの文言を出す場所が要る） */
export function paginate<T>(items: T[], basePath: string, size = LIST_PAGE_SIZE): PageSlice<T>[] {
  const total = Math.max(1, Math.ceil(items.length / size));
  return Array.from({ length: total }, (_, i) => {
    const slice = items.slice(i * size, (i + 1) * size);
    return {
      param: i === 0 ? undefined : `page/${i + 1}`,
      items: slice,
      pager: { current: i + 1, total, basePath, offset: i * size, allCount: items.length, count: slice.length },
    };
  });
}
