---
updated: 2026-10-05
image:
image_alt:
---

<!-- ============================================================
  t8y2/dbx
  https://github.com/t8y2/dbx
  25 MB lightweight cross-platform database client for 100+ databases, including MySQL, PostgreSQL, SQLite, Redis, MongoDB, DuckDB, SQL Server, and Dameng. Built-in AI, MCP Server, CLI, desktop and Docker. | 轻量级跨平台数据库管理工具，支持 MySQL、PostgreSQL、SQLite、Redis、MongoDB、达梦等 100+ 数据库，提供桌面端、Docker、CLI、内置 AI 助手和 MCP。
  Rust / Apache-2.0 / スター 24,366
  topics: ai, cli, clickhouse, database, database-client, database-management, docker, gui, mcp, mongodb, mysql, postgresql, redis, rust, sql-server, sqlite, tauri, vue

============================================================ -->


## 見出しの一文

100種類以上のデータベースを、25MB ほどのアプリから扱う


## どういうものか

MySQL、PostgreSQL、SQLite、Redis、MongoDB などを1つの画面で扱うデータベースクライアントだ。DBeaver と同じ部類の道具だが、Java も同梱の Chromium も要らない、約25MB のアプリであることを売りにしている。ただし一部のデータベースは、本体とは別のドライバーや Java の実行環境が必要で、接続するときに導入を案内される。Tauri 2（Rust）と Vue 3 で作られ、デスクトップ版のほかに、Docker で立てるウェブ版と、端末から使う CLI がある。

中身は、補完つきの SQL エディタ、大量の結果を扱える表、テーブル構造の編集、ER 図、構造の差分比較、実行計画の図示など。Redis と MongoDB には専用の画面があり、Kafka や RabbitMQ といったメッセージキューの管理画面まで入っている。接続設定は DBeaver や Navicat から取り込める。

AI の使い方は大きく2つある。1つは組み込みのアシスタントで、やりたいことを言葉で書くと SQL を返し、SQL の説明や改善、エラーの修正もする。モデルは Claude、OpenAI のほか、Ollama などで手元に置いたモデルや、OpenAI 互換の窓口も選べる。もう1つは別配布の MCP サーバーで、Claude Code や Cursor などのエージェントが、DBX に登録した接続を使ってテーブルを見たり SQL を実行したりできる。エージェントに渡す権限は「読み取りのみ」「データの読み書き」「すべて」から選び、使わせる接続も絞れる。端末から使う CLI にも、AI エージェント向けの使い方の説明（Agent Skill）が付いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「1つの接続先リストを、人もエージェントも使う」とある図。左に「あなた（デスクトップ・ウェブ版）」と「AI エージェント（MCP サーバー）」があり、どちらも矢印で「DBX（接続と権限をまとめて管理）」につながり、そこから「データベース（MySQL・Redis など100以上）」へ矢印が伸びる。下に「MCP サーバーには「読み取りのみ」「データの読み書き」「すべて」から権限を選んで渡す」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="dbx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">1つの<tspan fill="#1E5A48">接続先リスト</tspan>を、人もエージェントも使う</text>

  <rect x="40" y="120" width="200" height="90" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">あなた</text>
  <text x="140" y="186" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（デスクトップ・ウェブ版）</text>

  <rect x="40" y="240" width="200" height="90" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="280" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="140" y="306" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（MCP サーバー）</text>

  <line x1="246" y1="165" x2="294" y2="205" stroke="#1E5A48" stroke-width="4" marker-end="url(#dbx-arrow)" />
  <line x1="246" y1="285" x2="294" y2="245" stroke="#1E5A48" stroke-width="4" marker-end="url(#dbx-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">DBX</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（接続と権限をまとめて管理）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#dbx-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">データベース</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（MySQL・Redis など100以上）</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">MCP サーバーには「読み取りのみ」「データの読み書き」「すべて」から権限を選んで渡す</text>
</svg>

キャプション: 人が画面で使う接続を、そのままエージェントにも使わせる。どこまで触らせるかは DBX の側で決める。


## どんなときに使うか

### 仕事で触るデータベースの種類が多く、道具をいくつも切り替えているとき

リレーショナルデータベースも Redis も MongoDB も、同じアプリの中で開ける。

### AI エージェントに本物のデータベースを見せたいが、書き換えられたくないとき

MCP サーバーの権限を「読み取りのみ」にし、使わせる接続を絞ってから渡せる。


## 注意点

**100以上のすべてが、入れてすぐ使えるわけではない。** 一部のデータベースは本体とは別のドライバーで動き、JDBC で接続するものは Java の実行環境も要る。接続するときに導入を案内されるが、自動で入るかどうかはネットワークや環境による。使いたいデータベースがどちらかは、公式ドキュメントの Driver Management で確かめたい。

**MCP サーバーは本体と別配布。** デスクトップ版を入れただけでは入らず、別に設定が要る。
