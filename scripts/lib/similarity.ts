/**
 * duplicate_suspect の突き合わせ（SPEC §7.1）
 *
 * 「同名/類似名が同期間に複数」。正規化した名前が一致し、
 * 初回検知が近く、かつ owner が異なるものを候補とする。
 *
 * ★ 誤検知しやすい判定なので、owner が同じもの（本人の関連リポジトリ）は除外する。
 * ★ evaluate.ts に置くと、import しただけで判定パイプラインが走ってしまうため lib に置く。
 */

import { THRESHOLDS as T } from './thresholds.js';
import { normalizeRepoName } from './flags.js';
import { daysBetween } from './date.js';
import type { Repository } from '../../src/types.js';

export function buildSimilarityIndex(repos: Repository[]): Map<string, string[]> {
  const buckets = new Map<string, Repository[]>();
  for (const repo of repos) {
    const key = normalizeRepoName(repo.name);
    if (key.length < 4) continue; // 短すぎる名前は偶然一致しやすい
    const list = buckets.get(key) ?? [];
    list.push(repo);
    buckets.set(key, list);
  }

  const result = new Map<string, string[]>();
  for (const group of buckets.values()) {
    if (group.length < 2) continue;
    for (const repo of group) {
      const others = group.filter(
        (o) =>
          o.id !== repo.id &&
          o.owner !== repo.owner &&
          Math.abs(
            daysBetween(repo.first_seen_at.slice(0, 10), o.first_seen_at.slice(0, 10))
          ) <= T.duplicateWindowDays
      );
      if (others.length > 0) result.set(repo.id, others.map((o) => o.id));
    }
  }
  return result;
}
