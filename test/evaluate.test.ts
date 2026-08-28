/**
 * 機械判定のテスト（SPEC §2.4 / §2.5 / §6.3 / §7）
 *
 * ここは差別化の核なので、仕様の数値がそのままテストになるように書く。
 * 閾値を変えたら、このテストと docs/criteria.md の両方が落ちる／ずれることを意図している。
 *
 *   npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { categorize } from '../scripts/lib/categorize.js';
import {
  detectFlags,
  detectLowActivity,
  detectNoRealUsage,
  detectStarSpike,
  normalizeRepoName,
} from '../scripts/lib/flags.js';
import {
  fakeStarSuspicion,
  isIndexable,
  isSuspicionProvisional,
  shouldGeneratePage,
  usabilityScore,
} from '../scripts/lib/score.js';
import { buildSimilarityIndex } from '../scripts/lib/similarity.js';
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
  return {
    ...base,
    readme_length: 3000,
    contributors_count: 20,
    releases_count: 8,
    ...over,
  };
}

const hist = (deltas: number[], latestDate = '2026-08-29') => ({
  deltas,
  latestDelta: deltas.at(-1) ?? null,
  latestDate: deltas.length ? latestDate : null,
});

const ctx = (
  over: Partial<Parameters<typeof detectFlags>[1]> = {}
): Parameters<typeof detectFlags>[1] => ({
  history: hist([]),
  category: 'other',
  similarIds: [],
  today: '2026-08-29',
  now: NOW,
  ...over,
});

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

test('教材系はリポジトリ名からも learning に寄せる（fork 比率の誤検知対策）', () => {
  assert.equal(categorize([], 'Markdown', 'awesome-rust'), 'learning');
  assert.equal(categorize(['roadmap'], null, 'developer-roadmap'), 'learning');
});

// ---------------------------------------------------------------------------
// 実運用の軸（SPEC §7.1 / §7.4）
// ---------------------------------------------------------------------------

test('stale は最終コミット180日以上で立つ', () => {
  const ids = (r: Repository) => detectFlags(r, ctx()).map((f) => f.id);
  assert.ok(!ids(repo({ pushed_at: '2026-04-01T00:00:00Z' })).includes('stale')); // 150日
  assert.ok(ids(repo({ pushed_at: '2026-01-01T00:00:00Z' })).includes('stale')); // 240日
});

test('ライセンス未設定とコピーレフトを区別する', () => {
  const noLicense = detectFlags(repo({ license_category: 'none', license_spdx: null }), ctx());
  assert.ok(noLicense.some((f) => f.id === 'no_license'));

  const agpl = detectFlags(repo({ license_category: 'strong-copyleft', license_spdx: 'AGPL-3.0' }), ctx());
  assert.ok(agpl.some((f) => f.id === 'copyleft'));
  assert.ok(!agpl.some((f) => f.id === 'no_license'));

  const mit = detectFlags(repo({ license_category: 'permissive' }), ctx());
  assert.ok(!mit.some((f) => f.id === 'no_license' || f.id === 'copyleft'));
});

test('★README が無い場合も警告する。未取得とは区別する', () => {
  // null = まだ取得できていない → 判定しない
  assert.ok(!detectFlags(repo({ readme_length: null }), ctx()).some((f) => f.id === 'thin_readme'));
  // 0 = README が存在しない → 判定する（最も薄いケースを素通りさせない）
  const none = detectFlags(repo({ readme_length: 0 }), ctx());
  const flag = none.find((f) => f.id === 'thin_readme');
  assert.ok(flag, 'README が無いのに警告されていない');
  assert.match(flag.label, /README がありません/);
  assert.equal(usabilityScore(none), 90);
});

test('usability_score は仕様どおりに減点する（SPEC §7.4）', () => {
  assert.equal(usabilityScore([]), 100);

  const archived = detectFlags(repo({ is_archived: true }), ctx());
  assert.equal(usabilityScore(archived), 50);

  // アーカイブ50 + ライセンス未設定40 + メンテ停止30 → 下限0で止まる
  const worst = detectFlags(
    repo({ is_archived: true, license_category: 'none', pushed_at: '2024-06-01T00:00:00Z' }),
    ctx()
  );
  assert.equal(usabilityScore(worst), 0);
});

test('偽スター系のフラグは usability_score に混ぜない（SPEC §7 の2軸分離）', () => {
  // スター急増だけが立っている状態でも、実運用スコアは満点のまま
  const flags = detectFlags(repo({ stars: 20000 }), ctx({ history: hist([10, 10, 10, 10, 10, 10, 10, 5000]) }));
  assert.ok(flags.some((f) => f.id === 'star_spike'));
  assert.equal(usabilityScore(flags), 100);
});

// ---------------------------------------------------------------------------
// 偽スターの軸（SPEC §7.1 / §7.2 / §7.3）
// ---------------------------------------------------------------------------

test('star_spike は過去7日平均の10倍超で立つ', () => {
  const normal = detectStarSpike(hist([20, 20, 20, 20, 20, 20, 20, 100]), '2026-08-29');
  assert.equal(normal.flagged, false); // 5倍なので該当しない

  const spike = detectStarSpike(hist([20, 20, 20, 20, 20, 20, 20, 400]), '2026-08-29');
  assert.equal(spike.flagged, true); // 20倍
  assert.equal(spike.provisional, false);
});

test('増加が小さいうちは倍率が跳ねても急増としない', () => {
  // 平均1 → 30 は30倍だが、増加数が小さいので判定しない
  assert.equal(detectStarSpike(hist([1, 1, 1, 1, 1, 1, 1, 30]), '2026-08-29').flagged, false);
});

test('履歴が7日未満なら観測値の中央値と比べ、暫定になる（SPEC §7.3）', () => {
  const result = detectStarSpike(hist([20, 20, 800]), '2026-08-29');
  assert.equal(result.flagged, true);
  assert.equal(result.provisional, true, '暫定判定であることが分かるようにする');
  assert.match(result.reason ?? '', /暫定/);
});

test('★代替判定は古い定番リポジトリを誤検知しない（生涯平均を使わない）', () => {
  // 生涯平均で判定すると、正常なトレンド入りでも警告が出てしまう。
  // 観測できた増加の中央値と比べれば該当しない
  assert.equal(detectStarSpike(hist([150, 180, 200]), '2026-08-29').flagged, false);
});

test('★代替判定は新参の急伸を取りこぼさない', () => {
  // 生涯平均で判定すると、平均が大きすぎて絶対に立たない。
  // 観測できた増加の中央値と比べれば急増として拾える
  assert.equal(detectStarSpike(hist([20, 20, 4000]), '2026-08-29').flagged, true);
});

test('履歴が1日も無ければ判定せず、判定中のままにする', () => {
  const result = detectStarSpike(hist([]), '2026-08-29');
  assert.equal(result.flagged, false);
  assert.equal(result.provisional, true);
});

test('★観測が古い場合は急増を判定しない（3層構造で毎日は取得しないため）', () => {
  const spikes = [20, 20, 20, 20, 20, 20, 20, 4000];
  // 4日前の観測。古い急増を根拠に警告が残り続けるのを防ぐ
  assert.equal(detectStarSpike(hist(spikes, '2026-08-25'), '2026-08-29').flagged, false);
  // 2日前なら判定する
  assert.equal(detectStarSpike(hist(spikes, '2026-08-27'), '2026-08-29').flagged, true);
});

test('履歴が足りないうちは「判定中」として扱える（SPEC §7.3）', () => {
  assert.equal(isSuspicionProvisional(repo({ suspicion_provisional: true })), true);
  assert.equal(isSuspicionProvisional(repo({ suspicion_provisional: false })), false);
});

test('★暫定判定はシグナルに数えない（検知直後に疑いが乱発されるのを防ぐ）', () => {
  const r = repo({ dependents_count: 500 });
  const flags = detectFlags(r, ctx({ history: hist([20, 20, 900]) }));
  assert.ok(flags.some((f) => f.id === 'star_spike'), '根拠としては表示する');

  const result = fakeStarSuspicion(r, hist([20, 20, 900]), NOW, '2026-08-29');
  assert.equal(result.level, 'none', '暫定なのでレベルは上げない');
  assert.equal(result.provisional, true);
});

test('low_activity はスター規模に対して活動が伴わない場合だけ立つ', () => {
  // スター1万・fork 30・Issue 1・貢献者1 → 該当
  assert.equal(detectLowActivity(repo({ stars: 10000, forks: 30, open_issues: 1, contributors_count: 1 })), true);
  // 同じ比率でもスターが小さければ判定しない
  assert.equal(detectLowActivity(repo({ stars: 300, forks: 1, open_issues: 0, contributors_count: 1 })), false);
  // fork が十分あれば該当しない
  assert.equal(detectLowActivity(repo({ stars: 10000, forks: 900, open_issues: 1, contributors_count: 1 })), false);
});

test('★小規模リポジトリを「実利用の欠如」で拾わない', () => {
  // スター5・fork 0・リリース0。fork比率だけ見ると該当してしまうが、
  // §7.5 の意図は「スターは多いのに使われていない」
  const tiny = detectNoRealUsage(
    repo({ stars: 5, forks: 0, open_issues: 0, releases_count: 0, contributors_count: 5, dependents_count: null })
  );
  assert.equal(tiny.flagged, false, '拾ってしまっている: ' + tiny.signals.join(' / '));
});

test('実利用の欠如は dependents を優先し、無ければ代替シグナルを合成する（SPEC §7.5）', () => {
  // 取得できる場合
  assert.equal(detectNoRealUsage(repo({ dependents_count: 0 })).flagged, true);
  assert.equal(detectNoRealUsage(repo({ dependents_count: 120 })).flagged, false);

  // 取得できない場合：リリース0 + 貢献者1 の2本 → 該当
  const alt = detectNoRealUsage(repo({ dependents_count: null, releases_count: 0, contributors_count: 1 }));
  assert.equal(alt.flagged, true);
  assert.equal(alt.signals.length >= 2, true);

  // 1本だけでは該当しない
  const single = detectNoRealUsage(repo({ dependents_count: null, releases_count: 0, contributors_count: 30, forks: 400 }));
  assert.equal(single.flagged, false);
});

test('該当シグナル数で疑いの段階が決まる（SPEC §7.2）', () => {
  const clean = fakeStarSuspicion(repo({ dependents_count: 120 }), hist([]), NOW, '2026-08-29');
  assert.equal(clean.level, 'none');

  // 急増 + 低活動 + 実利用の欠如 → 3つで high
  const bad = fakeStarSuspicion(
    repo({
      stars: 12000,
      forks: 40,
      open_issues: 1,
      contributors_count: 1,
      releases_count: 0,
      created_at: '2026-08-15T00:00:00Z',
    }),
    hist([20, 20, 20, 20, 20, 20, 20, 4000]),
    NOW,
    '2026-08-29'
  );
  assert.equal(bad.level, 'high');
  assert.equal(bad.signals.length >= 3, true);
});

test('★低活動と実利用の欠如は二重に数えない（同じ事実を見ているため）', () => {
  // fork少・Issue 0・貢献者1 という「ひとつの状況」。両方の条件に当たるが1シグナル
  const r = repo({ stars: 10000, forks: 30, open_issues: 0, contributors_count: 1, releases_count: 0 });
  const result = fakeStarSuspicion(r, hist([10, 10, 10, 10, 10, 10, 10, 12]), NOW, '2026-08-29');
  assert.equal(result.signals.length, 1, '二重計上: ' + result.signals.join(' / '));
  assert.equal(result.level, 'low');
});

test('教材系リポジトリでは fork 比率の閾値を緩める（SPEC §7.1 の誤検知注意）', () => {
  // fork がスターの80%。通常なら該当するが、learning では立てない
  const r = repo({ stars: 10000, forks: 8000 });
  assert.ok(detectFlags(r, ctx({ category: 'other' })).some((f) => f.id === 'abnormal_fork_ratio'));
  assert.ok(!detectFlags(r, ctx({ category: 'learning' })).some((f) => f.id === 'abnormal_fork_ratio'));
});

test('duplicate_suspect は owner が違い、検知時期が近いものだけを拾う', () => {
  const a = repo({ id: 'alpha/vector-store', owner: 'alpha', name: 'vector-store', first_seen_at: '2026-08-20T00:00:00Z' });
  const b = repo({ id: 'beta/vector_store', owner: 'beta', name: 'vector_store', first_seen_at: '2026-08-22T00:00:00Z' });
  // 同じ owner の関連リポジトリは対象外
  const c = repo({ id: 'alpha/vectorstore', owner: 'alpha', name: 'vectorstore', first_seen_at: '2026-08-21T00:00:00Z' });
  // 検知時期が離れているものも対象外
  const d = repo({ id: 'gamma/vector-store', owner: 'gamma', name: 'vector-store', first_seen_at: '2026-01-05T00:00:00Z' });

  const index = buildSimilarityIndex([a, b, c, d]);
  assert.deepEqual(index.get('alpha/vector-store'), ['beta/vector_store']);
  assert.equal(index.get('gamma/vector-store'), undefined);
});

test('名前の正規化は区切り文字と末尾の数字を無視する', () => {
  assert.equal(normalizeRepoName('vector-store'), normalizeRepoName('vector_store'));
  assert.equal(normalizeRepoName('agentkit2'), normalizeRepoName('agent-kit'));
});

test('★言語ポートを重複と誤検知しない', () => {
  // 正当な言語ポート同士は別物として扱う
  assert.notEqual(normalizeRepoName('langchain-go'), normalizeRepoName('langchain-rs'));
  // 単語の一部を言語名として削らない
  assert.equal(normalizeRepoName('cargo'), 'cargo');
  assert.equal(normalizeRepoName('django'), 'django');
});

// ---------------------------------------------------------------------------
// ページ生成と index（SPEC §2.4 / §2.5）★SEOリスク管理の要
// ---------------------------------------------------------------------------

test('個別ページは生成基準を満たしたものだけ作る（SPEC §2.4）', () => {
  assert.equal(shouldGeneratePage(repo({ stars: 1200 }), 5), true, 'スター1,000以上');
  assert.equal(shouldGeneratePage(repo({ stars: 300 }), 400), true, '日次増加300以上');
  assert.equal(shouldGeneratePage(repo({ stars: 300, human_note: '手動の一言' }), 5), true, '手動で注目指定');

  const flagged = repo({ stars: 300 });
  flagged.flags = detectFlags(repo({ stars: 300, license_category: 'none' }), ctx());
  assert.equal(shouldGeneratePage(flagged, 5), true, '警告フラグあり');

  // どれも満たさないものはページを作らない（一覧に行として載せるだけ）
  assert.equal(shouldGeneratePage(repo({ stars: 300 }), 5), false);
});

test('警告つきは必ず index する。低スコアで noindex にしない（SPEC §2.5）', () => {
  const flagged = repo({ stars: 300, snapshot_days: 1 });
  flagged.flags = detectFlags(repo({ license_category: 'none' }), ctx());
  flagged.usability_score = usabilityScore(flagged.flags);
  assert.ok(flagged.usability_score < 100);
  assert.equal(isIndexable(flagged, 5), true, '警告つきこそ見せたいコンテンツ');

  // 疑いがあるだけでも index する（スター1,000以上でページが作られる場合）
  assert.equal(isIndexable(repo({ stars: 2000, snapshot_days: 1, fake_star_suspicion: 'low' }), 5), true);

  // 履歴が7日たまれば index する
  assert.equal(isIndexable(repo({ stars: 2000, snapshot_days: 7 }), 5), true);

  // 何もないもの（description の翻訳と定型データだけ）は noindex
  assert.equal(isIndexable(repo({ stars: 2000, snapshot_days: 3 }), 5), false);
});

test('★ページを作らないものは index 対象に数えない（sitemap に404が並ぶのを防ぐ）', () => {
  const notGenerated = repo({ stars: 300, snapshot_days: 30, fake_star_suspicion: 'low' });
  assert.equal(shouldGeneratePage(notGenerated, 5), false);
  assert.equal(isIndexable(notGenerated, 5), false);
});
