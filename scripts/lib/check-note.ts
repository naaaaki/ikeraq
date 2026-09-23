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

export function checkNote(rawInput: string): NoteIssue[] {
  // Windows で CRLF になった記事でも設定欄を読めるようにする（notes.ts と同じ）
  const raw = rawInput.replace(/\r\n/g, '\n');
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

  // 状態は3つだけ（notes.ts）。綴りを間違えると滞留の数から黙って漏れる
  const status = front.match(/^status:[ \t]*(\S+)/m)?.[1];
  if (status && !['draft', 'review', 'skip'].includes(status)) {
    issues.push({ level: 'warn', message: `status「${status}」は使えません（draft / review / skip のどれか）` });
  }

  for (const message of checkSvgLabels(raw)) {
    issues.push({ level: 'warn', message });
  }
  for (const hit of findAssertions(raw)) {
    issues.push({
      level: 'warn',
      message: `${hit.line}行目に言い切り「${hit.word}」があります。出典がそこまで言っているか確かめる：${hit.excerpt}`,
    });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 図：読み上げ文（aria-label）が図の文字を写しているか（CLAUDE.md 手順4-7）
// 2026-09-13 に公開済み20本すべてでずれていた。人の目だけに任せない
// ---------------------------------------------------------------------------

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

/** 空白・句読点・括弧の差は許す。比べるのは文字の並びだけ */
export function normalizeForLabel(s: string): string {
  return decodeEntities(s)
    .replace(/[\s　、。，．,.・:：;；「」『』（）()［］\[\]【】“”"'‘’!！?？→…—–\-／/]/g, '')
    .toLowerCase();
}

/** 見出しは冒頭付近、締めは末尾付近にあればよい（「見出しに〜とある図。」の前置きを許す） */
const EDGE_SLACK = 20;

export function checkSvgLabels(raw: string): string[] {
  const messages: string[] = [];
  const svgs = raw.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
  svgs.forEach((svg, i) => {
    const name = svgs.length > 1 ? `図${i + 1}` : '図';
    const labelRaw = svg.match(/<svg\b[^>]*\baria-label="([^"]*)"/)?.[1];
    if (labelRaw === undefined) {
      messages.push(`${name}に aria-label がありません`);
      return;
    }
    const label = normalizeForLabel(labelRaw);
    const texts = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
      .map((m) => normalizeForLabel(m[1].replace(/<[^>]+>/g, '')))
      .filter((t) => t.length > 0);
    if (texts.length === 0) return;

    // ★ 並び順は見ない。図は左右にも並ぶので、SVG の書き順と読み上げの順は一致しなくてよい
    //   （順番まで見ると、正しく写した図の約3割が引っかかった）
    const missing = texts.filter((t) => !label.includes(t));
    if (missing.length > 0) {
      messages.push(`${name}の文字が読み上げ文（aria-label）にありません：${missing.join(' / ')}`);
    }
    const first = texts[0];
    const last = texts[texts.length - 1];
    const firstAt = label.indexOf(first);
    if (firstAt > EDGE_SLACK) {
      messages.push(`${name}の見出し「${first}」が読み上げ文の冒頭にありません`);
    }
    const lastAt = label.lastIndexOf(last);
    if (lastAt !== -1 && label.length - (lastAt + last.length) > EDGE_SLACK) {
      messages.push(`${name}の締めの一行「${last}」が読み上げ文の末尾にありません`);
    }
  });
  return messages;
}

// ---------------------------------------------------------------------------
// 言い切り：事実確認で ×・▲ が繰り返し出た型（CLAUDE.md ★・D-017）
// 誤りと決めつけない。「出典がそこまで言っているか」を見直すきっかけにする
// ---------------------------------------------------------------------------

const ASSERTION_PATTERNS: { word: string; re: RegExp }[] = [
  { word: 'だけだ', re: /だけだ/ },
  { word: '前提', re: /前提(に|と|で|が)/ },
  { word: '必須', re: /必須(だ|で|に|の|と|ではない)/ },
  { word: '一切', re: /一切/ },
  { word: '唯一', re: /唯一/ },
  { word: '必ず', re: /必ず/ },
  { word: '未解決の issue', re: /未解決の\s*issue/i },
  { word: 'issue の件数', re: /issue\s*(は|が)?\s*\d[\d,]*\s*件/i },
];

export interface AssertionHit {
  line: number;
  word: string;
  excerpt: string;
}

export function findAssertions(raw: string): AssertionHit[] {
  const hits: AssertionHit[] = [];
  const lines = raw.split(/\r?\n/);
  let inFront = lines[0] === '---';
  let inComment = false;
  let inSvg = false;
  lines.forEach((text, i) => {
    if (inFront) {
      if (i > 0 && text === '---') inFront = false;
      return;
    }
    // コメント・SVG は本文ではない（SVG の文字は checkSvgLabels が見る）
    let line = text;
    if (inComment) {
      const end = line.indexOf('-->');
      if (end === -1) return;
      inComment = false;
      line = line.slice(end + 3);
    }
    line = line.replace(/<!--[\s\S]*?-->/g, '');
    const open = line.indexOf('<!--');
    if (open !== -1) {
      inComment = true;
      line = line.slice(0, open);
    }
    if (inSvg || /<svg\b/.test(line)) {
      inSvg = !/<\/svg>/.test(line);
      return;
    }
    if (line.trim() === '') return;
    for (const { word, re } of ASSERTION_PATTERNS) {
      const m = line.match(re);
      if (!m || m.index === undefined) continue;
      const from = Math.max(0, m.index - 15);
      hits.push({ line: i + 1, word, excerpt: line.slice(from, m.index + m[0].length + 15).trim() });
    }
  });
  return hits;
}
