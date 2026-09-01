/**
 * 日本語の文中で太字（**）が壊れていないか
 *
 * ★ 実際に本番へ出てしまった不具合の再発防止。
 *   「判定の基準」で ** がそのまま表示され、記事1本では意図と違う範囲が太字になっていた。
 *   書いた本人には気づく手がかりが無いので、機械で止める。
 *
 *   npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { findBrokenEmphasis } from '../scripts/lib/emphasis.js';

test('閉じる ** の直前が句点だと対にならない（実際に本番で出た形）', () => {
  const found = findBrokenEmphasis('**人が書いています。**調査の過程で AI を使うことはあります');
  assert.equal(found.length, 2);
});

test('開く ** の直後が鉤括弧だと対にならない（実際に本番で出た形）', () => {
  const found = findBrokenEmphasis('特徴は**「すべてがプラグイン」という構造**です。');
  assert.ok(found.length > 0);
});

test('句点を ** の外に出せば対になる', () => {
  assert.deepEqual(findBrokenEmphasis('**人が書いています**。調査の過程で'), []);
});

test('読点を前に足せば鉤括弧でも開ける', () => {
  assert.deepEqual(findBrokenEmphasis('特徴は、**「すべてがプラグイン」という構造**です。'), []);
});

test('ふつうの日本語の太字は誤検知しない', () => {
  assert.deepEqual(findBrokenEmphasis('ここが**大事な部分**です。'), []);
  assert.deepEqual(findBrokenEmphasis('- **スコア** … 内訳と一緒に出します'), []);
});

test('コード中の ** は対象にしない', () => {
  assert.deepEqual(findBrokenEmphasis('`a ** b` を計算します。'), []);
});

test('公開しているファイルに壊れた太字が無い', () => {
  const files = [
    ...globSync('docs/criteria.md'),
    ...globSync('data/notes/*/*.md'),
  ];
  assert.ok(files.length > 0, '検査対象が1件も見つかりません');

  const broken = files.flatMap((f) =>
    findBrokenEmphasis(readFileSync(f, 'utf8')).map((b) => `${f}:${b.line} ${b.excerpt}`)
  );
  assert.deepEqual(broken, [], `太字が壊れています:\n${broken.join('\n')}`);
});
