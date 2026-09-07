/**
 * 「トレンド」ページの判定（D-011 / 改名は D-012）
 *
 * ★ この判定はページの中身とヘッダーの出し分けの両方を決める。壊れても画面を見るまで
 *   気づかない場所なので、機械で止める。
 *
 *   npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trendItems, TREND_TOP, type RepoView, type SiteData } from '../src/lib/content.js';
import type { Repository } from '../src/types.js';

/** テスト用の最小の1件。判定に効くのは stars / forks / note だけ */
function view(id: string, stars: number, forks: number, note = false): RepoView {
  const repo = {
    id,
    owner: id.split('/')[0]!,
    name: id.split('/')[1]!,
    stars,
    forks,
  } as unknown as Repository;
  return {
    repo,
    note: note ? ({ id, body: '## 見出しの一文\n\nてすと' } as unknown as RepoView['note']) : null,
    lead: note ? 'てすと' : null,
    delta: null,
    history: [],
    trendDays: 0,
  };
}

function site(repos: RepoView[]): SiteData {
  return {
    repos,
    byId: new Map(repos.map((v) => [v.repo.id, v])),
    latestDate: null,
    snapshotCount: 0,
    noteCount: repos.filter((v) => v.note !== null).length,
    days: [],
  };
}

/**
 * 判定を通すのに十分な母数を作る。
 *
 * ★ スターを降順・フォークを昇順にしてあるので、この中では
 *   「スターも上位・フォークも上位」が1件も成立しない。
 *   埋め草が結果に混ざらないようにするための作り。
 */
function filler(count: number): RepoView[] {
  return Array.from({ length: count }, (_, i) => view(`filler/r${i}`, count - i, i + 1));
}

test('母数が少ないうちは0件を返す（全件が「上位100位」になってしまうため）', () => {
  const items = trendItems(site(filler(TREND_TOP * 2 - 1)));
  assert.equal(items.length, 0);
});

test('スターは上位でもフォークが低いものは入らない（この条件の存在理由）', () => {
  const repos = [
    ...filler(TREND_TOP * 3),
    view('read-only/linklist', 900_000, 5), // スター1位・フォークは最下位相当
    view('used/framework', 800_000, 90_000), // どちらも上位
  ];
  const ids = trendItems(site(repos)).map((v) => v.repo.id);
  assert.ok(ids.includes('used/framework'), '両方が上位のものは入る');
  assert.ok(!ids.includes('read-only/linklist'), 'フォークが低いものは落ちる');
});

test('紹介文があるものが先、そのあとはスターの多い順（今日の伸び順にしない）', () => {
  const repos = [
    ...filler(TREND_TOP * 3),
    view('a/big', 900_000, 90_000),
    view('b/small-with-note', 700_000, 70_000, true),
    view('c/middle', 800_000, 80_000),
  ];
  const ids = trendItems(site(repos)).map((v) => v.repo.id);
  assert.deepEqual(ids, ['b/small-with-note', 'a/big', 'c/middle']);
});

test('元の配列を壊さない（ほかのページが同じ配列を使うため）', () => {
  const repos = [...filler(TREND_TOP * 3), view('a/one', 900_000, 90_000), view('b/two', 800_000, 80_000)];
  const before = repos.map((v) => v.repo.id);
  trendItems(site(repos));
  assert.deepEqual(
    repos.map((v) => v.repo.id),
    before
  );
});
