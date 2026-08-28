# Wakuru（ワクル）

> 新しい技術が、わかる。

GitHub で注目されているリポジトリを、日本語で紹介するサイト。

**読む順番：** [`CLAUDE.md`](CLAUDE.md)（守ることと日々の流れ）→ [`docs/DECISIONS.md`](docs/DECISIONS.md)（決定事項・**仕様書より優先**）→ [`docs/SPEC.md`](docs/SPEC.md)（v0.6・履歴として残す）

---

## いまの状況

| | 状態 |
|---|---|
| データ収集の仕組み | 完成。**GitHub トークン待ちで未稼働** |
| 機械判定（警告・スコア・分類） | 完成 |
| 記事作成の仕組み | 完成（`npm run note`） |
| デザイン | モック（`design/`） |
| サイト本体（Astro） | **未着手** |

**次にやること：** GitHub リポジトリを作り、Secrets を登録する。
収集が1日遅れるごとに、スター履歴が1日ぶん永久に欠ける。

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
# 記事を書く（週3本が目標・D-005）
npm run note                 候補を見る
npm run note -- owner/name   下書きを作る
npm run note -- --check      下書きの抜けを確認

# データ
npm run seed                 初回だけ。追跡対象の初期シードを作る（SPEC §10.4）
npm run collect              日次収集。スナップショットを1日1ファイル保存する
npm run collect -- --dry-run --limit=20    保存せずに動作確認
npm run evaluate             機械判定。外部APIを呼ばないので何度でも流し直せる
npm run monitor              データの鮮度・件数を監視（SPEC §17.2）
npm run stats                実測レポート

npm test                     単体テスト
npm run typecheck            型チェック
```

### 立ち上げ手順

1. `npm run seed` を1回実行する（追跡対象が最大700件できる）
2. `npm run collect` を毎日動かす（GitHub Actions が自動でやる）
3. 7〜14日ほど貯めてから `npm run stats` で実測値を確認する

---

## ディレクトリ

```
scripts/
  seed.ts               初期シード（1回だけ）
  collect.ts            日次収集パイプライン（SPEC §11）
  evaluate.ts           機械判定。ネットワーク不要で何度でも流し直せる
  monitor.ts            結果の監視（SPEC §17.2）
  note.ts               記事の下書き作成と抜けの確認
  stats.ts              実測レポート
  lib/
    github.ts           APIクライアント（レート制限・同時実行数制限）
    storage.ts          データの読み書き
    repository.ts       Repository レコードの生成
    notes.ts            日本語の紹介文の読み込み
    draft.ts            記事の下書きの雛形
    check-note.ts       下書きの抜けの確認
    license.ts          ライセンス区分の判定
    readme.ts           README 抜粋（最大500字）
    trending.ts         Trending の取得（失敗許容）
    flags.ts            警告フラグの判定（SPEC §7.1）
    score.ts            スコアと公開判定（SPEC §2.4 / §2.5 / §7.4）
    thresholds.ts       ★判定に使う閾値。docs/criteria.md と対
    categorize.ts       ルールベース分類（SPEC §6.3）
    tier.ts             追跡対象の3層管理
    date.ts             JST の日付処理
    notify.ts           Discord 通知
data/
  repos/{owner}/{name}.json   ★1リポジトリ1ファイル（機械が書く）
  snapshots/YYYY-MM-DD.json   ★1日1ファイル・最重要資産
  notes/{owner}/{name}.md     ★日本語の紹介文（人が書く）
design/                       デザインのモック（.dc.html）
docs/
  DECISIONS.md          ★決定事項。仕様書より優先する
  SPEC.md               仕様書 v0.6（履歴）
  criteria.md           判定基準の全公開の原稿
  article-template.md   記事の書き方
  structure-proposal.html  サイト構成案
src/
  types.ts              データモデル（SPEC §6）。scripts と Astro で共有する
```

---

## 実装上の約束（守らないと壊れる）

**変更する前に `docs/DECISIONS.md` を読むこと。**

- **日次パイプラインで LLM を呼ばない**（SPEC §9.1）。ランニングコストをドメイン代のみに保つ
  - 記事を書くときに Naoki が Claude Code を使うのは別（D-002）
- **`Promise.all` で全件を並列リクエストしない**（SPEC §10.2）。`mapLimited` を使う
- **データは1リポジトリ1ファイルに分割する**（SPEC §9.4）
- **Search API は1クエリ1,000件が上限**。stars でレンジ分割する（SPEC §10.4）
- **依存パッケージのバージョンを固定し、lockfile をコミットする**
- **追跡対象を減らさない**。追跡をやめた期間のスター履歴は永久に欠損する（SPEC §10.4）
  - シードは 700 件まで。上限 1,000 件を埋め切ると、翌日から新規トレンドを1件も追跡できなくなる
  - 押し出せるのは「休眠層かつ90日以上停滞」のものだけ。押し出しは必ずログに残る
- **見ていない日をスナップショットに書かない**。3層構造により毎日は取得しないため、
  記録するのはその日に実際に取得したものだけ
- **README を全文転載しない**。抜粋は最大500字（SPEC §8.2）
- **閾値を変えたら `docs/criteria.md` も直す**。基準を公開していることが信頼の源泉
- **警告は「疑い」までしか言わない**。断定表現は名誉毀損リスクを生む

---

## 廃止したもの

| 対象 | 経緯 |
|---|---|
| 偽スター判定 | D-004 で機能ごと廃止。コードはコミット `85e1931` に残っている |
| `/flagged`（警告つき一覧） | D-004 |
| `dependents_count` と取得検証スクリプト | D-004。偽スター判定専用だった |
| 特集（`/collections/`） | D-007。素材がたまるまで設計しない |
| AI画像生成による図 | D-008。SVG で作る |

---

## これから

- **Astro のセットアップとページ生成**
- ステマ表記・プライバシーポリシー・自動判定の免責（SPEC §8）
- Article + BreadcrumbList 構造化データ
- `/hall-of-fame`（殿堂入り）と `/japanese`（日本語README あり）
- Cloudflare Pages へのデプロイ
