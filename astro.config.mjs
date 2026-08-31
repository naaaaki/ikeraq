// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Ikeraq サイト本体（SPEC §12）
 *
 * - 静的出力のみ。サーバーを持たない（Cloudflare Pages に置く前提）
 * - 独自ドメインは未確定なので、環境変数で差し替えられるようにしてある
 */
const site = process.env.IKERAQ_SITE_URL ?? 'https://ikeraq.com';

const OUT_DIR = fileURLToPath(new URL('./dist/', import.meta.url));

/**
 * sitemap に載せるかどうかを、出来上がった HTML そのものから決める。
 *
 * ★ noindex にしたページを sitemap に載せると、
 *   「載せるな」と「見に来い」を同時に出すことになる。
 *
 * ★ 判定を2か所に書かない。
 *   以前はデータを読み直して個別ページだけ除いていたが、
 *   殿堂入りのように「中身が0件なら noindex」というページを取りこぼした。
 *   出力を見れば、どのページが noindex かは1つの規則で決まり、
 *   ページを足しても直す必要がない。
 */
function isIndexable(pageUrl) {
  const pathname = new URL(pageUrl).pathname;
  const file = pathname.endsWith('/')
    ? path.join(OUT_DIR, pathname, 'index.html')
    : path.join(OUT_DIR, pathname);

  // 読めないものは載せない。載せて 404 を渡すより、載せそこねるほうが害が小さい
  if (!existsSync(file)) return false;
  try {
    const html = readFileSync(file, 'utf8');
    return !/<meta\s+name="robots"[^>]*noindex/i.test(html);
  } catch {
    return false;
  }
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: isIndexable })],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light', wrap: true },
  },
  devToolbar: { enabled: false },
});
