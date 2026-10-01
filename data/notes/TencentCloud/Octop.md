---
updated: 2026-10-02
image:
image_alt:
---

<!-- ============================================================
  TencentCloud/Octop
  https://github.com/TencentCloud/Octop
  A smarter, self-hosted AI assistant — multi-user, multi-agent.
  Python / MIT / スター 6,086
============================================================ -->


## 見出しの一文

役割別の AI 助手を自分のマシンに置き、家族や小さなチームで共有する


## どういうものか

Tencent Cloud が公開している、自分のマシンで動かす AI アシスタントの基盤だ。README は家庭や小さなチーム向けとしている。管理者が1人いて、その下に複数の利用者がいる。利用者はそれぞれ「専門家」と呼ばれるエージェントを何体も持てて、作業に応じて切り替える。専門家ごとに作業場所、使う LLM、つなぐチャットアプリ、定期実行の設定を分けられる。よくできた専門家は、同じ環境の中でほかの利用者と共有できる。

中心になるのは `octop run` の1つのプロセスだ。これがブラウザの管理画面、コマンドライン、チャットアプリ（Feishu、DingTalk、QQ、WeChat、Telegram、Discord、WeCom など）、定期実行の入口をまとめて受け持つ。どこから話しかけても同じ処理の流れに入るので、別に待ち行列の仕組みを立てる必要がない。設定や会話の記録は `~/.octop/` の下に置かれ、データベースは既定で SQLite、望めば PostgreSQL も使える。

機能は広い。外部サービスとの接続（OAuth と MCP）、手持ちの文書を検索して答えに使う知識ベース、ブラウザ操作、管理画面からのリモートデスクトップ、性格づけのための16種類の MBTI テンプレートなどがある。コーディングの仕事は Claude Code、OpenCode、Codex、CodeBuddy に回せる。逆に、エディタの側から Octop のエージェントを呼ぶこともできる。LLM は OpenAI 互換の API、DashScope（Qwen）、Ollama などから選ぶ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「どこから話しかけても1つのプロセスが受ける」とある図。左から「入口（画面・チャット・定期実行）」「Octop（octop run の1プロセス）」「専門家（利用者ごとの役割別エージェント）」が矢印でつながる。下に「設定や会話の記録は、既定では ~/.octop/ に置く」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="oc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">どこから話しかけても<tspan fill="#1E5A48">1つのプロセス</tspan>が受ける</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">入口</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（画面・チャット・定期実行）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#oc-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Octop</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（octop run の1プロセス）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#oc-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">専門家</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（利用者ごとの役割別エージェント）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">設定や会話の記録は、既定では ~/.octop/ に置く</text>
</svg>

キャプション: 入口がいくつあっても処理は1か所に集まり、利用者ごと・役割ごとのエージェントに振り分けられる。


## どんなときに使うか

### 家族やチームで1台の AI 環境を共有し、人ごとに使い分けたいとき

管理者1人で全員分を用意でき、利用者ごとにエージェントや知識ベースを分けたり共有したりできる。

### 普段使っているチャットアプリから、AI に仕事を頼みたいとき

Telegram や Discord などのチャットから話しかけたり、決まった時刻に定期実行させたりできる。


## 注意点

**つなげるチャットアプリと外部サービスは、中国のサービスが中心。** README の一覧に Slack と LINE は無い。外部サービスとの接続も、例に挙がるのは Tencent の文書・会議などだ。

**既定の構成で自分のマシンに置かれるのは、設定・会話の記録・作業場所・認証情報。** 作業場所を PostgreSQL や COS/S3 などに置く設定もある。LLM に外部の API を使う場合は、会話の中身がその提供元に送られる（README によれば、個人情報は外に出る前に伏せる仕組みがある）。

**機能の一部はまだ試験段階。** 複数の専門家を連携させる AgentTeams はベータと明記されている。

**ライセンスは MIT。**
