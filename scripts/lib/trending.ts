/**
 * GitHub Trending の取得（SPEC §10.3）
 *
 * Trending には公式 API が存在せず、HTML の構造が変われば即座に壊れる。
 * したがって「補完データ」に位置づけ、必須依存にしない。
 *
 *   - 取得は1日1回のみ
 *   - 失敗してもサイト更新を止めない（呼び出し側で握りつぶす）
 *   - 破損（0件・パース不能）は検知して通知する
 */

/** owner/name の配列を返す。失敗時は null（前日キャッシュへフォールバックする） */
export async function fetchTrending(): Promise<string[] | null> {
  try {
    const res = await fetch('https://github.com/trending', {
      headers: { 'User-Agent': 'wakuru-collector', Accept: 'text/html' },
    });
    if (!res.ok) {
      console.warn(`[trending] HTTP ${res.status}。Search API の結果のみで続行します`);
      return null;
    }
    const html = await res.text();
    const ids = parseTrendingHtml(html);
    if (ids.length === 0) {
      // ★ スクレイパ破損の典型。エラーは出ないが結果が空になる
      console.warn('[trending] 0件。HTML 構造が変わった可能性があります');
      return null;
    }
    return ids;
  } catch (e) {
    console.warn('[trending] 取得に失敗。Search API の結果のみで続行します', e);
    return null;
  }
}

/** HTML から owner/name を抽出する。構造変更に備え、パース箇所はここだけに閉じる */
export function parseTrendingHtml(html: string): string[] {
  const ids = new Set<string>();
  const re = /<h2 class="h3 lh-condensed">\s*<a href="\/([^/"]+)\/([^/"]+)"/g;
  for (const m of html.matchAll(re)) ids.add(`${m[1]}/${m[2]}`);

  if (ids.size === 0) {
    // 予備のパターン。GitHub は h2 のクラス名をたびたび変える
    const fallback = /<article class="Box-row"[\s\S]*?href="\/([^/"]+)\/([^/"?]+)"/g;
    for (const m of html.matchAll(fallback)) ids.add(`${m[1]}/${m[2]}`);
  }
  return [...ids];
}
