---
updated: 2026-09-24
image:
image_alt:
---

<!-- ============================================================
  davila7/claude-code-templates
  https://github.com/davila7/claude-code-templates
  CLI tool for configuring and monitoring Claude Code
  Python / MIT / スター 31,480
  topics: anthropic, anthropic-claude, claude, claude-code

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

Claude Code 向けの部品を選んで入れ、使い方の様子まで見られるようにする


## どういうものか

Claude Code に足せる部品を集めたカタログと、それを入れるためのコマンドラインのツールだ。部品は6種類に分かれている。特定の分野を受け持つエージェント、自分用のスラッシュコマンド、外部サービスとつなぐ MCP、Claude Code の設定、決まったタイミングで動くフック、そしてスキル。README によれば、カタログには100を超える部品がある。

入れ方は2通りある。npx でツールを起動し、対話形式で選んでいく方法と、種類と名前を引数で指定して1行で入れる方法だ。名前を指定して入れる場合は、先にサイト（aitmpl.com）で一覧を眺めて名前を確かめておく。部品の中には作者が書いたものだけでなく、Anthropic 公式のスキルや、ほかの公開リポジトリから取り込んだものも含まれ、README に出どころとライセンスが並べられている。

カタログのほかに、Claude Code の使い方を**見るための道具**も入っている。作業中のセッションの状態を表示する画面、Claude の応答をスマートフォン向けの画面で追える会話モニター、Claude Code の導入状態を点検するヘルスチェック、プラグインと権限をまとめて管理する画面の4つだ。いずれも同じコマンドに引数を変えて呼ぶ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="サイトで選び、コマンド1行でClaude Codeに入れる。カタログ（aitmpl.comで一覧を見る）。npx claude-code-templates（対話形式か、名前を指定）。Claude Code（エージェント・コマンド・MCP・設定・フック・スキル）。使っている様子（セッション・会話）も、同じコマンドの別の引数で見る" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cct-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">サイトで選び、<tspan fill="#1E5A48">コマンド1行</tspan>でClaude Codeに入れる</text>

  <rect x="40" y="170" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="135" y="215" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">カタログ</text>
  <text x="135" y="243" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">（aitmpl.comで一覧を見る）</text>

  <line x1="236" y1="225" x2="272" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cct-arrow)" />

  <rect x="278" y="170" width="230" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="393" y="215" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">npx claude-code-templates</text>
  <text x="393" y="243" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">（対話形式か、名前を指定）</text>

  <line x1="514" y1="225" x2="550" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cct-arrow)" />

  <rect x="556" y="160" width="210" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="661" y="205" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">Claude Code</text>
  <text x="661" y="233" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">（エージェント・コマンド・MCP・</text>
  <text x="661" y="253" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">設定・フック・スキル）</text>

  <text x="400" y="380" text-anchor="middle" font-size="14" fill="#17160F" fill-opacity="0.72">使っている様子（セッション・会話）も、同じコマンドの別の引数で見る</text>
</svg>

キャプション: 部品選びはサイトで、導入はコマンドで行う。セッションの状態表示や会話モニターも、同じコマンドから呼び出せる。


## どんなときに使うか

### Claude Code を入れたものの、何を足せばよいか分からないとき

エージェントやフック、MCP を一から書く前に、ほかの人が作ったものを種類別に眺められる。気に入ったものをそのまま入れて、中身を読んで自分用に直す出発点にできる。

### チームで同じ Claude Code の構成をそろえたいとき

部品を名前で指定して1行で入れられるので、どの部品を入れるかをコマンドとして共有できる。


## 注意点

**部品ごとにライセンスと作者が違う。** 本体は MIT だが、README によれば、取り込んだ部品はそれぞれ元のライセンスのままだ（MIT のほか、Apache 2.0 や CC0 のものがある）。作者も Anthropic 公式からコミュニティのものまで混ざっているので、入れる前に中身と出どころを確かめたい。

**会話モニターは外からも見られるようにできる。** README によれば、引数を足すと Cloudflare Tunnel を通して手元の外からアクセスできる。Claude の応答をそのまま見せる機能なので、使うときは誰が見られる状態なのかを意識したい。

**README の冒頭には協賛企業の案内がある。** 協賛企業のスキルと MCP を入れるコマンドも載っている。カタログの一部として並んでいるので、何を入れるかは自分で選びたい。
