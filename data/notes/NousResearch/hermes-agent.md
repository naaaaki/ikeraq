---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

一度うまくいったやり方を手順として書き出し、次から使い回す

## どういうものか

Nous Research が作っている AI エージェントです。README は、これを「学習のループを内蔵した唯一のエージェント」だと説明しています。**やったことを次に持ち越す仕組みが最初から入っている**、という主張です。

込み入った作業を片づけたあと、その手順を**再利用できる「スキル」として自分で書き出します**。置き場所は `~/.hermes/skills/` で、形式は agentskills.io という共通の規格に合わせてあります。作りっぱなしにはならず、実際に使いながら中身が磨かれていく作りです。過去のやりとりのほうは、セッションの記録を全文検索し、要約して引き出します。同じ相手と何度もやりとりするうちに、その人に合わせた理解が積み上がっていく、という説明がされています。

動かす先も入口も固定されていません。モデルは Nous Portal、OpenRouter、OpenAI などから選べて、コマンド1つで切り替えられます。動かす先はローカル、Docker、SSH、Modal などから選べます。入口は CLI のほか、Telegram、Discord、Slack、WhatsApp、Signal に対応していて、**同じ1体のエージェントに複数の入口から話しかけられます**。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="仕事を頼む、こなす、うまくいった手順をスキルとして書き出す、次に頼むときはそれを使う、という4段階が時計回りに円を描いて繰り返される図。円の中心にスキルの置き場所がある。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="52" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      一周するたびに、<tspan style="fill: #1E5A48;">手持ちが増える</tspan>
    </text>

    <!-- 円弧（時計回り） -->
    <path d="M400 126 A 112 112 0 0 1 512 238" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M487.0 166.6 L470.7 160.2 L480.6 150.3 Z" fill="#1E5A48"/>
    <path d="M512 238 A 112 112 0 0 1 400 350" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M471.4 325.0 L477.8 308.8 L487.7 318.7 Z" fill="#1E5A48"/>
    <path d="M400 350 A 112 112 0 0 1 288 238" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M313.0 309.4 L329.3 315.8 L319.4 325.7 Z" fill="#1E5A48"/>
    <path d="M288 238 A 112 112 0 0 1 400 126" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M328.6 151.0 L322.2 167.2 L312.4 157.4 Z" fill="#1E5A48"/>

    <!-- 4つの節 -->
    <circle cx="400" cy="126" r="28" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="386" y="118" width="28" height="6" rx="3" fill="#17160F" opacity=".22"/>
    <rect x="386" y="130" width="18" height="6" rx="3" fill="#17160F" opacity=".22"/>

    <circle cx="512" cy="238" r="28" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <path d="M498 238 l9 10 20 -21" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

    <circle cx="400" cy="350" r="28" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="6 5"/>
    <rect x="386" y="340" width="28" height="6" rx="3" fill="#1E5A48" opacity=".55"/>
    <rect x="386" y="352" width="28" height="6" rx="3" fill="#1E5A48" opacity=".55"/>

    <circle cx="288" cy="238" r="28" fill="#1E5A48"/>
    <path d="M278 232 h20 M278 242 h14" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>

    <!-- 中心 -->
    <rect x="325" y="216" width="150" height="46" rx="10" fill="#1E5A48" opacity=".12"/>
    <text x="400" y="237" text-anchor="middle" style="font-family: var(--mono); font-size: 14px; fill: #1E5A48;">~/.hermes/skills/</text>
    <text x="400" y="255" text-anchor="middle" style="font-family: var(--jp); font-size: 13px; fill: #6E6A5F;">（貯まっていく場所）</text>

    <!-- ラベル -->
    <text x="400" y="86" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">頼む</text>
    <text x="550" y="244" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">こなす</text>
    <text x="400" y="396" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">手順として書き出す</text>
    <text x="250" y="244" text-anchor="end" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">次はそれを使う</text>

    <text x="400" y="430" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 貯まるのはモデルの賢さではなく、自分で読める手順のファイル 〜
    </text>
  </svg>
</figure>

キャプション:

ふつうのエージェントだと、この輪は「頼む → こなす」で切れて、次のときは同じ場所からやり直しになります。下半分がつながっているかどうかが違いです。

## どんなときに使うか

### 同じ手順を、毎回ゼロから説明し直しているとき

「まずこのファイルを見て、次にこの形式で出して」という指示を毎回書いているなら、その説明ごと手順として残す対象になります。書き出されたスキルは共通の規格に沿っているので、ほかの道具から使える可能性もあります。

### 手元の端末に縛られたくないとき

動かす先を Docker や SSH の先、Modal などから選べます。入口も複数用意されているので、パソコンの前にいないときは別の経路から同じエージェントに続きを頼む、という使い方ができます。

## 注意点

**「学習」の中身を取り違えないこと。** ここで貯まるのは、モデルの重みではなく**手順を書いたファイル**です。`~/.hermes/skills/` に置かれるので、中身は自分で読めますし、消すこともできます。モデルそのものが賢くなるわけではありません。

**Windows ではウイルス対策ソフトに引っかかることがあります。** README は、同梱している `uv.exe` が機械学習型の検知エンジンで誤検知される、と書いています。対処として `%LOCALAPPDATA%\hermes\bin` を除外に入れることを挙げています。導入時に止まったら、まずここを疑う話です。

**貯まる場所がそのまま持ち出しの対象になります。** 過去のやりとりを検索して引き出す作りなので、記録は手元に残り続けます。仕事で使うなら、何が残っているかを一度見ておく類のものです。

ライセンスは MIT で、商用利用の妨げになる条項はありません。
