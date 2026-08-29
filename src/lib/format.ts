/**
 * 表示用の整形（サイト本体でのみ使う）
 *
 * ★ ここで事実を作らない。取得した値の見せ方だけを決める。
 *   「〜の疑い」を「〜である」に変える類の言い換えは書かないこと（SPEC §8）。
 */

import type { LicenseCategory, Repository } from '../types.js';

/** 3桁区切り。桁が揃うほうが一覧で比べやすい */
export function num(n: number): string {
  return n.toLocaleString('ja-JP');
}

/** JST の YYYY-MM-DD を「8月29日」にする */
export function jaDate(ymd: string): string {
  const [, m, d] = ymd.split('-');
  return `${Number(m)}月${Number(d)}日`;
}

/** ISO8601 を JST の YYYY-MM-DD にする */
export function toJstDate(iso: string): string {
  const t = new Date(iso).getTime() + 9 * 60 * 60 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * 「2日前に更新」「8か月 更新なし」。
 * 3か月以上あいたものは注意色にしたいので、日数も一緒に返す
 */
export function updatedAgo(pushedAt: string, today = new Date()): { text: string; days: number } {
  const days = Math.max(0, Math.floor((today.getTime() - new Date(pushedAt).getTime()) / 86_400_000));
  if (days === 0) return { text: '今日 更新', days };
  if (days === 1) return { text: '昨日 更新', days };
  if (days < 30) return { text: `${days}日前に更新`, days };
  const months = Math.floor(days / 30);
  if (months < 12) return { text: `${months}か月前に更新`, days };
  return { text: `${Math.floor(days / 365)}年以上 更新なし`, days };
}

/**
 * ライセンスの表示。★商用可否まで書く（SPEC §7）。
 * SPDX だけ出しても、読む人が判断できない
 */
export function licenseLabel(repo: Repository): { text: string; tone: 'ok' | 'warn' | 'danger' } {
  const spdx = repo.license_spdx;
  const category: LicenseCategory = repo.license_category;
  switch (category) {
    case 'permissive':
      return { text: `${spdx ?? 'ライセンスあり'} · 商用可`, tone: 'ok' };
    case 'weak-copyleft':
      return { text: `${spdx ?? 'コピーレフト'} · 改変部分の公開義務あり`, tone: 'warn' };
    case 'strong-copyleft':
      return { text: `${spdx ?? 'コピーレフト'} · 組込みは要確認`, tone: 'warn' };
    case 'none':
      return { text: 'ライセンス未設定 · 利用条件が不明', tone: 'danger' };
    default:
      return { text: spdx ?? 'ライセンス不明', tone: 'warn' };
  }
}

/**
 * 言語の色。一覧の左端に並ぶので、目線の縦のガイドになる。
 * GitHub の linguist に合わせてあるが、無い言語は灰色に落として構わない
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Zig: '#EC915C',
  Shell: '#89E051',
  HTML: '#E34C26',
  CSS: '#663399',
  Vue: '#41B883',
  Svelte: '#FF3E00',
  Dart: '#00B4AB',
  Lua: '#000080',
  Elixir: '#6E4A7E',
  Haskell: '#5E5086',
  Scala: '#C22D40',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
};

export function languageColor(language: string | null): string {
  if (!language) return '#8A857D';
  return LANGUAGE_COLORS[language] ?? '#8A857D';
}

/** カテゴリの日本語表示（SPEC §6.3） */
export const CATEGORY_LABELS: Record<string, string> = {
  'ai-agent': 'AIエージェント',
  llm: 'LLM',
  'dev-tool': '開発ツール',
  infra: 'インフラ',
  'web-frontend': 'フロントエンド',
  backend: 'バックエンド',
  data: 'データ',
  security: 'セキュリティ',
  mobile: 'モバイル',
  game: 'ゲーム',
  learning: '学習・教材',
  other: 'そのほか',
};

export function categoryLabel(category: string | null): string {
  if (!category) return 'そのほか';
  return CATEGORY_LABELS[category] ?? 'そのほか';
}

/** 個別ページの URL。owner / name はそのまま使う（GitHub 側で使える文字しか来ない） */
export function repoUrl(id: string): string {
  return `/repo/${id}/`;
}

export function githubUrl(id: string): string {
  return `https://github.com/${id}`;
}
