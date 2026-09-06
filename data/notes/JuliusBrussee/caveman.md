---
updated: 2026-09-06
image:
image_alt:
---

<!-- ============================================================
  JuliusBrussee/caveman
  https://github.com/JuliusBrussee/caveman
  🪨 why use many token when few token do trick — Claude Code skill that cuts 65% of tokens by talking like caveman
  Go / NOASSERTION / スター 103,068
  topics: ai, anthropic, caveman, claude, claude-code, llm, meme, prompt-engineering, skill, tokens

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

エージェントの言葉を短くして、トークン代の削りしろを作る

## どういうものか

AI コーディングエージェントの請求額を、中身を変えずに削るための道具です。層が2つに分かれています。ひとつは**スキル**。エージェントに「短く喋れ」と指示する規則ファイルで、Claude Code をはじめ30種以上のエージェントに `npx skills add` で入ります。名前のとおり原始人のような言い回しになりますが、短くなるのは説明の散文だけで、コード・コマンド・ファイルのパス・エラーの文面には手を付けません。

もうひとつは**プロキシ**。手元で動いてエージェントと LLM のあいだに入り、エージェントが**読む**ぶんを圧縮します。中身の種類ごとに削り方を変えるのが特徴で、JSON なら繰り返しの配列、ログなら INFO 行、コードなら関数の中身、というふうに落とします。落とした元データは手元の SQLite に残るので、必要になれば取り戻せます。MCP サーバーとしても立ち、`caveman_compress` / `caveman_retrieve` / `caveman_stats` など5つの道具をエージェントに渡します。

スキルは出ていく側、プロキシは入ってくる側なので、両方を重ねられます。変わり種として「pixel mode」があり、スキルの文面を PNG 画像に描き直して渡します。画像のほうが安くなるときだけ切り替わり、うまくいかなければ元のテキストのまま残す作りです。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="上段は「出ていく言葉」がスキルを通って短い返事になる流れ、下段は「入ってくる資料」がプロキシを通ってエージェントが読む量に減る流れ。二段が別々の向きの削り方であることを示した図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="58" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      出ていく言葉と<tspan style="fill: #1E5A48;">入ってくる資料</tspan>を、別々に削る
    </text>

    <!-- 上段：スキル -->
    <rect x="56" y="118" width="176" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="144" y="152" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">出ていく言葉</text>
    <text x="144" y="176" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（説明・前置き）</text>

    <path d="M246 156 H284" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M284 145 l18 11 -18 11 z" fill="#1E5A48"/>

    <rect x="312" y="112" width="196" height="88" rx="12" fill="#1E5A48"/>
    <text x="410" y="150" text-anchor="middle" style="font-family: var(--jp); font-size: 21px; font-weight: 700; fill: #FFFFFF;">スキル</text>
    <text x="410" y="176" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity: .85;">（言い回しだけ短く）</text>

    <path d="M522 156 H560" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M560 145 l18 11 -18 11 z" fill="#1E5A48"/>

    <rect x="588" y="118" width="158" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="667" y="152" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">短い返事</text>
    <text x="667" y="176" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（10問平均 −65%）</text>

    <!-- 下段：プロキシ -->
    <rect x="56" y="272" width="176" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="144" y="306" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">入ってくる資料</text>
    <text x="144" y="330" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（JSON・ログ・差分）</text>

    <path d="M246 310 H284" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M284 299 l18 11 -18 11 z" fill="#1E5A48"/>

    <rect x="312" y="266" width="196" height="88" rx="12" fill="#1E5A48"/>
    <text x="410" y="304" text-anchor="middle" style="font-family: var(--jp); font-size: 21px; font-weight: 700; fill: #FFFFFF;">プロキシ</text>
    <text x="410" y="330" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity: .85;">（元は手元の SQLite に）</text>

    <path d="M522 310 H560" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M560 299 l18 11 -18 11 z" fill="#1E5A48"/>

    <rect x="588" y="272" width="158" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="667" y="306" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">読む量が減る</text>
    <text x="667" y="330" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（54タスク×3回で −33%）</text>

    <text x="400" y="404" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 コード・コマンド・エラーの文面には手を付けない 〜
    </text>
  </svg>
</figure>

キャプション:

段が2つに分かれていることが要点です。上だけ入れても請求書の入力側は1円も減りません。どちらが自分の使い方で効くのかを先に見分けないと、入れた実感が出ません。

## どんなときに使うか

### 読みもしない長い説明に、毎回お金を払っている気がするとき

コードだけ見たいのに、前置きと要約が毎回付いてくる。その散文ぶんが請求に乗っています。上の段だけなら規則ファイル1枚なので、外すのも簡単です。

### 大きな JSON やログをエージェントに読ませているとき

削りしろが大きいのは入力側です。CSV の集計のような、同じ形が延々続くデータで効きが大きいと計測されています。

## 注意点

**数字は条件つきです。ここを外して読むと期待しすぎます。** 65% は「出力だけ」で「10個のプロンプト」の平均で、内訳は 22%〜87% と開きがあります。しかもスキル自体が毎ターン 1〜1.5k の入力トークンを食うので、もともと短いやりとりが中心なら**足が出ます**。プロキシの 33.2% も 54 タスクを各3回ずつ測ったもので、HTML では圧縮が効かず +9.9% と増えた例が併記されています。作者自身も、削減額を約束するものではない、数字を人に伝える前に自分の環境で測ってほしい、と断っています。

**ライセンスが2つに割れています。** スキルや CLI は MIT ですが、エンジン・プロキシ・キャッシュ・MCP サーバーは BSL-1.1 です。自分で動かすぶんは無料ですが、これを載せたサービスを他人に提供するなら商用ライセンスが要ります。2030年6月21日（または公開から4年）に Apache-2.0 へ変わる条件付きです。

**圧縮は情報を捨てる行為です。** 捨てた側が実は必要だった、という事故は原理的に起きます。元データが手元に残って取り戻せる設計になっているのは、その裏返しでもあります。監査ログのように「省略された」こと自体が問題になる用途では、入れる前に考えたほうがいい種類の道具です。

