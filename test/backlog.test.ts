/**
 * 下書きの滞留（status と git 未追跡）の数え方
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStatus, type Note } from '../scripts/lib/notes.js';
import { formatBacklog, summarizeBacklog } from '../scripts/lib/backlog.js';
import { checkNote } from '../scripts/lib/check-note.js';
import { buildDraft } from '../scripts/lib/draft.js';

const note = (repoId: string, status: Note['status']): Note => ({
  repoId,
  body: '本文',
  updated: '2026-09-24',
  status,
  category: null,
});

test('status：決まった3つだけを読み、それ以外と空は null', () => {
  assert.equal(parseStatus('updated: 2026-09-24\nstatus: review'), 'review');
  assert.equal(parseStatus('status: draft  '), 'draft');
  assert.equal(parseStatus('status: done'), null);
  assert.equal(parseStatus('status:\nimage: x'), null);
  assert.equal(parseStatus('updated: 2026-09-24'), null);
});

test('滞留：状態ごとの本数と、未コミットの記事の一覧', () => {
  const notes = new Map(
    [note('a/one', 'draft'), note('b/two', 'review'), note('c/three', 'skip'), note('d/four', null), note('e/five', null)].map(
      (n) => [n.repoId, n] as const
    )
  );
  const b = summarizeBacklog(notes, new Set(['b/two', 'e/five']));
  assert.deepEqual(b.counts, { draft: 1, review: 1, skip: 1 });
  assert.deepEqual(b.untracked, [
    { repoId: 'b/two', status: 'review' },
    { repoId: 'e/five', status: null },
  ]);
  const text = formatBacklog(b).join('\n');
  assert.match(text, /下書き 1本 \/ 確認待ち 1本 \/ 見送り 1本/);
  assert.match(text, /未コミットの記事 2本/);
  assert.match(text, /e\/five\s+状態未設定/);
});

test('滞留：未コミットが無ければ一覧の行は出さない', () => {
  const lines = formatBacklog(summarizeBacklog(new Map([['a/one', note('a/one', null)]]), new Set()));
  assert.equal(lines.length, 1);
});

test('新しい下書きは status: draft から始まり、抜けチェックが status を咎めない', () => {
  const raw = buildDraft(
    {
      id: 'o/n',
      description_en: null,
      language: null,
      license_spdx: null,
      stars: 1,
      topics: [],
    } as unknown as Parameters<typeof buildDraft>[0],
    '2026-09-24'
  );
  assert.match(raw, /^status: draft$/m);
  assert.ok(!checkNote(raw).some((i) => i.message.includes('status')));
});

test('抜けチェック：綴りを間違えた status を知らせる', () => {
  const raw = '---\nupdated: 2026-09-24\nstatus: reveiw\n---\n\n## 見出しの一文\n\nx\n\n## どういうものか\n\ny\n';
  assert.ok(checkNote(raw).some((i) => i.message.includes('status「reveiw」')));
});
