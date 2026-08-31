/**
 * Phase 0 の実測レポート（SPEC §13 Phase 0「日次の新規エントリー数を実測」）
 *
 * 仕様では日次の新規は10〜15件と"推定"されている。ここを実測で置き換える。
 * 併せて、モチベーションの支えになる進捗指標（SPEC §17.3）も出す。
 */

import { listSnapshotDates, loadAllRepos, loadSnapshot } from './lib/storage.js';

async function main() {
  const dates = await listSnapshotDates();
  if (dates.length === 0) {
    console.log('スナップショットがまだありません。`npm run collect` を実行してください');
    return;
  }

  const snapshots = (await Promise.all(dates.map(loadSnapshot))).filter((s) => s !== null);
  const repos = await loadAllRepos();

  console.log('===== Ikeraq Phase 0 実測レポート =====\n');
  console.log(`スナップショット蓄積日数 : ${snapshots.length} 日（${dates[0]} 〜 ${dates.at(-1)}）`);
  console.log(`追跡対象                 : ${repos.length} 件`);

  const newCounts = snapshots.map((s) => s.stats.new_count);
  const avg = newCounts.reduce((a, b) => a + b, 0) / newCounts.length;
  console.log(`\n--- 日次の新規エントリー数（SPEC §4.1 の推定値 10〜15 件の検証） ---`);
  console.log(`平均 ${avg.toFixed(1)} 件 / 最小 ${Math.min(...newCounts)} 件 / 最大 ${Math.max(...newCounts)} 件`);

  console.log(`\n--- 直近の推移 ---`);
  for (const s of snapshots.slice(-14)) {
    console.log(
      `${s.date}  件数 ${String(s.stats.entry_count).padStart(4)} / 新規 ${String(s.stats.new_count).padStart(3)} / ` +
        `取得 ${String(s.stats.fetched_count).padStart(4)} / スキップ ${String(s.stats.skipped_count).padStart(3)} / ` +
        `${s.stats.duration_sec}秒 / Trending ${s.stats.trending_ok ? 'OK' : 'NG'}`
    );
  }

  const tiers = { hot: 0, normal: 0, dormant: 0 };
  for (const r of repos) tiers[r.tracking_tier]++;
  console.log(`\n--- 追跡層の内訳（SPEC §10.4） ---`);
  console.log(`hot ${tiers.hot} 件 / normal ${tiers.normal} 件 / dormant ${tiers.dormant} 件`);

  const ready = repos.filter((r) => r.snapshot_days >= 7).length;
  console.log(`\n--- コールドスタート対策の進捗（SPEC §7.3） ---`);
  console.log(`7日以上の履歴があるリポジトリ: ${ready} / ${repos.length} 件`);
  console.log(ready > 0 ? '→ star_spike の判定が可能になっています' : '→ まだ助走期間です。収集を続けてください');
}

main().catch((e) => {
  console.error('[stats] 失敗', e);
  process.exit(1);
});
