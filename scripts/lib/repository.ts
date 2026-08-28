/**
 * Repository レコードの生成（SPEC §6.1）
 *
 * collect.ts と seed.ts の両方から使うため lib に置く。
 * collect.ts に置くと、import しただけで日次パイプラインが走ってしまう。
 */

import { categorizeLicense } from './license.js';
import type { GitHubRepo, Repository } from '../../src/types.js';

/**
 * 新規検知したリポジトリの初期レコード。
 * 機械判定の項目（flags / score / category / is_indexable）は Phase 1 で埋める。
 */
export function newRepository(gh: GitHubRepo, firstSeenAt: string = new Date().toISOString()): Repository {
  return {
    id: gh.full_name,
    owner: gh.owner.login,
    name: gh.name,
    description_en: gh.description,
    human_note: null,
    language: gh.language,
    topics: gh.topics ?? [],
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    // ★ API の watchers_count はスター数と同じ値。検索結果には subscribers_count が
    //   含まれないため、個別取得するまでは「不明」として null にする
    watchers: gh.subscribers_count ?? null,
    open_issues: gh.open_issues_count,
    created_at: gh.created_at,
    pushed_at: gh.pushed_at,
    is_archived: gh.archived,
    license_spdx: gh.license?.spdx_id ?? null,
    license_category: categorizeLicense(gh.license?.spdx_id),
    readme_excerpt: '',
    readme_length: null, // 未取得。README が無いことが分かったら 0 にする
    has_japanese_readme: false,
    contributors_count: null,
    releases_count: null,
    dependents_count: null,
    ossf_scorecard: null,
    category: null,
    flags: [],
    usability_score: 100,
    fake_star_suspicion: 'none',
    suspicion_signals: [],
    suspicion_provisional: true, // 履歴が貯まるまでは判定中
    snapshot_days: 0,
    is_indexable: false,
    first_seen_at: firstSeenAt,
    tracking_tier: 'hot',
    last_fetched_date: '',
    stars_stagnant_days: 0,
  };
}
