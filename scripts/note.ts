/**
 * 日本語の紹介文の下書きを作る（D-002）
 *
 *   npm run note                     まだ紹介文が無い注目リポジトリを一覧する
 *   npm run note -- owner/name       そのリポジトリの下書きファイルを作る
 *
 * 作られた data/notes/{owner}/{name}.md を Claude Code と一緒に埋めていく。
 *
 * ★ 全件に付けようとしないこと。Google のスパムポリシーは
 *   「自動生成・人力・その両方の組み合わせのいずれであるかを問わない」と明記している。
 *   大量・機械的に見えた時点で該当する（docs/DECISIONS.md N1）。
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadNotes, notePath } from './lib/notes.js';
import { buildDraft } from './lib/draft.js';
import { listSnapshotDates, loadAllRepos, loadSnapshot } from './lib/storage.js';
import { todayJST } from './lib/date.js';
import type { Repository } from '../src/types.js';

/** 一覧に出す候補の件数。多く出しても書ける量には限りがある */
const CANDIDATE_LIMIT = 15;

async function main() {
  const target = process.argv.slice(2).find((a) => a.includes('/'));
  const repos = await loadAllRepos();
  const notes = await loadNotes();

  if (repos.length === 0) {
    console.log('追跡対象がありません。先に `npm run seed` と `npm run collect` を実行してください');
    return;
  }

  if (target) {
    await createDraft(repos, target);
    return;
  }

  // 候補を出す。直近の増加が大きく、まだ紹介文が無いもの
  const deltas = await latestDeltas();
  const candidates = repos
    .filter((r) => !notes.has(r.id))
    .sort((a, b) => (deltas.get(b.id) ?? 0) - (deltas.get(a.id) ?? 0))
    .slice(0, CANDIDATE_LIMIT);

  console.log(`紹介文つき: ${notes.size} 件 / 追跡: ${repos.length} 件\n`);
  console.log('--- まだ紹介文が無い注目リポジトリ ---');
  for (const r of candidates) {
    const delta = deltas.get(r.id);
    console.log(
      `  ${r.id.padEnd(42)} ${String(r.stars).padStart(7)} ★` +
        `${delta ? ` +${delta}` : ''}  ${r.language ?? '-'}`
    );
  }
  console.log('\n書くものを決めたら:  npm run note -- owner/name');
}

async function createDraft(repos: Repository[], id: string) {
  const repo = repos.find((r) => r.id === id);
  if (!repo) {
    console.error(`追跡対象に見つかりません: ${id}`);
    process.exit(1);
  }

  const file = notePath(id);
  if (existsSync(file)) {
    console.log(`すでにあります: ${file}`);
    return;
  }

  const draft = buildDraft(repo, todayJST());

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, draft, 'utf8');
  console.log(`下書きを作りました: ${file}`);
  console.log('書き方は docs/article-template.md にあります。');
  console.log('Claude Code と一緒に埋めてください。');
}

async function latestDeltas(): Promise<Map<string, number>> {
  const dates = await listSnapshotDates();
  const latest = dates.at(-1);
  if (!latest) return new Map();
  const snapshot = await loadSnapshot(latest);
  if (!snapshot) return new Map();
  return new Map(
    snapshot.entries
      .filter((e) => e.fetched && e.stars_delta !== null)
      .map((e) => [e.repo_id, e.stars_delta as number])
  );
}

main().catch((e) => {
  console.error('[note] 失敗', e);
  process.exit(1);
});
