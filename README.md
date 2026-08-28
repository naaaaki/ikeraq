# Wakuru（ワクル）

> 新しい技術が、わかる。

GitHubでトレンド入りしたリポジトリを、日本語で紹介するサイト。
仕様は [`docs/SPEC.md`](docs/SPEC.md)（v0.6）。

**いまは Phase 0（助走期間）です。サイトはまだ作りません。データ収集だけを動かします。**

---

## Phase 0 でやること

| 目的 | 理由 |
|---|---|
| 日次スナップショットの蓄積を最速で始める | **この履歴は後から遡って取得できない**（SPEC §6.2） |
| 公開時点で7日以上のスター履歴を確保する | 偽スター判定（`star_spike`）が7日平均を必要とするため（SPEC §7.3） |
| `dependents_count` の取得可否を検証する | 取得できない場合は代替シグナルに切り替える（SPEC §7.5） |
| 日次の新規エントリー数を実測する | 仕様の「10〜15件」は推定値（SPEC §4.1） |

---

## セットアップ

```bash
npm ci
cp .env.example .env    # GITHUB_TOKEN と DISCORD_WEBHOOK_URL を記入
```

`GITHUB_TOKEN` は Personal Access Token（PAT）。認証すると 5,000 req/時になる（SPEC §10.1）。
public リポジトリしか読まないので、追加スコープは不要。

GitHub Actions で動かす場合は、リポジトリ Secrets に以下を登録する。

| Secret | 用途 |
|---|---|
| `WAKURU_GITHUB_PAT` | GitHub API の認証 |
| `DISCORD_WEBHOOK_URL` | 失敗・異常の通知（SPEC §17.2） |

---

## コマンド

```bash
npm run seed              # 初回だけ。追跡対象の初期シードを作る（SPEC §10.4）
npm run collect           # 日次収集。スナップショットを1日1ファイル保存する
npm run collect -- --dry-run --limit=20   # 保存せずに動作確認
npm run monitor           # データの鮮度・件数を監視（SPEC §17.2）
npm run stats             # Phase 0 の実測レポート
npm run verify:dependents # dependents_count の取得可否を検証（SPEC §7.5）

npm test                  # 単体テスト
npm run typecheck         # 型チェック
```

### 立ち上げ手順

1. `npm run verify:dependents` を1回実行し、結果を SPEC §15 の TBD に反映する
2. `npm run seed` を1回実行する（追跡対象が最大700件できる）
3. `npm run collect` を毎日動かす（GitHub Actions が自動でやる）
4. 7〜14日ほど貯めてから `npm run stats` で実測値を確認し、Phase 1 に進む

---

## ディレクトリ

```
scripts/
  seed.ts               初期シード（1回だけ）
  collect.ts            日次収集パイプライン（SPEC §11）
  monitor.ts            結果の監視（SPEC §17.2）
  stats.ts              Phase 0 の実測レポート
  verify-dependents.ts  dependents_count の取得可否検証（SPEC §7.5）
  lib/
    github.ts           APIクライアント（レート制限・同時実行数制限）
    storage.ts          データの読み書き
    repository.ts       Repository レコードの生成
    license.ts          ライセンス区分の判定
    readme.ts           README 抜粋（最大500字）
    trending.ts         Trending の取得（失敗許容）
    tier.ts             追跡対象の3層管理
    date.ts             JST の日付処理
    notify.ts           Discord 通知
data/
  repos/{owner}/{name}.json   ★1リポジトリ1ファイル
  snapshots/YYYY-MM-DD.json   ★1日1ファイル・最重要資産
src/
  types.ts              データモデル（SPEC §6）。scripts と Astro で共有する
```

---

## 実装上の約束（守らないと壊れる）

仕様書 §16 で明示されているもの。**変更する前に SPEC を読むこと。**

- **LLM / 外部AI APIを使わない**（SPEC §9.1）。要約生成のコードを書かない
- **`Promise.all` で全件を並列リクエストしない**（SPEC §10.2）。`mapLimited` を使う
- **データは1リポジトリ1ファイルに分割する**（SPEC §9.4）
- **Search API は1クエリ1,000件が上限**。stars でレンジ分割する（SPEC §10.4）
- **依存パッケージのバージョンを固定し、lockfile をコミットする**
- **追跡対象を減らさない**。追跡をやめた期間のスター履歴は永久に欠損する（SPEC §10.4）
  - シードは 700 件まで（`SEED_LIMIT`）。上限 1,000 件を埋め切ると、翌日から新規トレンドを1件も追跡できなくなる
  - 枠が足りないときに押し出せるのは「休眠層かつ90日以上停滞」のものだけ。押し出しは必ずログに残る
- **見ていない日をスナップショットに書かない**。3層構造により毎日は取得しないため、
  記録するのはその日に実際に取得したものだけ。「動かなかった日」と「見ていない日」の混同は
  偽スター判定の土台を壊し、後から直せない
- **README を全文転載しない**。抜粋は最大500字（SPEC §8.2）

---

## 次のフェーズ

Phase 1 で以下を実装する（SPEC §13）。**Phase 0 のデータが7日以上貯まってから着手する。**

- `scripts/evaluate.ts` — 機械判定（フラグ・ライセンス区分・`usability_score`）
- `scripts/lib/flags.ts` — 警告フラグ判定（SPEC §7.1）
- `scripts/lib/categorize.ts` — ルールベース分類（SPEC §6.3）
- 偽スター疑い判定 ★差別化の核（SPEC §7.2）
- Astro でのページ生成 / `/flagged` / `/about/criteria`
- ステマ表記・プライバシーポリシー・自動判定の免責（SPEC §8）
