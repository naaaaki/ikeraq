/**
 * 結果の監視（SPEC §17.2「結果の監視」）
 *
 * 「処理の失敗」を検知するだけでは不十分。エラーを出さずに静かに止まるケースがあるため、
 * 結果そのもの（データの鮮度・件数）を見る。
 *
 * ★ 日次パイプラインとは別ワークフローで動かすこと。
 *   パイプライン自体が動かなくなった場合、その中に監視を置いても発火しない。
 *
 * 監視項目:
 *   | データの鮮度 | 最新スナップショットが2日以上前   | ⛔ 即通知 |
 *   | 取得件数     | 前日比で50%以上減少              | ⚠ 通知   |
 *   | 新規検知数   | 3日連続で0件                     | ⚠ 通知   |
 *   | ビルド時間   | 10分超過（SPEC §9.5）            | ⚠ 通知   |
 */

import { notify } from './lib/notify.js';
import { daysBetween, todayJST } from './lib/date.js';
import { listSnapshotDates, loadSnapshot } from './lib/storage.js';

/** 鮮度の閾値。これ以上古ければ「静かに止まっている」と見なす */
const STALE_DAYS = 2;
/** 取得件数の急減と見なす比率 */
const COUNT_DROP_RATIO = 0.5;
/** 新規検知0件が続いてよい日数 */
const ZERO_NEW_STREAK = 3;
/** ビルド時間の警告閾値（分）。Cloudflare Pages は20分でタイムアウトする */
const BUILD_MINUTES_LIMIT = 10;

interface Issue {
  level: 'warn' | 'error';
  message: string;
}

async function main() {
  const today = todayJST();
  const issues: Issue[] = [];
  const dates = await listSnapshotDates();

  // ------------------------------------------------------------------
  // 1. データの鮮度 ★最も重要
  //    処理の成否ではなく結果を見るため、想定していない壊れ方も拾える
  // ------------------------------------------------------------------
  if (dates.length === 0) {
    issues.push({ level: 'error', message: 'スナップショットが1件もありません' });
  } else {
    const latest = dates.at(-1)!;
    const age = daysBetween(today, latest);
    console.log(`[monitor] 最新スナップショット: ${latest}（${age}日前）`);
    if (age >= STALE_DAYS) {
      issues.push({
        level: 'error',
        message: `データが ${age} 日前で止まっています（最新: ${latest}）。日次パイプラインを確認してください`,
      });
    }
  }

  // ------------------------------------------------------------------
  // 2. 取得件数の急減
  // ------------------------------------------------------------------
  const recent = dates.slice(-2);
  if (recent.length === 2) {
    const [prev, curr] = await Promise.all(recent.map(loadSnapshot));
    if (prev && curr) {
      const before = prev.stats.entry_count;
      const after = curr.stats.entry_count;
      console.log(`[monitor] 件数: ${prev.date}=${before} → ${curr.date}=${after}`);
      if (before > 0 && after < before * COUNT_DROP_RATIO) {
        issues.push({
          level: 'warn',
          message: `取得件数が急減しています（${before} → ${after} 件）`,
        });
      }
      if (curr.stats.skipped_count > curr.stats.fetched_count) {
        issues.push({
          level: 'warn',
          message: `スキップ件数が取得件数を上回っています（取得 ${curr.stats.fetched_count} / スキップ ${curr.stats.skipped_count}）`,
        });
      }
      if (!curr.stats.trending_ok) {
        issues.push({
          level: 'warn',
          message: 'Trending の取得に失敗しています。HTML 構造が変わった可能性があります（SPEC §10.3）',
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // 3. 新規検知数が3日連続で0件
  // ------------------------------------------------------------------
  const lastN = dates.slice(-ZERO_NEW_STREAK);
  if (lastN.length === ZERO_NEW_STREAK) {
    const snapshots = await Promise.all(lastN.map(loadSnapshot));
    if (snapshots.every((s) => s !== null && s.stats.new_count === 0)) {
      issues.push({
        level: 'warn',
        message: `新規検知が ${ZERO_NEW_STREAK} 日連続で0件です。検索クエリか追跡上限を確認してください`,
      });
    }
  }

  // ------------------------------------------------------------------
  // 4. ビルド（＝収集）時間（SPEC §9.5）
  // ------------------------------------------------------------------
  const latestSnapshot = dates.length ? await loadSnapshot(dates.at(-1)!) : null;
  if (latestSnapshot && latestSnapshot.stats.duration_sec > BUILD_MINUTES_LIMIT * 60) {
    issues.push({
      level: 'warn',
      message: `処理時間が ${Math.round(latestSnapshot.stats.duration_sec / 60)} 分に達しています（閾値 ${BUILD_MINUTES_LIMIT} 分）`,
    });
  }

  // ------------------------------------------------------------------
  // 通知
  // ------------------------------------------------------------------
  if (issues.length === 0) {
    console.log('[monitor] 異常なし');
    return;
  }

  const level = issues.some((i) => i.level === 'error') ? 'error' : 'warn';
  await notify(
    level,
    'データ監視で異常を検知',
    issues.map((i) => `${i.level === 'error' ? '⛔' : '⚠'} ${i.message}`)
  );

  // error の場合は Actions も失敗させ、GitHub 側の通知にも乗せる
  if (level === 'error') process.exit(1);
}

main().catch(async (e) => {
  console.error('[monitor] 監視自体が失敗しました', e);
  await notify('error', '監視ワークフローが失敗', [String(e?.message ?? e).slice(0, 1500)]);
  process.exit(1);
});
