/**
 * 日本語の紹介文を、ページに置ける形にほどく（D-002 / docs/article-template.md）
 *
 * 紹介文は `## 見出し` で節に分かれている。個別ページは節ごとに置き場所が違うため
 * （見出しの一文はバッジより上、本文はバッジより下）、ここで節に分けてから渡す。
 *
 * ★ 中身は書き換えない。並べ替えと Markdown → HTML の変換だけを行う。
 */

import { createMarkdownProcessor } from '@astrojs/markdown-remark';

/** 記事テンプレートの節名（docs/article-template.md と対） */
export const SECTIONS = ['見出しの一文', 'どういうものか', '図', 'どんなときに使うか', '使い方', '注意点'] as const;
export type SectionName = (typeof SECTIONS)[number];

export interface NoteSections {
  /** 節名 → Markdown 本文。空の節は入らない */
  sections: Map<string, string>;
  /** テンプレートに無い節。書き手が足したもの。本文の末尾にそのまま出す */
  extra: { heading: string; body: string }[];
}

/** テンプレートのコメントを外す。書きかけの指示文がそのまま公開されるのを防ぐ */
function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '');
}

/** `## 見出し` で分割する。前書き（見出しの前の文）は捨てない */
export function splitSections(body: string): NoteSections {
  const clean = stripComments(body);
  const sections = new Map<string, string>();
  const extra: { heading: string; body: string }[] = [];

  // 行頭の `## ` だけを区切りにする。本文中の `###` は節の中に残す
  const parts = clean.split(/^##[ \t]+(.+?)[ \t]*$/m);
  // parts[0] は最初の見出しより前。テンプレート上は空のはず
  for (let i = 1; i < parts.length; i += 2) {
    const heading = (parts[i] ?? '').trim();
    const text = (parts[i + 1] ?? '').trim();
    if (text.length === 0) continue;
    if ((SECTIONS as readonly string[]).includes(heading)) {
      sections.set(heading, text);
    } else {
      extra.push({ heading, body: text });
    }
  }
  return { sections, extra };
}

/**
 * 「図」の節は、図そのものとキャプションが1つの節に同居している。
 * キャプションは図の下に小さく置きたいので、ここで分ける
 */
export function splitFigure(section: string): { figure: string; caption: string | null } {
  const idx = section.indexOf('キャプション:');
  if (idx === -1) return { figure: section.trim(), caption: null };
  const caption = section.slice(idx + 'キャプション:'.length).trim();
  return { figure: section.slice(0, idx).trim(), caption: caption.length > 0 ? caption : null };
}

// ---------------------------------------------------------------------------
// Markdown → HTML
// ---------------------------------------------------------------------------

/**
 * ビルド1回につき1つだけ作る。
 * 記事ごとに作ると Shiki の初期化が記事の数だけ走ってビルドが目に見えて遅くなる
 */
let rendererPromise: ReturnType<typeof createMarkdownProcessor> | null = null;

function renderer() {
  rendererPromise ??= createMarkdownProcessor({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light', wrap: true },
  });
  return rendererPromise;
}

/**
 * ★ 生の HTML はそのまま通す。図は SVG をインラインで書く決まりなので（D-008）、
 *   ここで落とすと図が消える。
 *   紹介文を書けるのは Naoki だけで、外部からの投稿は受け付けないため、
 *   HTML の混入は想定していない
 */
export async function renderMarkdown(md: string): Promise<string> {
  const { code } = await (await renderer()).render(md);
  return code;
}

/**
 * 1行だけの Markdown を、段落タグを付けずに変換する。図のキャプション用。
 *
 * ★ キャプションも Markdown として扱う。
 *   書き手には「キャプションだけ記法が効かない」と分かる手がかりが無く、
 *   太字を書くと `**` がそのまま画面に出てしまっていた（実際に出ていた）。
 *   段落タグは figcaption の中では余白が付いて浮くので、外側の <p> だけ外す。
 */
export async function renderInline(md: string): Promise<string> {
  const html = (await renderMarkdown(md)).trim();
  const m = /^<p>([\s\S]*)<\/p>$/.exec(html);
  // 段落が2つ以上あるときは外さない（外すと文が繋がってしまう）
  return m && !m[1].includes('<p>') ? m[1] : html;
}

/**
 * 図を描く。★Markdown を通さない。
 *
 * 図は SVG を直接書く決まりになっている（D-008）。
 * ところが Markdown は「空行のあとに字下げされた行」をコードとみなすため、
 * 読みやすく整形された SVG を通すと、途中から図ではなくソースコードが表示される。
 * SVG は最初から HTML なので、変換せずそのまま出すのが正しい。
 *
 * 紹介文を書けるのは Naoki だけで、外部からの投稿は受け付けない。
 * 第三者が書いた文字列（GitHub の description など）はここを通らない
 */
export async function renderFigure(md: string): Promise<string> {
  const trimmed = md.trim();
  // HTML で書かれていれば、そのまま出す
  if (trimmed.startsWith('<')) return trimmed;
  // 画像を Markdown 記法で書いた場合だけ、変換を通す
  return renderMarkdown(trimmed);
}

/** 見出しの一文。1行しかないので、Markdown を通さず素のまま使う */
export function plainText(md: string): string {
  return stripComments(md)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim();
}
