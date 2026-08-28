/**
 * データの読み書き（SPEC §9.4）
 *
 * - 1リポジトリ = 1ファイル（data/repos/{owner}/{name}.json）
 *   全件を1つの JSON にすると、1件の変更で毎日ファイル全体が書き換わり Git 差分が巨大になる
 * - スナップショットは日付ごと（data/snapshots/YYYY-MM-DD.json）
 *   追記型を1ファイルにすると際限なく肥大化する
 */

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DailySnapshot, Repository } from '../../src/types.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../..');
export const DATA_DIR = path.join(ROOT, 'data');
export const REPOS_DIR = path.join(DATA_DIR, 'repos');
export const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');

function repoPath(id: string): string {
  const [owner, name] = id.split('/');
  return path.join(REPOS_DIR, owner, `${name}.json`);
}

/** 末尾に改行を付ける。付けないと Git 差分に "\ No newline" が毎回出る */
async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

// ---------------------------------------------------------------------------
// repositories
// ---------------------------------------------------------------------------

export async function loadRepo(id: string): Promise<Repository | null> {
  const file = repoPath(id);
  if (!existsSync(file)) return null;
  return JSON.parse(await readFile(file, 'utf8')) as Repository;
}

export async function saveRepo(repo: Repository): Promise<void> {
  await writeJson(repoPath(repo.id), repo);
}

/** 追跡対象を全件読み込む。件数は上限1,000件想定（SPEC §10.4） */
export async function loadAllRepos(): Promise<Repository[]> {
  if (!existsSync(REPOS_DIR)) return [];
  const out: Repository[] = [];
  for (const owner of await readdir(REPOS_DIR, { withFileTypes: true })) {
    if (!owner.isDirectory()) continue;
    const dir = path.join(REPOS_DIR, owner.name);
    for (const file of await readdir(dir)) {
      if (!file.endsWith('.json')) continue;
      try {
        out.push(JSON.parse(await readFile(path.join(dir, file), 'utf8')) as Repository);
      } catch (e) {
        // 壊れたファイルで全体を止めない（SPEC §11）
        console.warn(`[storage] 読み込み失敗のためスキップ: ${owner.name}/${file}`, e);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// snapshots ★最重要資産（SPEC §6.2）
// ---------------------------------------------------------------------------

export async function saveSnapshot(snapshot: DailySnapshot): Promise<string> {
  const file = path.join(SNAPSHOTS_DIR, `${snapshot.date}.json`);
  await writeJson(file, snapshot);
  return file;
}

export async function loadSnapshot(date: string): Promise<DailySnapshot | null> {
  const file = path.join(SNAPSHOTS_DIR, `${date}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(await readFile(file, 'utf8')) as DailySnapshot;
}

/** 保存済みスナップショットの日付を昇順で返す */
export async function listSnapshotDates(): Promise<string[]> {
  if (!existsSync(SNAPSHOTS_DIR)) return [];
  return (await readdir(SNAPSHOTS_DIR))
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace('.json', ''))
    .sort();
}

/** 直近のスナップショット（today を除く）。前日比の算出に使う */
export async function loadLatestSnapshotBefore(date: string): Promise<DailySnapshot | null> {
  const dates = (await listSnapshotDates()).filter((d) => d < date);
  const latest = dates.at(-1);
  return latest ? loadSnapshot(latest) : null;
}
