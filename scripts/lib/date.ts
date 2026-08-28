/**
 * 日付ユーティリティ。
 *
 * サイトの日付は JST 基準で扱う（日次パイプラインは 06:00 JST 実行・SPEC §11）。
 * GitHub Actions のランナーは UTC なので、必ずここを経由すること。
 */

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** JST の YYYY-MM-DD */
export function todayJST(now: Date = new Date()): string {
  return toDateStringJST(now);
}

export function toDateStringJST(d: Date): string {
  return new Date(d.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

/** YYYY-MM-DD に日数を足す（負値で過去へ） */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 2つの YYYY-MM-DD の日数差（a - b） */
export function daysBetween(a: string, b: string): number {
  const ms = new Date(`${a}T00:00:00Z`).getTime() - new Date(`${b}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/** ISO8601 から現在までの経過日数 */
export function daysSince(iso: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
}
