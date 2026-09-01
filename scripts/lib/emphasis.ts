/**
 * 日本語の文中で太字（**）が壊るのを見つける
 *
 * ★ CommonMark は「** の隣が何か」で開閉を決める。日本語は語の間に空白を入れず、
 *   句読点や鉤括弧が語に密着するため、英語では起きない不成立が普通に起きる。
 *
 *   例1（閉じられない）：**人が書いています。**調査の…
 *       閉じる ** の直前が「。」で、直後が普通の文字だと、閉じと判定されない。
 *   例2（開けない）：特徴は**「すべてがプラグイン」という構造**です。
 *       開く ** の直後が「「」で、直前が普通の文字だと、開きと判定されない。
 *
 *   例2 のほうが厄介で、** がそのまま出るだけでなく、
 *   後ろの ** と誤って対になり「意図と違う範囲が太字になる」。実際に起きた。
 *
 * ★ ここは「壊れているかどうか」だけを見る。文章の良し悪しは判定しない。
 */

/** CommonMark が句読点として扱う範囲（記号を含む） */
const PUNCT = /[\p{P}\p{S}]/u;
const SPACE = /\s/;

/** 開き側になれるか（left-flanking） */
function canOpen(before: string, after: string): boolean {
  if (after === '' || SPACE.test(after)) return false;
  if (!PUNCT.test(after)) return true;
  return before === '' || SPACE.test(before) || PUNCT.test(before);
}

/** 閉じ側になれるか（right-flanking） */
function canClose(before: string, after: string): boolean {
  if (before === '' || SPACE.test(before)) return false;
  if (!PUNCT.test(before)) return true;
  return after === '' || SPACE.test(after) || PUNCT.test(after);
}

export interface BrokenEmphasis {
  line: number;
  /** 画面にそのまま出てしまう ** の周辺 */
  excerpt: string;
}

/**
 * 対にならない ** を探す。
 *
 * CommonMark の突き合わせを簡略化して追う。開けるものは積み、閉じられるものは
 * 直近の開きと対にする。最後まで対にならずに残ったものが、画面に出る ** になる。
 */
export function findBrokenEmphasis(markdown: string): BrokenEmphasis[] {
  const found: BrokenEmphasis[] = [];

  markdown.split('\n').forEach((line, i) => {
    // コードは対象外。`**` を字として書くことがある
    const scan = line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length));
    const stack: number[] = [];
    const literal: number[] = [];

    for (let at = scan.indexOf('**'); at !== -1; at = scan.indexOf('**', at + 2)) {
      const before = at > 0 ? scan[at - 1]! : '';
      const after = at + 2 < scan.length ? scan[at + 2]! : '';
      if (canClose(before, after) && stack.length > 0) stack.pop();
      else if (canOpen(before, after)) stack.push(at);
      else literal.push(at);
    }

    for (const at of [...literal, ...stack].sort((a, b) => a - b)) {
      found.push({
        line: i + 1,
        excerpt: line.slice(Math.max(0, at - 12), at + 26).trim(),
      });
    }
  });

  return found;
}
