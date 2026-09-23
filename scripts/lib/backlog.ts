/**
 * 下書きの滞留を数える（npm run note の冒頭に出す）
 *
 * ★ 2026-09-23 に、書き上がったまま未コミットの下書きが8本見つかった。
 *   確認待ちで止まったのか、忘れられたのかを区別する手段が無かった。
 *   status（notes.ts）と「git で追跡されているか」の2つで見分ける。
 *
 * status が無い記事の扱い：
 *   - git で追跡済み → 公開済み
 *   - 未追跡        → 状態未設定（書き上がったのか途中なのか分からない。付けてもらう）
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { Note, NoteStatus } from './notes.js';

const run = promisify(execFile);

export interface Backlog {
  counts: Record<NoteStatus, number>;
  /** git 未追跡の記事。repoId → status（無ければ null） */
  untracked: { repoId: string; status: NoteStatus | null }[];
}

export function summarizeBacklog(notes: Map<string, Note>, untrackedIds: Set<string>): Backlog {
  const counts: Record<NoteStatus, number> = { draft: 0, review: 0, skip: 0 };
  for (const note of notes.values()) {
    if (note.status) counts[note.status]++;
  }
  const untracked = [...notes.values()]
    .filter((n) => untrackedIds.has(n.repoId))
    .map((n) => ({ repoId: n.repoId, status: n.status }))
    .sort((a, b) => a.repoId.localeCompare(b.repoId));
  return { counts, untracked };
}

/** data/notes 配下で git 未追跡の記事の repoId。git が使えなければ空 */
export async function listUntrackedNoteIds(): Promise<Set<string>> {
  try {
    const { stdout } = await run('git', ['ls-files', '--others', '--exclude-standard', '-z', '--', 'data/notes'], {
      encoding: 'utf8',
    });
    return new Set(
      stdout
        .split('\0')
        .map((p) => p.match(/^data\/notes\/([^/]+)\/([^/]+)\.md$/))
        .filter((m): m is RegExpMatchArray => m !== null)
        .map((m) => `${m[1]}/${m[2]}`)
    );
  } catch {
    return new Set();
  }
}

const LABEL: Record<NoteStatus, string> = { draft: '下書き', review: '確認待ち', skip: '見送り' };

export function formatBacklog(b: Backlog): string[] {
  const lines = [
    `--- 滞留 ---  ${LABEL.draft} ${b.counts.draft}本 / ${LABEL.review} ${b.counts.review}本 / ${LABEL.skip} ${b.counts.skip}本`,
  ];
  if (b.untracked.length > 0) {
    lines.push(`  未コミットの記事 ${b.untracked.length}本:`);
    for (const u of b.untracked) {
      lines.push(`    ${u.repoId.padEnd(42)} ${u.status ? LABEL[u.status] : '状態未設定'}`);
    }
  }
  return lines;
}
