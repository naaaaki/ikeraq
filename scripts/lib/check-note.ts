/**
 * 下書きの抜けを確認する（CLAUDE.md「記事を書くときの流れ」6）
 *
 * ★ 中身の良し悪しは判定しない。それは人が読んで決めること（D-002 N3）。
 *   ここが見るのは「埋め忘れ」だけ。テンプレのコメントが残ったまま公開されるのを防ぐ。
 */

import { findBrokenEmphasis } from './emphasis.js';

export interface NoteIssue {
  level: 'error' | 'warn';
  message: string;
}

/** 見出しの下に、コメント以外の本文があるか */
function hasBody(markdown: string, heading: string): boolean {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) return false;
  const rest = markdown.slice(start + heading.length + 3);
  const next = rest.indexOf('\n## ');
  const section = next === -1 ? rest : rest.slice(0, next);
  // HTML コメントを外してから、中身が残るか見る
  return section.replace(/<!--[\s\S]*?-->/g, '').trim().length > 0;
}

export function checkNote(raw: string): NoteIssue[] {
  const issues: NoteIssue[] = [];
  const front = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const body = raw.replace(/^---\n[\s\S]*?\n---/, '');

  // 必須（D-005：これだけ書けば公開できる）
  if (!hasBody(body, '見出しの一文')) {
    issues.push({ level: 'error', message: '「見出しの一文」が空です' });
  }
  if (!hasBody(body, 'どういうものか')) {
    issues.push({ level: 'error', message: '「どういうものか」が空です（ここだけは必須）' });
  }

  // 図：画像を置いたなら alt が要る。片方だけは事故のもと
  // ★ \s は改行も食う。空の image: が次行の image_alt: を拾ってしまうので行内に限定する
  const image = front.match(/^image:[ \t]*(\S+)[ \t]*$/m)?.[1];
  const alt = front.match(/^image_alt:[ \t]*(\S.*)$/m)?.[1]?.trim();
  if (image && !alt) {
    issues.push({ level: 'error', message: 'image があるのに image_alt が空です' });
  }
  if (!image && alt) {
    issues.push({ level: 'warn', message: 'image_alt があるのに image が指定されていません' });
  }
  if (image && !hasBody(body, '図')) {
    issues.push({ level: 'warn', message: '画像があるのにキャプションが書かれていません' });
  }


  // 使い方は「動かせたときだけ」（D-006）。書いたなら確認した環境を残す
  if (hasBody(body, '使い方') && !/確認しました|確認しています/.test(body)) {
    issues.push({
      level: 'warn',
      message: '「使い方」を書いていますが、確認した環境が書かれていません',
    });
  }

  // 太字の記法が日本語の句読点と噛み合っていないと、** がそのまま画面に出る。
  // 書いた本人は気づきにくく、公開されるまで分からない
  for (const broken of findBrokenEmphasis(body)) {
    issues.push({
      level: 'error',
      message: `${broken.line}行目の ** が対になっていません。そのまま画面に出ます：${broken.excerpt}`,
    });
  }

  if (!/^updated:\s*\d{4}-\d{2}-\d{2}/m.test(front)) {
    issues.push({ level: 'warn', message: 'updated の日付がありません' });
  }

  return issues;
}
