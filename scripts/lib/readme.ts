/**
 * README の抜粋処理（SPEC §8.2）
 *
 * README 全文は載せない。抜粋は最大500字。
 * ライセンス未設定の README は全権利留保であり、全文転載は著作権侵害の恐れがある。
 */

/** 抜粋の上限文字数。仕様で決められた値なので勝手に増やさないこと */
export const README_EXCERPT_MAX = 500;

/**
 * Markdown からバッジ・画像・コードブロック等を落として、説明文だけを抜き出す。
 * 完璧なパースは不要。読み手が概要を掴めればよい。
 */
export function buildReadmeExcerpt(markdown: string): string {
  const text = markdown
    .replace(/^---\n[\s\S]*?\n---\n/, '') // front matter
    .replace(/```[\s\S]*?```/g, ' ') // コードブロック
    .replace(/<!--[\s\S]*?-->/g, ' ') // HTML コメント
    .replace(/<[^>]+>/g, ' ') // HTML タグ（バッジの img 等）
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 画像
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクはテキストだけ残す
    .replace(/^[#>*\-=|\s]+$/gm, ' ') // 見出し記号・区切り線だけの行
    .replace(/^#{1,6}\s*/gm, '') // 見出しマーカー
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= README_EXCERPT_MAX) return text;
  return `${text.slice(0, README_EXCERPT_MAX - 1).trimEnd()}…`;
}
