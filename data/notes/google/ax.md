---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  google/ax
  https://github.com/google/ax
  Google's open agentic orchestration runtime
  Go / Apache-2.0 / スター 11,000台
============================================================ -->


## 見出しの一文

AIエージェントの仕事を、Kubernetes の上で隔離して大量に回す


## どういうものか

AIエージェントの作業を、クラスタの上でまとめて動かすための実行基盤だ。Google の GitHub 組織で公開されていて、Go で書かれ、ライセンスは Apache-2.0。何をさせたいかを YAML の設定ファイルに書いて `ax apply` で渡すと、AX が**隔離された実行環境（サンドボックス）を用意し、作業場所をつないで、エージェントを走らせる**。README は「Kubernetes を使ったことがあれば似た感覚で使える」と書いていて、コマンドも `apply`・`get`・`describe`・`watch`・`delete` と kubectl に形を揃えてある。

設定ファイルで扱うものは3つある。エージェントを CPU とメモリの上限つきで隔離して動かす単位の **Task**、Git リポジトリ・MCP サーバー・スキルをあらかじめつないでおく **Workspace**、基盤そのものが使う LLM を指定する **Model** だ。Model の認証情報は Kubernetes の secret から読む。エージェント向けのコマンドもあり、`ax suspend` で止めた作業を `ax resume` で止めたところから再開でき、`ax ssh` で動いている環境の中に入って様子を見られる。

なぜ専用の基盤が要るのかについて、README はこう説明している。エージェントは、状態を持たないサービスとも、最後まで走って終わる一括処理とも違う。状態を溜め込み、厳しい隔離が要り、モデルの API やツールのサーバーを呼び出し、誰も見ていなければループしてお金を使い続けることもある。実際の隔離実行は、別プロジェクトの **Agent Substrate** が受け持つ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「書いて渡せば、隔離して走らせる」とある図。左に「設定ファイル（Task・Workspace・Model を YAML で宣言）」、次に「AX（サンドボックスを用意し、Git・MCP・スキルをつなぐ）」、右に「隔離されたエージェント（ax suspend で止め、ax resume で続きから）」が矢印でつながっている。下に「操作は kubectl と同じ形：apply・get・describe・watch・delete」とある。いちばん下に「前提は Agent Substrate を入れた Kubernetes クラスタ」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ax-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">書いて渡せば、<tspan fill="#1E5A48">隔離して</tspan>走らせる</text>

  <rect x="30" y="130" width="220" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">設定ファイル</text>
  <text x="140" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Task・Workspace・Model</text>
  <text x="140" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">を YAML で宣言）</text>

  <line x1="256" y1="186" x2="284" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#ax-arrow)" />

  <rect x="290" y="130" width="220" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AX</text>
  <text x="400" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（サンドボックスを用意し、</text>
  <text x="400" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">Git・MCP・スキルをつなぐ）</text>

  <line x1="516" y1="186" x2="544" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#ax-arrow)" />

  <rect x="550" y="130" width="220" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="660" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">隔離されたエージェント</text>
  <text x="660" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ax suspend で止め、</text>
  <text x="660" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">ax resume で続きから）</text>

  <text x="400" y="312" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">操作は kubectl と同じ形：apply・get・describe・watch・delete</text>
  <text x="400" y="376" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">前提は Agent Substrate を入れた Kubernetes クラスタ</text>
</svg>

キャプション: エージェントを「サーバーでも一括処理でもない新しい種類の仕事」として扱い、Kubernetes と同じ**宣言して任せる**やり方に乗せている。


## どんなときに使うか

### たくさんのエージェントを、互いに干渉させずに動かしたいとき

エージェントごとにサンドボックスを分け、CPU とメモリの上限を付けて動かす。信頼しきれないコードをエージェントに実行させる場合にも、ほかの作業と切り離しておける。

### 動いているエージェントが何をしているか、途中で確かめたいとき

`ax watch` で状態の変化を流して見られ、`ax ssh` で実行環境の中に入れる（`ssh` で入るには設定で `debug: true` にしておく）。手を止めておきたいときは `ax suspend` で止め、あとで続きから再開できる。


## 注意点

**仕様がまだ固まっていない。** README の冒頭に、中心の考え方・プロトコル・仕様を練り直している最中で、安定版の前に大きな互換性のない変更が入る見込みだと警告がある。設定ファイルの版も `v1alpha1` だ。

**始めるまでの前提が重い。** Agent Substrate を入れた Kubernetes クラスタ、Go と kubectl、コンテナを組み立てる `ko`、クラスタから取得できるコンテナレジストリが要る。

