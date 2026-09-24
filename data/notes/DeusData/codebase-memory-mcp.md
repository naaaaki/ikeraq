---
updated: 2026-09-24
image:
image_alt:
---

<!-- ============================================================
  DeusData/codebase-memory-mcp
  https://github.com/DeusData/codebase-memory-mcp
  High-performance code intelligence MCP server. Indexes codebases into a persistent knowledge graph — average repo in milliseconds. 158 languages, sub-ms queries, 99% fewer tokens. Single static binary, zero dependencies.
  C / MIT / スター 44,547
  topics: aider, ast, claude-code, code-analysis, code-intelligence, codex, cursor, cypher, developer-tools, gemini-cli, graph-visualization, kilocode, knowledge-graph, mcp, mcp-server, model-context-protocol, opencode, sqlite, tree-sitter, windsurf

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

コードを先に関係図にしておき、AIが何十回も読みに行く手間を省く


## どういうものか

手元のリポジトリを解析して、**関数・クラス・呼び出し関係・HTTP のルート**などをつないだ「知識グラフ」を作り、AI コーディングエージェントに MCP 経由で引かせるサーバーだ。エージェントが grep とファイル読み込みを何十回も繰り返す代わりに、「この関数を呼んでいるのはどこか」を1回の問い合わせで答えられるようにする。C で書かれた単体の実行ファイルとして配られ、言語の実行環境や API キー、外部のサービスは要らない。処理はすべて手元で行われ、コードは外に出ないと README は書いている。

解析には tree-sitter を使い、150 を超える言語の文法を実行ファイルに組み込んでいる。Python・TypeScript・Go・Java・Rust など一部の言語では、型を手がかりに呼び出し先をより正確に解決する仕組みも重ねている。できたグラフは SQLite に保存され、ファイルの変更を見張って自動で作り直す。MCP のツールは 17 個で、呼び出し経路のたどり込み、Cypher に似た書き方での問い合わせ、呼ばれていない関数の検出、git の差分がどの関数に響くかの洗い出しなどがある。グラフをブラウザで立体的に眺める画面も同梱されている。

このツール自体は **LLM を持っていない**。質問を解釈してどのツールを呼ぶかを決めるのは、つないだエージェント側だ。README はその理由を、別の API キーや費用、設定するモデルを増やさないためだと説明している。README の計測では、構造についての問い合わせ5回で、ファイルを1つずつ grep して調べる方法が約41万トークン、このツールが約3,400トークンだった（同じ数字を再現するには元の入力と生データが要る、とも書かれている）。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="コードを先にグラフにして、AIは問い合わせるだけ。コード（手元のリポジトリ）。解析（tree-sitterで構文を読む）。知識グラフ（関数・呼び出し・ルート）。AIエージェント（MCPで問い合わせる）。このツール自体はLLMを持たず、質問の解釈はエージェントが受け持つ" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cbmm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">コードを先に<tspan fill="#1E5A48">グラフにして</tspan>、AIは問い合わせるだけ</text>

  <rect x="24" y="180" width="150" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="99" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">コード</text>
  <text x="99" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（手元のリポジトリ）</text>

  <line x1="178" y1="228" x2="206" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#cbmm-arrow)" />

  <rect x="210" y="180" width="170" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="295" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">解析</text>
  <text x="295" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（tree-sitterで構文を読む）</text>

  <line x1="384" y1="228" x2="412" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#cbmm-arrow)" />

  <rect x="416" y="180" width="170" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="501" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">知識グラフ</text>
  <text x="501" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（関数・呼び出し・ルート）</text>

  <line x1="620" y1="228" x2="592" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#cbmm-arrow)" />

  <rect x="624" y="180" width="160" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="704" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">AIエージェント</text>
  <text x="704" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（MCPで問い合わせる）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">このツール自体はLLMを持たず、質問の解釈はエージェントが受け持つ</text>
</svg>

キャプション: 解析は先に済ませておき（ファイルが変われば自動で作り直す）、あとはグラフに問い合わせる。「この関数を呼ぶのはどこか」をファイルを読み回さずに答えられるのが要点で、質問を読み解く役は**つないだエージェント**が担う。


## どんなときに使うか

### 大きなリポジトリで、AI が読み回してばかりで答えにたどり着かないとき

呼び出し元・呼び出し先や変更の影響範囲を、グラフへの問い合わせで返せる。エージェントがファイルを片端から開いてトークンを使い切る状況を減らしたい場合に向く。

### 複数のサービスにまたがる呼び出しを、まとめて追いたいとき

HTTP のルートと呼び出し側の対応づけや、同じ置き場に入れた複数のリポジトリどうしのつながりもグラフに載る。サービスをまたいで「どこから叩かれているか」を探す手間が減る。


## 注意点

**インストールすると、エージェントの設定ファイルを書き換える。** README によれば、`install` は入っているコーディングエージェントを探し、MCP の登録を書き込む。対応しているエージェントには、指示文・スキル・フックまで書き込む。README 自身が「コードを読み、エージェントの設定を書く道具だ」と明記しており、先に中身を確かめたい人向けにソースを案内している。外すときは `uninstall` で、グラフのデータは確認のうえで消される。

**チームでグラフを共有する機能は、コミットの仕方に気をつけたい。** グラフを圧縮した1ファイルをリポジトリに入れておけば、仲間は作り直しを省ける。ただし索引のたびに書き換わるため、毎回コミットすると履歴が膨らむ。README には、1つのファイルだけで約350回のコミットにわたり約6GBに達したチームの例が載っている。使わないなら `.gitignore` に足せばよい。

**グラフに聞けるのは構造であって、答えの賢さはエージェントしだい。** このツールは LLM を持たないので、質問の解釈や結果のまとめはつないだエージェントの力量に左右される。コマンドから直接呼ぶこともできるが、主な使い道は MCP に対応したエージェント経由だ。
