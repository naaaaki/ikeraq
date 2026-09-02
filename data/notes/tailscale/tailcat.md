---
updated: 2026-09-02
image:
image_alt:
---

## 見出しの一文

アカウントも管理サーバも無しで、2台のあいだに暗号化トンネルを張る

## どういうものか

Tailscale が自分たちの部品を組み替えて作った、netcat のようなコマンドです。標準入出力をつなぐ、ポートを転送する、SSH で入る、ファイルを送る、SOCKS5 のプロキシにする、といったことができます。特徴は**Tailscale のアカウントが要らないこと**で、root 権限もネットワーク設定の変更も要りません。

仕組みの中心は、Tailscale を**データプレーンとコントロールプレーンに分けて、後者を使っていない**ところにあります。ふだんの Tailscale では、「誰と誰がつながってよいか」「相手はどこにいるか」を管理サーバ（コントロールプレーン）が教えます。tailcat はその役目を**人間の手渡し**に置き換えました。サーバ側でコマンドを打つと接続トークンが1つ表示されるので、それをチャットなり口頭なりで相手に渡す。トークンの中には公開鍵と、どの DERP 中継にいるかが入っています。

つなぎ方は2段階です。まずクライアントが DERP 中継越しに合図を送り、サーバが応じて、互いを WireGuard のピアとして設定します。同時に NAT 越えの穴あけを試み、成功すれば通信は直接の経路に切り替わります。失敗しても DERP が中継として残るので、接続そのものは維持されます。暗号化・トンネル・NAT 越えといった重い部分は、Tailscale 本体と同じ実装がそのまま使われています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="接続トークンを人が手渡し、DERP中継を通って2台が出会い、NATに穴を開けて直接のトンネルに切り替わる、という4段階の流れを横一列に描いた図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="62" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      相手の居場所は<tspan style="fill: #1E5A48;">人が手渡す</tspan>。あとは2台だけで通す
    </text>

    <!-- 1. 接続トークン -->
    <rect x="60" y="150" width="128" height="100" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="7 5"/>
    <rect x="82" y="180" width="84" height="8" rx="4" fill="#1E5A48" opacity=".55"/>
    <rect x="82" y="198" width="62" height="8" rx="4" fill="#1E5A48" opacity=".55"/>
    <rect x="82" y="216" width="72" height="8" rx="4" fill="#1E5A48" opacity=".55"/>

    <path d="M196 200 H228" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M228 189 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 2. DERP中継 -->
    <rect x="244" y="150" width="128" height="100" rx="10" fill="#1E5A48"/>
    <circle cx="308" cy="188" r="11" fill="#FFFFFF"/>
    <path d="M282 220 q26 -22 52 0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M270 234 q38 -32 76 0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".55"/>

    <path d="M380 200 H412" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M412 189 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 3. NATの穴あけ -->
    <rect x="428" y="150" width="128" height="100" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="450" y="172" width="84" height="10" rx="3" fill="#17160F" opacity=".18"/>
    <rect x="450" y="188" width="84" height="10" rx="3" fill="#17160F" opacity=".18"/>
    <rect x="450" y="204" width="84" height="10" rx="3" fill="#17160F" opacity=".18"/>
    <rect x="450" y="220" width="84" height="10" rx="3" fill="#17160F" opacity=".18"/>
    <circle cx="492" cy="201" r="19" fill="#FFFFFF"/>
    <circle cx="492" cy="201" r="19" fill="none" stroke="#1E5A48" stroke-width="3.5"/>

    <path d="M564 200 H596" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M596 189 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 4. 直接のトンネル -->
    <rect x="612" y="150" width="128" height="100" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="632" y="184" width="32" height="32" rx="6" fill="#17160F" opacity=".18"/>
    <rect x="688" y="184" width="32" height="32" rx="6" fill="#17160F" opacity=".18"/>
    <path d="M666 200 H686" stroke="#1E5A48" stroke-width="6" stroke-linecap="round"/>

    <!-- ラベル -->
    <text x="124" y="292" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">接続トークン</text>
    <text x="124" y="314" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（人が手で渡す）</text>

    <text x="308" y="292" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">DERP</text>
    <text x="308" y="314" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（まずここで出会う）</text>

    <text x="492" y="292" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">NAT越え</text>
    <text x="492" y="314" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（穴をあける）</text>

    <text x="676" y="292" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">直接つながる</text>
    <text x="676" y="314" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（失敗してもDERPが残る）</text>

    <text x="400" y="392" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 中継は借りる。ただし「誰とつなぐか」を決める管理サーバは無い 〜
    </text>
  </svg>
</figure>

キャプション:

いちばん左の「人が手で渡す」が、ふつうの Tailscale なら管理サーバがやっている仕事です。そこを人の手に戻したぶん、アカウントも設定も要らなくなっています。中央の DERP は Tailscale が運営しているものなので、「サーバを一切使わない」わけではありません。

## どんなときに使うか

### 一度きりのために、環境を汚したくないとき

別の場所にある1台へ、いまだけファイルを送りたい。VPN を入れてアカウントを作って、終わったら消す——という手順のほうが本題より重くなることがあります。root も設定変更も要らず、鍵も既定では使い捨てなので、済んだら閉じるだけで元に戻ります。

### 相手のアカウントを前提にできないとき

社外の人や、自分の管理下にない環境が相手だと、「まず同じサービスに登録してもらう」が最初の壁になります。tailcat は渡すものがトークン1つなので、その壁を飛ばせます。

## 注意点

**互換性の約束がありません。** README には「Go の API、CLI のフラグと出力、通信のフォーマットは、すべて変わる可能性がある」と書かれています。手作業で使うぶんには困りませんが、スクリプトに組み込んで長く回す用途は想定されていません。

**公開の DERP 中継に頼り切らないこと。** 稼働率や速度の目標は無く、いつでも理由を問わず利用を止めることがある、と明記されています。穴あけに失敗した場合の経路がこれなので、うまく直接つながらない環境では速度が出ません。

**トークンの渡し方が、そのまま安全性になります。** 管理サーバが「誰とつなぐか」を判断しない設計なので、トークンが漏れた相手＝つながれる相手です。渡す経路は選んだほうがよいものです。

ライセンスは BSD-3-Clause で、商用利用の妨げになる条項はありません。
