// @ts-check
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Wakuru サイト本体（SPEC §12）
 *
 * - 静的出力のみ。サーバーを持たない（Cloudflare Pages に置く前提）
 * - 独自ドメインは未確定なので、環境変数で差し替えられるようにしてある
 */
const site = process.env.WAKURU_SITE_URL ?? 'https://wakuru.dev';

/**
 * sitemap に載せない個別ページを集める。
 *
 * ★ noindex にしたページを sitemap に載せると「載せるな」と「載せろ」を同時に出すことになる。
 *   判定そのものは evaluate.ts が済ませてあるので、ここでは結果を読むだけ。
 */
function noindexRepoPaths() {
  const reposDir = path.resolve('data/repos');
  if (!existsSync(reposDir)) return new Set();
  const out = new Set();
  for (const owner of readdirSync(reposDir, { withFileTypes: true })) {
    if (!owner.isDirectory()) continue;
    const dir = path.join(reposDir, owner.name);
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      try {
        const repo = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
        if (!repo.is_indexable) out.add(`/repo/${repo.id}/`);
      } catch {
        // 壊れたファイルで全体を止めない。載せそこねるだけで済ませる
      }
    }
  }
  return out;
}

const excluded = noindexRepoPaths();

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !pathname.startsWith('/404') && !excluded.has(pathname);
      },
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light', wrap: true },
  },
  devToolbar: { enabled: false },
});
