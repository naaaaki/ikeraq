/**
 * RSS（SPEC §5）
 *
 * ★ 流すのは紹介文を書いたものだけ。追跡している全件を流すと、
 *   購読者にとってはただのスター数の羅列になり、読む価値が無くなる。
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSiteData } from '../lib/content.js';
import { repoUrl } from '../lib/format.js';
import { plainText, splitSections } from '../lib/note.js';

export async function GET(context: APIContext) {
  const site = await getSiteData();

  const items = site.repos
    .filter((v) => v.note !== null)
    // 新しい記事が上。更新日が無いものは最後に回す
    .sort((a, b) => (b.note!.updated ?? '').localeCompare(a.note!.updated ?? ''))
    .map((v) => {
      const { sections } = splitSections(v.note!.body);
      const lead = sections.get('見出しの一文');
      return {
        title: v.repo.id,
        // 見出しの一文が記事の要。無ければ英語の原文で代える（訳さない・SPEC §9.1）
        description: lead ? plainText(lead) : (v.repo.description_en ?? ''),
        link: repoUrl(v.repo.id),
        pubDate: v.note!.updated ? new Date(`${v.note!.updated}T00:00:00+09:00`) : undefined,
      };
    });

  return rss({
    title: 'Ikeraq',
    description: 'GitHub で注目されているリポジトリを、日本語で紹介しています。',
    site: context.site!,
    items,
    customData: '<language>ja</language>',
  });
}
