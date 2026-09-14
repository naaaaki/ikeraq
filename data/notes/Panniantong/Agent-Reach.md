---
updated: 2026-09-14
image:
image_alt:
---

<!-- ============================================================
  Panniantong/Agent-Reach
  https://github.com/Panniantong/Agent-Reach
  Python / MIT / スター 80,000台
  topics: agent-infrastructure, ai-agent, cli, mcp, web-scraper
============================================================ -->


## 見出しの一文

エージェントにネットを読ませる道具を、選んで・入れて・点検するまでやる


## どういうものか

Agent Reach は、手元の AI エージェント（Claude Code などのコマンドラインで動くもの）に、ウェブや SNS を読む力を持たせるための CLI です。ふつうエージェントは、コードを書いたり文書を直したりはできても、「この YouTube の動画は何を言っているか」「Reddit に同じ不具合の報告はあるか」と頼まれると止まります。有料の API、ログインが要るページ、弾かれる IP。その一つひとつを自分で調べて設定する作業を、まとめて肩代わりするのがこの道具です。

面白いのは、**Agent Reach 自身は読んでいない**ところです。README はこれを「能力層（capability layer）」と呼び、担当は**選定・インストール・点検・振り分け**だけで、読み取りそのものはエージェントが上流のツールを直接呼んで行う、と説明しています。あいだに包む層を作らない、という設計です。

そのため、プラットフォームごとの中身は「**第一候補と代替の順番リスト**」になっています。Twitter なら twitter-cli、それが駄目なら OpenCLI、という並びです。`agent-reach doctor` を打つと、いまどの経路が通っていて、どこが詰まっているかが出ます。README は、2026年6月に yt-dlp が B站（ビリビリ）側の規制で通らなくなったとき、bili-cli に切り替えて利用者の操作はゼロで済んだ、という例を挙げています。接続方法が世代交代しても、リストの順番を入れ替えるだけで済ませる、という考え方です。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「読む道具は、その都度選び直す」とある図。左に「エージェント（手元のCLI）」の箱があり、「この動画の中身を教えて」と頼む、とある。矢印で中央の「Agent Reach（選ぶ・入れる・点検する）」に進み、候補を上から順に試す、実際に通った1つに決める、と書かれている。矢印で右の「上流のツール（実際に読むのはこちら）」に進み、yt-dlp、gh、Jina Reader、bili-cli ほかが並ぶ。下に「経路が1つ塞がれても、次の候補に入れ替わる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ar-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">読む道具は、<tspan fill="#1E5A48">その都度選び直す</tspan></text>

  <rect x="20" y="130" width="222" height="200" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="131" y="176" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">エージェント</text>
  <text x="131" y="200" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（手元のCLI）</text>
  <text x="131" y="250" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">「この動画の</text>
  <text x="131" y="274" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">中身を教えて」</text>
  <text x="131" y="304" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">と頼む</text>

  <line x1="242" y1="220" x2="282" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#ar-arrow)" />

  <rect x="289" y="130" width="222" height="200" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="176" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">Agent Reach</text>
  <text x="400" y="200" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（選ぶ・入れる・点検する）</text>
  <text x="400" y="250" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">候補を上から順に試す</text>
  <text x="400" y="288" text-anchor="middle" font-size="13" font-weight="700" fill="#1E5A48">実際に通った1つに決める</text>

  <line x1="511" y1="220" x2="551" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#ar-arrow)" />

  <rect x="558" y="130" width="222" height="200" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="669" y="176" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">上流のツール</text>
  <text x="669" y="200" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（実際に読むのはこちら）</text>
  <text x="669" y="244" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">yt-dlp ／ gh</text>
  <text x="669" y="270" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">Jina Reader</text>
  <text x="669" y="296" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">bili-cli ほか</text>

  <text x="400" y="392" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">経路が1つ塞がれても、次の候補に入れ替わる</text>
</svg>

キャプション: 読む力そのものを作り直すのではなく、**すでにある道具のどれを今日使うか**を決める位置にいる。塞がれるのが前提の相手だからこそ、この置き方になっている。


## どんなときに使うか

### エージェントの環境を作り直すたび、同じ設定を踏み直しているとき

機械を変えた、新しいエージェントに乗り換えた、というたびに「Twitter は何で読むんだったか」を思い出すところから始まります。**選定そのものが更新されていく**ので、前に調べた結論が今日も正しいとは限りません。そこを引き受けてもらう道具です。

### 読めなくなった原因が、どこにあるか分からないとき

エージェントが「取得できませんでした」と返したとき、鍵が切れたのか、相手に弾かれたのか、ツールが停止したのかは区別がつきません。`agent-reach doctor` は経路ごとに状態と直し方を出します。


## 注意点

**ログインが要るプラットフォームは、渡すものの重さが違います。** Reddit・Facebook・Instagram・小紅書（RED）と、Twitter の検索は、ログイン済みの状態か Cookie が要ります。Cookie はログイン権限そのものです。README 自身が**専用のサブアカウントを使うこと**を勧めていて、スクリプト経由の呼び出しが検知されて凍結される可能性にも触れています。主アカウントで試す道具ではありません。

**設定なしで使える経路として README が並べているのは6つです。** ウェブページ、GitHub の公開リポジトリ、YouTube、B站の検索、全網検索（Exa、鍵は不要）、RSS。ただし `agent-reach install` は既定では環境を確かめるだけで、実際に入れて設定するのは `--system` を明示したときだ、とも書かれています。いっぽう上に挙げたログインが要るものは、すべて追加の手当てが必要です。Reddit については「匿名で読む経路はもう無い」と README がはっきり書いています。

**対象の重心が中国語圏にあります。** 小紅書、B站、V2EX、雪球（株式）が並ぶ構成で、日本から使うと価値のある窓口は絞られます。README は中国語が本体ですが、`docs/README_ja.md` に日本語版が置かれています。

**PyPI に同じ名前のパッケージがありますが、別物です。** README が名指しで注意しています。入れるならこのリポジトリから入れることになります。

ライセンスは MIT です。
