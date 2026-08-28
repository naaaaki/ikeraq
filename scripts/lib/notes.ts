/**
 * 日本語の紹介文の読み込み（D-002）
 *
 * ★ このサイトの主役。Naoki が Claude Code を使って調査・執筆したものを置く。
 *
 * 収集データ（data/repos/）とは別のディレクトリに置く。理由は2つ。
 *   1. 日次パイプラインが書き換えるファイルに人の文章を混ぜると、事故で消えうる
 *   2. 人が編集するファイルは、機械が生成した JSON より Markdown のほうが書きやすい
 *
 * data/notes/{owner}/{name}.md
 *   ---
 *   updated: 2026-08-29
 *   ---
 *   本文（Markdown）
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './storage.js';

export const NOTES_DIR = path.join(DATA_DIR, 'notes');

export interface Note {
  repoId: string;
  body: string;
  updated: string | null;
}

function parse(repoId: string, raw: string): Note {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const front = match ? match[1] : '';
  const body = (match ? raw.slice(match[0].length) : raw).trim();
  const updated = front.match(/^updated:\s*(\S+)/m)?.[1] ?? null;
  return { repoId, body, updated };
}

/** 紹介文をすべて読み込む。repo_id → Note */
export async function loadNotes(): Promise<Map<string, Note>> {
  const notes = new Map<string, Note>();
  if (!existsSync(NOTES_DIR)) return notes;

  for (const owner of await readdir(NOTES_DIR, { withFileTypes: true })) {
    if (!owner.isDirectory()) continue;
    const dir = path.join(NOTES_DIR, owner.name);
    for (const file of await readdir(dir)) {
      if (!file.endsWith('.md')) continue;
      const repoId = `${owner.name}/${file.replace(/\.md$/, '')}`;
      try {
        const note = parse(repoId, await readFile(path.join(dir, file), 'utf8'));
        // 空ファイルは「まだ書いていない」とみなす
        if (note.body.length > 0) notes.set(repoId, note);
      } catch (e) {
        // 1件の失敗で全体を止めない
        console.warn(`[notes] 読み込み失敗のためスキップ: ${repoId}`, e);
      }
    }
  }
  return notes;
}

export function notePath(repoId: string): string {
  const [owner, name] = repoId.split('/');
  return path.join(NOTES_DIR, owner, `${name}.md`);
}
