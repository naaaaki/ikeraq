---
name: phase0-review-log
description: Wakuru Phase 0（commit 974f8c4 / 50c4499）のレビューで出した指摘と、その未解決状況。次回は「直ったか」から確認する
metadata:
  type: project
---

2026-08-28、Phase 0 データ収集パイプライン（`974f8c4` + `50c4499`）を初回レビューした。
次回レビュー時は、まず以下が直っているかを確認してから新しい指摘を探すこと。

**Why:** 開発者2名・main一本・PRなしの体制で、このレビューが唯一のチェック機構。
指摘が反映されないまま次のフェーズに進むと、Phase 0 の唯一の成果物である
スナップショット履歴（後から遡って取得できない）が壊れたまま蓄積される。

**How to apply:** 次回は `git log 50c4499..HEAD` の差分を見て、下記の状態を更新する。
直っていれば記録から消す。「これでいい」と判断された項目は理由つきで残し、蒸し返さない。

## 🔴 未解決（2026-08-28 時点）
1. `scripts/lib/github.ts` `request()` が全レスポンスを `JSON.parse` するため、
   raw README（Markdown）で必ず例外 → 全リポジトリの更新が skip される
2. seed で追跡枠1,000件が即満杯 → `collect.ts` が新規リポジトリを永久に追加できない（eviction なし）
3. レート制限カウンタが search枠(30/分) と core枠(5,000/時) を共有 → 検索後に毎回リセット待ち
   → daily.yml の `timeout-minutes: 30` で無通知のまま kill される可能性
4. スナップショットに未取得リポジトリの古い stars をそのまま記録し、
   stagnant_days / snapshot_days も加算している（最重要資産の汚染）

## 判断保留・確認できなかったこと
- GitHub API の実挙動（Accept: raw の戻り値、search のレート制限ヘッダ、
  contributors の 403）はトークンが無いため**未検証**。指摘は静的解析ベース。

## 既に修正済み
- `@types/node` のキャレット指定 → `50c4499` でピン留め済み（レビュー中に対応された）
