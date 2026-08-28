/**
 * 機械判定のテスト（SPEC §2.4 / §2.5 / §6.3 / §7.1 / §7.4 / D-004）
 *
 * 仕様の数値がそのままテストになるように書く。
 * 閾値を変えたら、このテストと docs/criteria.md の両方が落ちる／ずれることを意図している。
 *
 *   npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { categorize } from '../scripts/lib/categorize.js';
import { detectFlags } from '../scripts/lib/flags.js';
import { isIndexable, shouldGeneratePage, usabilityScore } from '../scripts/lib/score.js';
import { newRepository } from '../scripts/lib/repository.js';
import type { Repository } from '../src/types.js';

const NOW = new Date('2026-08-29T00:00:00Z');

function repo(over: Partial<Repository> = {}): Repository {
  const base = newRepository({
    full_name: 'octocat/hello',
    owner: { login: 'octocat' },
    name: 'hello',
    description: 'hi',
    language: 'TypeScript',
    topics: [],
    stargazers_count: 2000,
    forks_count: 200,
    watchers_count: 2000,
    open_issues_count: 30,
    created_at: '2024-01-01T00:00:00Z',
    pushed_at: '2026-08-27T00:00:00Z',
    archived: false,
    license: { spdx_id: 'MIT' },
  });
  return { ...base, readme_length: 3000, contributors_count: 20, releases_count: 8, ...over };
}

// ---------------------------------------------------------------------------
// カテゴリ分類（SPEC §6.3）
// ---------------------------------------------------------------------------

test('カテゴリはルールベースで決まる（LLM を使わない）', () => {
  assert.equal(categorize(['ai-agent', 'python'], 'Python'), 'ai-agent');
  assert.equal(categorize(['llm', 'rag'], 'Python'), 'llm');
  assert.equal(categorize(['security', 'cve'], 'Go'), 'security');
  assert.equal(categorize(['kubernetes'], 'Go'), 'infra');
  assert.equal(categorize(['react', 'css'], 'TypeScript'), 'web-frontend');
  assert.equal(categorize(['cli', 'linter'], 'Rust'), 'dev-tool');
  assert.equal(categorize([], null), 'other');
});

test('教材系はリポジトリ名からも learning に寄せる', () => {
  assert.equal(categorize([], 'Markdown', 'awesome-rust'), 'learning');
  assert.equal(categorize(['roadmap'], null, 'developer-roadmap'), 'learning');
});

// ---------------------------------------------------------------------------
// 警告フラグとスコア（SPEC §7.1 / §7.4）
// ---------------------------------------------------------------------------

test('stale は最終コミット180日以上で立つ', () => {
  const ids = (r: Repository) => detectFlags(r, NOW).map((f) => f.id);
  assert.ok(!ids(repo({ pushed_at: '2026-04-01T00:00:00Z' })).includes('stale')); // 150日
  assert.ok(ids(repo({ pushed_at: '2026-01-01T00:00:00Z' })).includes('stale')); // 240日
});

test('ライセンス未設定とコピーレフトを区別する', () => {
  const noLicense = detectFlags(repo({ license_category: 'none', license_spdx: null }), NOW);
  assert.ok(noLicense.some((f) => f.id === 'no_license'));

  const agpl = detectFlags(repo({ license_category: 'strong-copyleft', license_spdx: 'AGPL-3.0' }), NOW);
  assert.ok(agpl.some((f) => f.id === 'copyleft'));
  assert.ok(!agpl.some((f) => f.id === 'no_license'));

  const mit = detectFlags(repo({ license_category: 'permissive' }), NOW);
  assert.ok(!mit.some((f) => f.id === 'no_license' || f.id === 'copyleft'));
});

test('README が無い場合も警告する。未取得とは区別する', () => {
  // null = まだ取得できていない → 判定しない
  assert.ok(!detectFlags(repo({ readme_length: null }), NOW).some((f) => f.id === 'thin_readme'));
  // 0 = README が存在しない → 判定する（最も薄いケースを素通りさせない）
  const none = detectFlags(repo({ readme_length: 0 }), NOW);
  const flag = none.find((f) => f.id === 'thin_readme');
  assert.ok(flag, 'README が無いのに警告されていない');
  assert.match(flag.label, /README がありません/);
  assert.equal(usabilityScore(none), 90);
});

test('usability_score は仕様どおりに減点する（SPEC §7.4）', () => {
  assert.equal(usabilityScore([]), 100);

  const archived = detectFlags(repo({ is_archived: true }), NOW);
  assert.equal(usabilityScore(archived), 50);

  // アーカイブ50 + ライセンス未設定40 + メンテ停止30 → 下限0で止まる
  const worst = detectFlags(
    repo({ is_archived: true, license_category: 'none', pushed_at: '2024-06-01T00:00:00Z' }),
    NOW
  );
  assert.equal(usabilityScore(worst), 0);
});

test('警告は「疑い」に留め、断定しない', () => {
  const stale = detectFlags(repo({ pushed_at: '2025-01-01T00:00:00Z' }), NOW).find((f) => f.id === 'stale');
  assert.ok(stale);
  assert.match(stale.label, /疑い/);
  // 「危険」「悪質」のような断定・非難の語を使わない
  for (const flag of detectFlags(repo({ is_archived: true, license_category: 'none' }), NOW)) {
    assert.doesNotMatch(flag.label + flag.reason, /危険|悪質|詐欺|偽装/);
  }
});

// ---------------------------------------------------------------------------
// ページ生成と index（SPEC §2.4 / §2.5）★SEOリスク管理の要
// ---------------------------------------------------------------------------

test('日本語の紹介文があるものは必ずページを作る（D-001 の主役）', () => {
  const introduced = repo({ stars: 120, human_note: '手元で動かしてみたところ、設定ファイル1枚で完結するのが効く。' });
  assert.equal(shouldGeneratePage(introduced, 0), true);
  assert.equal(isIndexable(introduced, 0), true);
});

test('個別ページは生成基準を満たしたものだけ作る（SPEC §2.4）', () => {
  assert.equal(shouldGeneratePage(repo({ stars: 1200 }), 5), true, 'スター1,000以上');
  assert.equal(shouldGeneratePage(repo({ stars: 300 }), 400), true, '日次増加300以上');

  const flagged = repo({ stars: 300 });
  flagged.flags = detectFlags(repo({ stars: 300, license_category: 'none' }), NOW);
  assert.equal(shouldGeneratePage(flagged, 5), true, '警告フラグあり');

  // どれも満たさないものはページを作らない（一覧に行として載せるだけ）
  assert.equal(shouldGeneratePage(repo({ stars: 300 }), 5), false);
});

test('警告つきは必ず index する。低スコアで noindex にしない（SPEC §2.5）', () => {
  const flagged = repo({ stars: 300, snapshot_days: 1 });
  flagged.flags = detectFlags(repo({ license_category: 'none' }), NOW);
  flagged.usability_score = usabilityScore(flagged.flags);
  assert.ok(flagged.usability_score < 100);
  assert.equal(isIndexable(flagged, 5), true, '警告つきこそ見せたいコンテンツ');
});

test('英語 description を訳しただけの中身なしページは index しない（SPEC §2.3 S6）', () => {
  // 紹介文なし・警告なし・履歴も足りない → 独自の価値が無いので noindex
  assert.equal(isIndexable(repo({ stars: 2000, snapshot_days: 3 }), 5), false);
  // 履歴が7日たまれば、スター推移という独自データが載るので index する
  assert.equal(isIndexable(repo({ stars: 2000, snapshot_days: 7 }), 5), true);
});

test('ページを作らないものは index 対象に数えない（sitemap に404が並ぶのを防ぐ）', () => {
  const notGenerated = repo({ stars: 300, snapshot_days: 30 });
  assert.equal(shouldGeneratePage(notGenerated, 5), false);
  assert.equal(isIndexable(notGenerated, 5), false);
});
