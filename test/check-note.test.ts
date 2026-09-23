/**
 * 抜けチェックの「図の読み上げ文」と「言い切り」の検出
 *
 * どちらも誤りと決めつけるものではなく、見直すきっかけを出すだけ（warn）。
 * 誤検知が増えると誰も見なくなるので、正しく書けたものが素通りすることも確かめる。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkNote, checkSvgLabels, findAssertions } from '../scripts/lib/check-note.js';

const svg = (label: string, texts: string[]) =>
  `<svg viewBox="0 0 800 450" role="img" aria-label="${label}">\n` +
  texts.map((t) => `  <text x="0" y="0">${t}</text>`).join('\n') +
  '\n</svg>';

test('図：文字をすべて写した読み上げ文は通る（句読点・括弧・tspan の差は許す）', () => {
  const raw = svg('見出しに「設定を手で書かない」とある図。左に「一覧（既成の設定）」。下に「消しても動く」とある。', [
    '設定を<tspan fill="#1E5A48">手で</tspan>書かない',
    '一覧',
    '（既成の設定）',
    '消しても動く',
  ]);
  assert.deepEqual(checkSvgLabels(raw), []);
});

test('図：書き順と読み上げの順が違っても、漏れがなければ通る', () => {
  const raw = svg('見出し「上の段」。左に「A」、右に「B」。上から「注記」。締め「最後の一行」', [
    '上の段',
    '注記',
    'A',
    'B',
    '最後の一行',
  ]);
  assert.deepEqual(checkSvgLabels(raw), []);
});

test('図：読み上げ文に無い文字を拾う', () => {
  const raw = svg('左に「A」、右に「B」がある図', ['見出しの文', 'A', 'B']);
  const messages = checkSvgLabels(raw);
  assert.ok(messages.some((m) => m.includes('ありません：見出しの文')));
});

test('図：見出しが冒頭に、締めが末尾にないと知らせる', () => {
  const pad = 'あ'.repeat(30);
  const raw = svg(`${pad}「A」。見出しの文。締めの一行。${pad}`, ['見出しの文', 'A', '締めの一行']);
  const messages = checkSvgLabels(raw);
  assert.ok(messages.some((m) => m.includes('見出し「見出しの文」が読み上げ文の冒頭にありません')));
  assert.ok(messages.some((m) => m.includes('締めの一行「締めの一行」が読み上げ文の末尾にありません')));
});

test('図：aria-label が無ければ知らせる', () => {
  assert.deepEqual(checkSvgLabels('<svg viewBox="0 0 1 1"><text>A</text></svg>'), ['図に aria-label がありません']);
});

test('言い切り：本文の行番号つきで拾う', () => {
  const raw = ['---', 'updated: 2026-09-24', '---', '', '## どういうものか', '', '再起動なしで切り替わるのは Claude Code だけだ。'].join('\n');
  const hits = findAssertions(raw);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 7);
  assert.equal(hits[0].word, 'だけだ');
});

test('言い切り：issue の件数を書いたら拾う（プルリクエストを含むため）', () => {
  const hits = findAssertions('未解決の issue は 120件ある。');
  assert.ok(hits.some((h) => h.word === '未解決の issue'));
  assert.ok(hits.some((h) => h.word === 'issue の件数'));
});

test('言い切り：コメント・SVG・frontmatter の中は見ない', () => {
  const raw = [
    '---',
    'note: 前提に置く',
    '---',
    '<!-- 必須は「どういうものか」だけだ',
    '  複数行のコメントでも必ず外す -->',
    '<svg aria-label="必須">',
    '  <text>一切しない</text>',
    '</svg>',
    '本文はふつうの文。',
  ].join('\n');
  assert.deepEqual(findAssertions(raw), []);
});

test('checkNote：言い切りと図のずれは warn として出る（要修正にはしない）', () => {
  const raw = [
    '---',
    'updated: 2026-09-24',
    '---',
    '## 見出しの一文',
    '一文',
    '## どういうものか',
    'サインインが前提になる。',
    svg('A', ['B']),
  ].join('\n');
  const issues = checkNote(raw);
  assert.ok(issues.length >= 2);
  assert.ok(issues.every((i) => i.level === 'warn'));
});
