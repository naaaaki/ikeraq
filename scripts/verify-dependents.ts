/**
 * dependents_count が API で取得できるかの検証（SPEC §7.5・Phase 0 のタスク）
 *
 * GitHub の Dependency graph（"Used by" の数値）は REST / GraphQL では
 * 公式に提供されていない可能性が高い（Web UI のみ）。
 * 偽スター判定の1シグナルがこれに依存しているため、Phase 0 のうちに結論を出す。
 *
 *   取得できる   → no_dependents フラグとして使用する
 *   取得できない → 代替シグナルの合成で「実利用の欠如」を判定する（§7.5）
 *
 * ★ スクレイピングで "Used by" を取りに行くことは推奨しない（SPEC §7.5）。
 *   このスクリプトも公式経路だけを試す。
 */

import { GitHubClient } from './lib/github.js';

/** 検証対象。dependents が多いことが分かっている著名リポジトリを使う */
const SAMPLES = ['facebook/react', 'expressjs/express', 'pallets/flask'];

interface Attempt {
  name: string;
  ok: boolean;
  detail: string;
}

async function main() {
  const client = new GitHubClient({ token: process.env.GITHUB_TOKEN ?? '' });
  const attempts: Attempt[] = [];

  for (const id of SAMPLES) {
    const [owner, name] = id.split('/');

    // 試行1: REST の SBOM エンドポイント（依存"している"側。dependents ではない）
    attempts.push(await tryEndpoint(client, `SBOM (${id})`, `/repos/${owner}/${name}/dependency-graph/sbom`));

    // 試行2: dependents を返す公式エンドポイントが存在するかの確認
    attempts.push(await tryEndpoint(client, `dependents (${id})`, `/repos/${owner}/${name}/dependents`));

    // 試行3: 代替シグナルが取れることの確認（§7.5）
    const releases = await client.getReleasesCount(owner, name);
    const contributors = await client.getContributorsCount(owner, name);
    attempts.push({
      name: `代替シグナル (${id})`,
      ok: releases !== null && contributors !== null,
      detail: `releases_count=${releases} / contributors_count=${contributors}`,
    });
  }

  console.log('\n===== 検証結果 (SPEC §7.5) =====');
  for (const a of attempts) {
    console.log(`${a.ok ? '✅' : '❌'} ${a.name}: ${a.detail}`);
  }

  const dependentsOk = attempts.some((a) => a.name.startsWith('dependents') && a.ok);
  console.log('\n----- 結論 -----');
  if (dependentsOk) {
    console.log('dependents_count は API から取得できる。no_dependents フラグとして使用する');
  } else {
    console.log(
      'dependents_count は API から取得できない。\n' +
        'SPEC §7.5 のとおり、以下の代替シグナルの合成で「実利用の欠如」を判定すること:\n' +
        '  - releases_count == 0\n' +
        '  - contributors_count <= 1\n' +
        '  - open_issues == 0 かつスター数が多い\n' +
        '  - fork 数がスター数に対して極端に少ない\n' +
        '※ スクレイピングで "Used by" を取りに行かないこと'
    );
  }
  console.log(`\nAPI リクエスト: ${client.requestCount} 回 / 残り ${client.remaining}`);
}

async function tryEndpoint(client: GitHubClient, name: string, path: string): Promise<Attempt> {
  try {
    const res = await client.request(path);
    if (res === null) return { name, ok: false, detail: '404 Not Found（エンドポイントなし）' };
    const keys = res.body && typeof res.body === 'object' ? Object.keys(res.body).join(', ') : typeof res.body;
    return { name, ok: true, detail: `${res.status} — keys: ${keys}` };
  } catch (e) {
    return { name, ok: false, detail: String((e as Error).message).slice(0, 160) };
  }
}

main().catch((e) => {
  console.error('[verify-dependents] 失敗', e);
  process.exit(1);
});
