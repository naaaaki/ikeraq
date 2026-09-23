---
updated: 2026-08-29
image:
image_alt:
---

## 見出しの一文

配置までAIに決めさせて、絵にする工程だけ機械で固める

## どういうものか

Claude Code や Cursor などのコーディングエージェントに追加して使う「スキル」です。会話の中で「このリポジトリの構成を図にして」と頼むと呼び出され、アーキテクチャ図やシーケンス図が出てきます。

面白いのは**役割の分け方**です。エージェントが書くのは、型の決まった JSON。ただし「構造だけ」ではありません。階層、間隔、線の引き回し、どこを強調するか——見た目の判断まで、エージェントが JSON に書き込みます。汎用の自動レイアウトに任せない、というのが作者の立場です。Archify 側の仕事は、その JSON を検証して、決まった手順どおりに HTML/SVG へ変換すること。作者は「エージェントは型付きの中間表現を作る。Archify がそれを決定的に HTML/SVG へコンパイルする」と説明しています。

出てくるのは、それ1つで開ける HTML ファイルが1枚です。配色はダークとライトの両方があり、PNG・SVG・WebM で書き出せます。図を組み立てる前にスキーマやレイアウトの検証を通す作りになっています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="見出しに「配置までJSONに書く。絵にするのは機械の仕事」とある図。左から右へ4つが矢印でつながっている。「エージェント（構造と配置を決める）」、破線で囲まれた「型付きJSON（見た目の判断も入る）」、チェック印の付いた「Archify（検証して組み立てる）」、そして「HTML（1枚で完結）」。下に「〜 同じJSONからは、毎回同じHTMLが出る 〜」とある。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="64" text-anchor="middle"
          style="font-family: var(--jp); font-size: 31px; font-weight: 700; fill: #17160F;">
      <tspan style="fill: #1E5A48;">配置まで</tspan>JSONに書く。絵にするのは機械の仕事
    </text>

    <!-- エージェント -->
    <rect x="74" y="150" width="104" height="94" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <circle cx="126" cy="182" r="13" fill="#17160F" opacity=".18"/>
    <rect x="96" y="207" width="60" height="7" rx="3.5" fill="#17160F" opacity=".18"/>
    <rect x="96" y="223" width="42" height="7" rx="3.5" fill="#17160F" opacity=".18"/>

    <path d="M196 197 H236" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M236 186 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 型付きJSON -->
    <rect x="272" y="150" width="104" height="94" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="7 5"/>
    <rect x="294" y="176" width="60" height="7" rx="3.5" fill="#1E5A48" opacity=".55"/>
    <rect x="294" y="192" width="46" height="7" rx="3.5" fill="#1E5A48" opacity=".55"/>
    <rect x="294" y="208" width="54" height="7" rx="3.5" fill="#1E5A48" opacity=".55"/>

    <path d="M394 197 H434" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M434 186 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- Archify -->
    <rect x="470" y="140" width="128" height="114" rx="12" fill="#1E5A48"/>
    <path d="M508 197 l14 14 30 -32" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

    <path d="M616 197 H656" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M656 186 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- HTML 1枚 -->
    <rect x="692" y="150" width="34" height="94" rx="5" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="700" y="162" width="18" height="18" rx="3" fill="#1E5A48" opacity=".3"/>
    <rect x="700" y="188" width="18" height="4" rx="2" fill="#17160F" opacity=".2"/>
    <rect x="700" y="200" width="18" height="4" rx="2" fill="#17160F" opacity=".2"/>

    <!-- ラベル -->
    <text x="126" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">エージェント</text>
    <text x="126" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（構造と配置を決める）</text>

    <text x="324" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">型付きJSON</text>
    <text x="324" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（見た目の判断も入る）</text>

    <text x="534" y="288" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">Archify</text>
    <text x="534" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（検証して組み立てる）</text>

    <text x="709" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">HTML</text>
    <text x="709" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（1枚で完結）</text>

    <text x="400" y="390" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 同じJSONからは、毎回同じHTMLが出る 〜
    </text>
  </svg>
</figure>

キャプション:

決まっているのは **JSON から先**です。同じ JSON からは毎回同じ HTML が出ます。逆に、図の形そのものはエージェントが決めるので、頼み方が変わればそちらは変わります。

## どんなときに使うか

### リポジトリの構成を、口伝えではなく形で残したいとき

新しく入った人に構成を説明するたび、同じ話を口で繰り返すことになります。図に落としておけば済むのですが、手で描くと更新されなくなります。リポジトリを読ませて図を出せるなら、更新のたびに作り直すという手が取れます。

### 変更の前後を、レビューで並べて見せたいとき

構成が変わる変更をレビューに出すとき、差分だけを見ても全体がどう変わったのか伝わりません。Before / Delta / After の比較が用意されていて、追加・削除・変更・移動・線の引き直しを事実として並べてくれます。ただし出るのはそこまでで、影響やリスク、マージして安全かの判断はしないと明記されています。

## 注意点

**やらないことが明記されています。** README には、Mermaid の自動読み取り、汎用の自動レイアウト、ホスティングでの共有、画面上での編集が「いまのところ意図的に対象外」と書かれています。既存の Mermaid をそのまま流し込みたい、という用途には向きません。

**まだ新しいプロジェクトです。** 開発の速度が速い分、JSON の書き方や設定が変わる可能性があります。エージェントのスキルという形なので、使っているエージェント側の仕様変更にも影響を受けます。

ライセンスは MIT で、商用利用の妨げになる条項はありません。
