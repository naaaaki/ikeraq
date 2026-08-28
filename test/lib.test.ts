/**
 * ロジックの単体テスト。
 * ネットワークを叩かない純関数だけを対象にする。
 *   npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { addDays, daysBetween, toDateStringJST } from '../scripts/lib/date.js';
import { categorizeLicense } from '../scripts/lib/license.js';
import { buildReadmeExcerpt, README_EXCERPT_MAX } from '../scripts/lib/readme.js';
import { parseTrendingHtml } from '../scripts/lib/trending.js';
import { createLimiter, mapLimited } from '../scripts/lib/github.js';
import { shouldFetchToday } from '../scripts/lib/tier.js';
import { newRepository } from '../scripts/lib/repository.js';

test('JST の日付境界: UTC 15:00 を過ぎたら翌日になる', () => {
  assert.equal(toDateStringJST(new Date('2026-08-28T14:59:00Z')), '2026-08-28');
  assert.equal(toDateStringJST(new Date('2026-08-28T15:00:00Z')), '2026-08-29');
});

test('addDays / daysBetween', () => {
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(daysBetween('2026-08-28', '2026-08-21'), 7);
});

test('ライセンス区分（SPEC §6.1）', () => {
  assert.equal(categorizeLicense('MIT'), 'permissive');
  assert.equal(categorizeLicense('apache-2.0'), 'permissive');
  assert.equal(categorizeLicense('AGPL-3.0'), 'strong-copyleft');
  assert.equal(categorizeLicense('LGPL-3.0'), 'weak-copyleft');
  assert.equal(categorizeLicense(null), 'none');
  assert.equal(categorizeLicense('NOASSERTION'), 'unknown');
  // 未知の SPDX を permissive に倒すと誤った商用可否表示になる
  assert.equal(categorizeLicense('SOME-NEW-LICENSE-1.0'), 'unknown');
});

test('README 抜粋は500字を超えない（SPEC §8.2）', () => {
  const long = `# Title\n\n${'あ'.repeat(2000)}`;
  const excerpt = buildReadmeExcerpt(long);
  assert.ok(excerpt.length <= README_EXCERPT_MAX, `${excerpt.length} 字`);
  assert.ok(excerpt.endsWith('…'));
});

test('README 抜粋はバッジ・コードブロックを落とす', () => {
  const md = [
    '# awesome-tool',
    '[![build](https://img.shields.io/badge.svg)](https://example.com)',
    '',
    'A fast tool for developers.',
    '',
    '```bash',
    'npm install awesome-tool',
    '```',
  ].join('\n');
  const excerpt = buildReadmeExcerpt(md);
  assert.ok(excerpt.includes('A fast tool for developers.'));
  assert.ok(!excerpt.includes('img.shields.io'));
  assert.ok(!excerpt.includes('npm install'));
});

test('Trending の HTML パース', () => {
  const html = `
    <article class="Box-row">
      <h2 class="h3 lh-condensed"><a href="/owner-a/repo-a">owner-a / repo-a</a></h2>
    </article>
    <article class="Box-row">
      <h2 class="h3 lh-condensed"><a href="/owner-b/repo-b">owner-b / repo-b</a></h2>
    </article>`;
  assert.deepEqual(parseTrendingHtml(html), ['owner-a/repo-a', 'owner-b/repo-b']);
});

test('Trending の構造が変わったら空を返す（＝破損として検知できる）', () => {
  assert.deepEqual(parseTrendingHtml('<div>totally different</div>'), []);
});

test('同時実行数が上限を超えない（SPEC §10.2）', async () => {
  const limit = createLimiter(3);
  let active = 0;
  let peak = 0;
  await Promise.all(
    Array.from({ length: 20 }, () =>
      limit(async () => {
        active++;
        peak = Math.max(peak, active);
        await new Promise((r) => setTimeout(r, 5));
        active--;
      })
    )
  );
  assert.equal(peak, 3);
});

test('mapLimited は1件の失敗で全体を止めない（SPEC §11）', async () => {
  const results = await mapLimited([1, 2, 3], 2, async (n) => {
    if (n === 2) throw new Error('boom');
    return n * 10;
  });
  assert.equal(results.filter((r) => 'ok' in r).length, 2);
  assert.equal(results.filter((r) => 'error' in r).length, 1);
});

const sampleGh = {
  full_name: 'octocat/hello',
  owner: { login: 'octocat' },
  name: 'hello',
  description: 'hi',
  language: 'TypeScript',
  topics: ['cli'],
  stargazers_count: 1200,
  forks_count: 30,
  watchers_count: 1200,
  open_issues_count: 4,
  created_at: '2026-01-01T00:00:00Z',
  pushed_at: '2026-08-01T00:00:00Z',
  archived: false,
  license: { spdx_id: 'MIT' },
};

test('取得頻度は層で変わる（SPEC §10.4）', () => {
  const base = newRepository(sampleGh);

  const hot = { ...base, tracking_tier: 'hot' as const, last_fetched_date: '2026-08-27' };
  assert.equal(shouldFetchToday(hot, '2026-08-28'), true);

  const normal = { ...base, tracking_tier: 'normal' as const, last_fetched_date: '2026-08-27' };
  assert.equal(shouldFetchToday(normal, '2026-08-28'), false);
  assert.equal(shouldFetchToday(normal, '2026-08-30'), true);

  const dormant = { ...base, tracking_tier: 'dormant' as const, last_fetched_date: '2026-08-24' };
  assert.equal(shouldFetchToday(dormant, '2026-08-28'), false);
  assert.equal(shouldFetchToday(dormant, '2026-08-31'), true);

  // 未取得のものは必ず対象になる
  assert.equal(shouldFetchToday(base, '2026-08-28'), true);
});

test('新規レコードの機械判定項目は Phase 1 まで初期値のまま', () => {
  const repo = newRepository(sampleGh);
  assert.equal(repo.id, 'octocat/hello');
  assert.equal(repo.license_category, 'permissive');
  assert.deepEqual(repo.flags, []);
  assert.equal(repo.category, null);
  assert.equal(repo.is_indexable, false);
  assert.equal(repo.tracking_tier, 'hot');
});
