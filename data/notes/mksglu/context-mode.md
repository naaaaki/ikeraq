---
updated: 2026-10-02
image:
image_alt:
---

<!-- ============================================================
  mksglu/context-mode
  https://github.com/mksglu/context-mode
  Context window optimization for AI coding agents. Sandboxes tool output (98% reduction), persists session memory, and enforces routing across 17 platforms via MCP + hooks.
  TypeScript / Elastic License 2.0（GitHub 上の表示は NOASSERTION） / スター 24,483
============================================================ -->


## 見出しの一文

AI エージェントに生データを読ませず、会話の枠を長持ちさせる


## どういうものか

AI のコーディングエージェントが、ツールの出力で会話の枠（コンテキスト）を使い切ってしまう問題を減らす MCP サーバーだ。README の例では、ブラウザ操作ツール Playwright のページのスナップショット1回で 56KB、GitHub の issue 20件で 59KB を食う。さらに枠が埋まって会話が圧縮（要約）されると、エージェントはどのファイルを直していたか、何を頼まれていたかを忘れてしまう。

対策の中心は、生のデータを会話の外で処理することだ。エージェントはファイルやログを直接読む代わりに、集計や抽出をするコードを書き、別のプロセスで実行させる。会話に入るのは、その出力だけ。ウェブページや、探したいことを指定した長い出力は、手元の SQLite に索引として保存し、必要な部分だけを検索で引き出す。対応している環境では、フックがツールの呼び出しを横取りし、出力の大きくなりそうな操作をこの仕組みへ回す。

もう1つの柱は、作業の続きを保つことだ。ファイルの編集、git の操作、タスク、エラー、利用者の判断を SQLite に記録しておき、会話が圧縮されたあとや再開したときに、関係する分だけを検索して戻す。Claude Code、Gemini CLI、VS Code の Copilot、Cursor、Codex CLI など多くの環境に対応するが、使えるフックの種類は環境ごとに違う。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「生データは外で処理し、結果だけを会話に入れる」とある図。左から「ツールの出力（ログ・API の応答・ページ）」「サンドボックス（別プロセスで処理・索引）」「会話（結果と、検索で引いた部分だけ）」が矢印でつながる。下に「作業の記録も外に保存し、圧縮のあとに必要な分だけ戻す」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">生データは<tspan fill="#1E5A48">外で処理</tspan>し、結果だけを会話に入れる</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ツールの出力</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ログ・API の応答・ページ）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cm-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">サンドボックス</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（別プロセスで処理・索引）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cm-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">会話</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（結果と、検索で引いた部分だけ）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">作業の記録も外に保存し、圧縮のあとに必要な分だけ戻す</text>
</svg>

キャプション: サンドボックスを通したデータは会話に入る前に外で受け止め、エージェントには処理した結果だけを見せる。


## どんなときに使うか

### 長い作業の途中で、エージェントが会話の圧縮を繰り返し、前の作業を忘れるとき

Claude Code など対応している環境では、編集したファイルや頼んだ内容が記録されているので、圧縮されたあとも続きから進めやすくなる。Cursor のように、圧縮後の復元がまだ使えない環境もある。

### ログや API の応答、ウェブページなど、大きなデータを何度も読ませる作業が多いとき

データそのものを会話に流さず、集計した結果や必要な断片だけを渡せる。


## 注意点

**ライセンスは Elastic License 2.0。** README によれば、ソースは公開されていて改変や再配布もできるが、ホスティングサービスとして提供することと、ライセンス表記を消すことは禁じられている。MIT のような自由なライセンスではない。

**効果の数字は開発元の測定。** README は、1回の作業全体で 315KB の出力が 5.4KB になったとしている。フックが使えない環境では、節約は約60%にとどまるとも書いている。

**前の作業を引き継ぐには、再開の指定が要る。** `--continue` を付けずに始めると、前回のセッションのデータはすぐに消える。
