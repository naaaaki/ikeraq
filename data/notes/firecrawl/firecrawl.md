---
updated: 2026-09-04
image:
image_alt:
---

## 見出しの一文

「取れなかった」で終わるページを取り切って、そのまま読める形で返す

## どういうものか

Web ページを取ってきて、**そのまま言語モデルに渡せる形**にして返す仕組みです。返る形式は Markdown・HTML・JSON・スクリーンショットから選べます。裏で動いているものは自分で書けなくもないのですが、実際に書くと手が止まるのは中身の取り出しではなく、**取れない理由のほう**です。

そこが引き受けている範囲です。JavaScript で後から描かれるページ、プロキシの切り替え、接続の回数制限、そして大量のページを取るときの順番と割り振り——このあたりを内側で処理し、呼ぶ側には結果だけが返ります。入口は用途で分かれていて、1ページだけ取る、サイトを丸ごとたどる、ドメイン内の URL を一覧にする、Web を検索して結果の本文まで取る、といった単位で呼べます。ページを操作してから取る（押す・スクロールする・入力する）指定や、目的を伝えて必要な情報を集めさせる使い方も用意されています。

自分のサーバーで動かす版と、提供元のクラウドを使う版があります。呼び出し用のライブラリは Python・Node.js・Go・Java・Ruby・.NET・PHP・Rust・Elixir と幅広く揃っています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="Webページが、JavaScriptの実行・プロキシ・回数制限・大量取得の割り振りという4つの障害の層をFirecrawlが通り抜けて、Markdownなどの整った形で返る、という図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="54" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      手間なのは取り出しではなく、<tspan style="fill: #1E5A48;">取れない理由</tspan>
    </text>

    <!-- 生のページ -->
    <rect x="36" y="160" width="130" height="120" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="52" y="176" width="98" height="14" rx="3" fill="#17160F" opacity=".3"/>
    <rect x="52" y="198" width="60" height="8" rx="4" fill="#17160F" opacity=".16"/>
    <rect x="52" y="212" width="82" height="8" rx="4" fill="#17160F" opacity=".16"/>
    <rect x="52" y="230" width="44" height="30" rx="3" fill="#17160F" opacity=".12"/>
    <rect x="102" y="230" width="48" height="14" rx="3" fill="#17160F" opacity=".12"/>

    <path d="M178 220 H206" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M206 209 l16 11 -16 11 z" fill="#1E5A48"/>

    <!-- 4つの壁 -->
    <rect x="234" y="140" width="34" height="160" rx="6" fill="#1E5A48" opacity=".22"/>
    <rect x="292" y="140" width="34" height="160" rx="6" fill="#1E5A48" opacity=".36"/>
    <rect x="352" y="140" width="34" height="160" rx="6" fill="#1E5A48" opacity=".5"/>
    <rect x="412" y="140" width="34" height="160" rx="6" fill="#1E5A48" opacity=".64"/>

    <text x="339" y="122" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">JS描画・プロキシ・回数制限・大量取得の割り振り</text>

    <!-- 貫く線 -->
    <path d="M222 220 H478" stroke="#1E5A48" stroke-width="5" stroke-linecap="round"/>
    <path d="M478 208 l20 12 -20 12 z" fill="#1E5A48"/>

    <!-- 整った出力 -->
    <rect x="500" y="150" width="264" height="140" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="522" y="172" width="120" height="12" rx="3" fill="#1E5A48" opacity=".8"/>
    <rect x="522" y="196" width="220" height="8" rx="4" fill="#17160F" opacity=".2"/>
    <rect x="522" y="212" width="196" height="8" rx="4" fill="#17160F" opacity=".2"/>
    <rect x="522" y="228" width="212" height="8" rx="4" fill="#17160F" opacity=".2"/>
    <rect x="522" y="252" width="84" height="8" rx="4" fill="#17160F" opacity=".2"/>
    <text x="632" y="272" text-anchor="middle" style="font-family: var(--jp); font-size: 13px; fill: #6E6A5F;">Markdown / JSON / 画像</text>

    <!-- ラベル -->
    <text x="101" y="326" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">生のページ</text>
    <text x="101" y="348" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（読めるとは限らない）</text>

    <text x="339" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #1E5A48;">ここを引き受ける</text>

    <text x="632" y="326" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">そのまま渡せる形</text>
    <text x="632" y="348" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（整形済み）</text>

    <text x="400" y="414" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 1ページなら自分で書ける。千ページで壁になるのはこの4つ 〜
    </text>
  </svg>
</figure>

キャプション:

**壁の位置が要点です。** 取得の仕組みを自分で書くと、この4つに順番にぶつかり、そのたびに本題から離れます。線が真っ直ぐ通っているぶんが、そのまま浮く時間です。

## どんなときに使うか

### 試作は動いたのに、対象を増やしたら崩れたとき

1ページなら数行で取れます。**壊れるのは対象が増えてから**で、JavaScript で描かれるページ、弾かれる接続、途中で止まるクロールが順に出てきます。ここを自分で保守し続けるかどうかの判断になります。

### サイトのどこに何があるか分からないとき

ドメイン内の URL を一覧にする使い方があるので、丸ごと取る前に中身の見当を付けられます。**要らないページを取りに行かない**ぶん、時間も相手のサーバーへの負荷も減ります。

## 注意点

**ライセンスが AGPL-3.0 です。ここが一番大きな注意点です。** 自分のサーバーで動かす版はこのライセンスで、**改変して、それをネットワーク越しに使わせる場合、利用者に対して対応するソース一式を提供する義務が生じます。** 改変した差分だけでは足りません。社内で閉じて使うぶんには問題になりにくいものの、自社サービスに組み込んで外部に提供する形だと、ここが効いてきます。なお呼び出し用のライブラリと**一部の**画面部品は MIT ですが、どこがどちらかはディレクトリごとに `LICENSE` を見て確かめること、と README に書かれています。**判断が必要なのは、本体を自分で動かす場合です。**

**取ってよいかどうかは、最後は使う側の判断です。** 既定では `robots.txt` を尊重すると README にあり、そのうえで、相手サイトの方針を守る責任は利用者にあるとも明記されています。技術的に取れることと、取ってよいことは別です。

**クラウド版は料金がかかります。** API キーを取って呼ぶ形なので、対象が増えるほど費用も増えます。自前で動かすか、払って任せるかは、AGPL の話と合わせて決めることになります。
