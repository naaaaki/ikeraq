---
updated: 2026-09-11
image:
image_alt:
---

<!-- ============================================================
  obra/superpowers
  https://github.com/obra/superpowers
  An agentic skills framework & software development methodology that works.
  Shell / MIT / スター 284,674
  topics: ai, brainstorming, coding, obra, sdlc, skills, subagent-driven-development, superpowers
============================================================ -->


## 見出しの一文

思いつきで書き始めさせず、設計から合流までの手順を毎回踏ませる


## どういうものか

Superpowers は、コーディングエージェントに「開発の進め方」一式を持たせるスキル集。ただ、個々のスキルより目立つのは、それを**必ず使わせる仕掛け**のほうだ。セッションが始まると、フック（決まったタイミングで自動で走る小さな処理）が、スキルの使い方を定めた指示書を会話の最初に差し込む。そこには「当てはまる可能性が少しでもあれば必ず使う」「"簡単な質問だから" は省く理由にならない」といった決まりが並び、エージェントが手順を飛ばすときの言い訳が先回りして潰してある。スキルは提案ではなく、**守る手順**として扱われる。

手順は細かく数えると7段ある（図では4つにまとめた）。まず質問を重ねて何を作るのかを詰め、設計を小分けに見せて人の承認を取る。承認が出たら git の作業用の枝を別に切り、作業を2〜5分で終わる大きさに割った計画を書く。実装はその作業ごとに**新しいサブエージェント**に渡し、渡すのは計画全体ではなくその作業の要件だけに絞る。1つ終わるたびに「計画どおりか」と「コードとして健全か」の2段で確認し、落ちれば直して確認し直す。5回やっても片付かなければ、全体を見ている側が扱いを決める。テストを先に書く（テスト駆動）ことが前提で、最後にテストが通るのを確かめてから、合流するかプルリクエストにするかを人に選ばせる。

中に入っているスキルは、テスト駆動、原因を4段階で追うデバッグ、「終わった」と言う前の検証、コードレビューの頼み方と受け方、作業の並列化など、**開発の工程**に寄っている。スキルの書き方を教えるスキルも含まれる。対応先は Claude Code のほか、Codex、Cursor、Gemini CLI、GitHub Copilot CLI、OpenCode など十数種。


## 図

<svg viewBox="0 0 800 430" role="img" aria-label="Superpowers の流れの図。左に「会話の開始」の箱があり、使えそうなスキルは必ず使うという決まりが差し込まれる。中央の大きな箱は「決まった順に進む（AIの判断では飛ばせない）」で、詰める・計画・実装・確認の4つの小さな箱が矢印でつながっている。確認から実装へ戻る矢印があり、落ちたら直して再確認と書かれている。右に「仕上がり」の箱があり、テストが通った作業用の枝から合流かPRを選ぶと書かれている。下に、手順はセッション開始時に差し込まれ、使うかどうかをエージェントに選ばせないと添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="430" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">書く前に<tspan fill="#1E5A48">手順</tspan>を通す。AIの判断では飛ばさせない</text>

  <rect x="20" y="120" width="150" height="200" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="95" y="158" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">会話の開始</text>
  <text x="95" y="182" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（決まりを差し込む）</text>
  <text x="95" y="228" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">使えそうな</text>
  <text x="95" y="250" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">スキルは</text>
  <text x="95" y="282" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">必ず使う</text>

  <line x1="170" y1="220" x2="206" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#sp-arrow)" />

  <rect x="213" y="120" width="400" height="200" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="413" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">決まった順に進む（AIの判断では飛ばせない）</text>

  <rect x="224" y="176" width="78" height="44" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="263" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">詰める</text>
  <rect x="324" y="176" width="78" height="44" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="363" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">計画</text>
  <rect x="424" y="176" width="78" height="44" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="463" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">実装</text>
  <rect x="524" y="176" width="78" height="44" rx="4" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="563" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#1E5A48">確認</text>

  <line x1="303" y1="198" x2="320" y2="198" stroke="#1E5A48" stroke-width="3" marker-end="url(#sp-arrow)" />
  <line x1="403" y1="198" x2="420" y2="198" stroke="#1E5A48" stroke-width="3" marker-end="url(#sp-arrow)" />
  <line x1="503" y1="198" x2="520" y2="198" stroke="#1E5A48" stroke-width="3" marker-end="url(#sp-arrow)" />

  <text x="263" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（質問して</text>
  <text x="263" y="258" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">設計を固める）</text>
  <text x="363" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（2〜5分の</text>
  <text x="363" y="258" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">作業に割る）</text>
  <text x="463" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（作業ごとに</text>
  <text x="463" y="258" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">新しい担当）</text>
  <text x="563" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（計画どおりか</text>
  <text x="563" y="258" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">→ 健全か）</text>

  <path d="M 563 268 Q 513 296 469 270" fill="none" stroke="#1E5A48" stroke-width="2.5" marker-end="url(#sp-arrow)" />
  <text x="513" y="308" text-anchor="middle" font-size="11.5" fill="#1E5A48" font-weight="700">落ちたら直して再確認</text>

  <line x1="613" y1="220" x2="649" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#sp-arrow)" />

  <rect x="656" y="120" width="124" height="200" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="718" y="158" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">仕上がり</text>
  <text x="718" y="182" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（確かめ済み）</text>
  <text x="718" y="228" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">テストが通った</text>
  <text x="718" y="250" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">作業用の枝</text>
  <text x="718" y="282" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">合流かPRを選ぶ</text>

  <text x="400" y="386" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">手順はセッション開始時に差し込まれ、「使うかどうか」をエージェントに選ばせない</text>
</svg>

キャプション: 渡しているのは便利な道具ではなく**進め方そのもの**。エージェントの判断で手順を省けないようにしてある点が、ほかのスキル集との違いになっている。


## どんなときに使うか

### 頼んだ途端に書き始めて、あとで前提のずれに気づくとき

最初に質問と設計の承認が必ず挟まるので、**食い違いがコードを書く前に表に出る**。「思っていたのと違う」を何百行も書かれてから知る、ということが減る。

### 大きめの作業を、しばらく目を離して進めさせたいとき

横について一手ずつ見張る代わりに、**確認の工程が手順の中に組み込まれている**。README は、立てた計画から外れずに2時間ほど自走することも珍しくない、としている。


## 注意点

**小さな修正にも手順が付いてくる。** 決まりは「少しでも当てはまれば使う」なので、1行直すだけでも質問や計画が挟まりうる。手早く済ませたい作業が中心の人には重く感じるはずだ。人が CLAUDE.md などで明示した指示のほうが優先される作りにはなっている。

**テストを先に書く流儀が前提。** テスト駆動を強く求めるので、テストをほとんど書かない案件や、見た目の調整が中心の作業とは噛み合いにくい可能性がある。

**任意の画面表示を使うと、外に通信する。** 設計を詰める段階で使える画面表示（使うかどうかは任意）が、既定では開発元（Prime Radiant）のサイトからロゴを読み込み、その際にバージョン情報が送られる。README によれば、環境変数 `SUPERPOWERS_DISABLE_TELEMETRY` を設定すると止められる。

**エージェントごとに入れ直しが要る。** Claude Code と Codex を併用するなら、それぞれに導入する。

ライセンスは MIT。
