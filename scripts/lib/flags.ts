/**
 * 警告フラグの判定（SPEC §7.1 / D-004）
 *
 * ★ 見ているのは「実運用に耐えるか」だけ。
 *   偽スター判定は D-004 で廃止した。理由は docs/DECISIONS.md を参照。
 *
 * ★ LLM は使わない。すべて決定的なロジックで判定する（SPEC §9.1）。
 * ★ 表記は「疑い」に留め、断定しない。
 *   このサイトはリポジトリを紹介する場であって、断罪する場ではない。
 *   断定表現は名誉毀損リスクも生む。label / reason の文言を安易に強めないこと。
 *
 * 閾値は scripts/lib/thresholds.ts に集約し、/about/criteria で全公開する。
 */

import { THRESHOLDS as T } from './thresholds.js';
import { daysSince } from './date.js';
import type { Flag, Repository } from '../../src/types.js';

/**
 * そのリポジトリに立つ警告フラグをすべて返す。
 *
 * 紹介サイトなので、警告は「紹介したものを安全に使えるか」を添えるためのもの。
 * 主役ではない。
 */
export function detectFlags(repo: Repository, now: Date = new Date()): Flag[] {
  const flags: Flag[] = [];

  if (repo.is_archived) {
    flags.push({
      id: 'archived',
      label: 'アーカイブ済み',
      reason: '作者がアーカイブしています。新しい変更は入りません。',
    });
  }

  const idleDays = daysSince(repo.pushed_at, now);
  if (idleDays >= T.staleDays) {
    flags.push({
      id: 'stale',
      label: 'メンテ停止の疑い',
      reason: `最終コミットから ${idleDays} 日が経過しています（判定は ${T.staleDays} 日以上）。`,
    });
  }

  if (repo.license_category === 'none') {
    flags.push({
      id: 'no_license',
      label: '利用条件不明',
      reason:
        'ライセンスが設定されていません。この場合は原則として全権利が留保され、利用できません。',
    });
  }

  if (repo.license_category === 'strong-copyleft') {
    flags.push({
      id: 'copyleft',
      label: '自社サービス組込み注意',
      reason: `${repo.license_spdx ?? 'コピーレフト系'} です。組み込んだ側のソース公開が必要になる場合があります。`,
    });
  }

  // ★ null は「まだ取得できていない」なので判定しない。0 は「README が無い」なので判定する
  if (repo.readme_length !== null && repo.readme_length < T.thinReadmeLength) {
    // 単機能ライブラリでは正常に起きる。強い警告にしない（SPEC §7.1 の誤検知注意）
    flags.push({
      id: 'thin_readme',
      label: repo.readme_length === 0 ? 'README がありません' : 'ドキュメントが少なめ',
      reason:
        repo.readme_length === 0
          ? 'README が置かれていません。使い方を知るにはコードを読む必要があります。'
          : `README が ${repo.readme_length} 字です（判定は ${T.thinReadmeLength} 字未満）。単機能のライブラリでは正常な場合もあります。`,
    });
  }

  return flags;
}
