/**
 * ライセンス区分の判定（SPEC §6.1 / §9.1）
 *
 * LLM は使わない。GitHub API が返す SPDX ID の構造化データだけで機械的に分類する。
 * 判定基準は /about/criteria で全公開する前提なので、ここのルールが仕様そのものになる。
 */

import type { LicenseCategory } from '../../src/types.js';

/** 緩いライセンス。商用利用・組込みの障害になりにくい */
const PERMISSIVE = new Set([
  'MIT', 'MIT-0', 'APACHE-2.0', 'BSD-2-CLAUSE', 'BSD-3-CLAUSE', 'BSD-3-CLAUSE-CLEAR',
  'ISC', 'UNLICENSE', 'CC0-1.0', '0BSD', 'ZLIB', 'BSL-1.0', 'PSF-2.0', 'POSTGRESQL',
  'ARTISTIC-2.0', 'NCSA', 'WTFPL', 'MS-PL', 'UPL-1.0', 'AFL-3.0', 'ECL-2.0',
]);

/** 弱いコピーレフト。改変部分のみ継承。リンクは比較的自由 */
const WEAK_COPYLEFT = new Set([
  'LGPL-2.1', 'LGPL-3.0', 'LGPL-2.0', 'MPL-2.0', 'MPL-1.1', 'EPL-1.0', 'EPL-2.0',
  'CDDL-1.0', 'CDDL-1.1', 'OSL-3.0', 'EUPL-1.1', 'EUPL-1.2',
]);

/** 強いコピーレフト。自社サービスへの組込みに注意が必要 */
const STRONG_COPYLEFT = new Set([
  'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'SSPL-1.0', 'CC-BY-SA-4.0', 'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0', 'OFL-1.1',
]);

/** GitHub がライセンスを特定できなかったときに返す値 */
const UNRECOGNIZED = new Set(['NOASSERTION', 'OTHER']);

export function categorizeLicense(spdxId: string | null | undefined): LicenseCategory {
  if (!spdxId) return 'none';
  const id = spdxId.toUpperCase();
  if (id === 'NONE') return 'none';
  if (UNRECOGNIZED.has(id)) return 'unknown';
  if (PERMISSIVE.has(id)) return 'permissive';
  if (WEAK_COPYLEFT.has(id)) return 'weak-copyleft';
  if (STRONG_COPYLEFT.has(id)) return 'strong-copyleft';
  // 未知の SPDX ID。断定せず unknown に倒す（誤った商用可否表示は信頼を壊す）
  return 'unknown';
}

/** ライセンス未設定は「全権利留保」であり、原則利用不可（SPEC §7.1 no_license） */
export function isUnlicensed(category: LicenseCategory): boolean {
  return category === 'none';
}
