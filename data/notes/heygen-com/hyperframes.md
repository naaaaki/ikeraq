---
updated: 2026-09-09
image:
image_alt:
---

<!-- ============================================================
  heygen-com/hyperframes
  https://github.com/heygen-com/hyperframes
  Write HTML. Render video. Built for agents.
  TypeScript / Apache-2.0 / スター 47,715
============================================================ -->


## 見出しの一文

動画をHTMLで書けるようにして、同じ入力からは必ず同じMP4を出す


## どういうものか

動画を自動で作らせようとすると、たいてい編集ソフト独自の保存形式が壁になる。エージェントに書かせるにも、人が差分を読むにも向いていない。HyperFrames の答えは「**動画を1枚の HTML として書く**」。映像・見出し・音楽を、それぞれ `<video>` `<h1>` `<audio>` としてそのまま置き、いつ出していつ消えるかを `data-start`（開始秒）や `data-duration`（長さ）といった属性で指定する。重なりの前後関係もトラック番号の属性で決める。React も専用の書き出しも要らず、`index.html` はブラウザでそのまま再生できる。

肝は動きの付け方にある。ふつうのウェブのアニメーションは「時計」で進むので、コマ単位で正確に切り出そうとすると噛み合わない。HyperFrames が求めるのは**任意の時点に頭出しできる形**で書くこと。たとえば GSAP なら、止めた状態のタイムラインを作って所定の場所に登録しておく。そうしておくと変換のとき、書き出し側は「0.0秒の絵を出せ」「0.033秒の絵を出せ」と**1コマずつ頭出しして写真を撮る**ことができる。撮った絵は FFmpeg で MP4 に固められる。再生時間に依存しないので、**同じ入力からは同じ動画が出る**。CI に載せる、差分を回帰テストする、といった使い方が最初から想定されている。GSAP のほか CSS アニメーション、Lottie、Three.js、Anime.js、WAAPI が差し替え可能な接続部として並んでいる。

もう一つの柱が**エージェント向けの手順書**。20個のスキルが同梱され、`/hyperframes` という案内役をまず読ませる作りになっている。そこから「製品紹介の動画」「プルリクエストを解説する動画」「既存のトーク動画に字幕を焼く」「音楽に合わせて刻む」といった目的別の手順に振り分けられ、必要になったものだけを取りに行く。動画の作り方の型（構成を決める→HTMLを書く→動きを繋ぐ→素材を入れる→検査→試写→書き出し）を、汎用のウェブの資料からは学べない部分ごと教える位置づけだ。トランジションや字幕、グラフといった部品は `hyperframes add` で取り込める一覧が用意されている。


## 図

<svg viewBox="0 0 800 405" role="img" aria-label="HyperFrames の仕組みの図。左に1枚のHTMLがあり、映像・見出し・音楽に開始秒と長さの属性が付いている。中央では、動きが頭出しできる形で書かれているため、ヘッドレスChromeが0.000秒、0.033秒、0.067秒と1コマずつ頭出しして絵を撮る。右でFFmpegがMP4に固める。下に、時計で再生していないので同じ入力からは同じ動画が出ると添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="hf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="405" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">再生するのではなく<tspan fill="#1E5A48">1コマずつ頭出し</tspan>する</text>

  <rect x="18" y="112" width="192" height="182" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="114" y="148" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">1枚の HTML</text>
  <text x="114" y="170" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（そのまま開ける）</text>
  <text x="114" y="204" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">映像・見出し・音楽</text>
  <text x="114" y="230" text-anchor="middle" font-size="12" fill="#1E5A48" font-weight="700">開始秒と長さを属性で</text>
  <text x="114" y="258" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">動きは頭出しできる形で</text>
  <text x="114" y="282" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">（GSAP / CSS / Lottie ほか）</text>

  <line x1="210" y1="200" x2="252" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#hf-arrow)" />

  <rect x="260" y="112" width="272" height="182" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="396" y="148" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">画面なしのブラウザ</text>
  <text x="396" y="170" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（時計では進めない）</text>
  <rect x="284" y="188" width="70" height="46" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="319" y="209" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.85">0.000秒</text>
  <text x="319" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">を撮る</text>
  <rect x="361" y="188" width="70" height="46" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="396" y="209" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.85">0.033秒</text>
  <text x="396" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">を撮る</text>
  <rect x="438" y="188" width="70" height="46" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="473" y="209" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.85">0.067秒</text>
  <text x="473" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">を撮る</text>
  <text x="396" y="270" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">その時点の絵を指定して取り出す</text>

  <line x1="532" y1="200" x2="574" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#hf-arrow)" />

  <rect x="582" y="112" width="200" height="182" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="682" y="164" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">MP4 に固める</text>
  <text x="682" y="186" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（FFmpeg）</text>
  <text x="682" y="222" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">同じ入力 → 同じ動画</text>
  <text x="682" y="250" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">CI に載せられる</text>
  <text x="682" y="272" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">差分を検査できる</text>

  <text x="400" y="368" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">「頭出しできるように書く」という制約が、そのまま結果の再現性になっている</text>
</svg>

キャプション: 動画をコードで書けるようにしただけではなく、**毎回同じ結果になること**を設計の中心に置いている。エージェントに任せられる根拠がここにある。


## どんなときに使うか

### 文言や数字だけ差し替えた動画を、何度も作りたいとき

素材の一覧や機能紹介のように、中身が入れ替わるだけの動画が定期的に要る場合。HTML なので、**どこを変えたのかが差分として残る**。誰が作っても同じところに落ちる。

### エージェントに動画を作らせたいが、専用形式で詰まっているとき

エージェントは HTML なら普通に書ける。コマンドも対話を求めない作りなので、手順の中に組み込みやすい。プルリクエストから解説動画を作る、といった開発寄りの用途が手順書として最初から用意されている。


## 注意点

**動きの書き方に制約がある。** 「頭出しできるように書く」という条件は、ふだんのウェブのアニメーションの書き方と同じではない。時計に依存した書き方をすると、試写では動いて書き出しで崩れる、ということが起きうる。README にも接続部ごとの注意として案内があり、ここは学習が要るところ。

**Node.js 22以上と FFmpeg が必要。** 書き出しは手元か Docker、あるいは AWS Lambda に分散させる道が用意されている。長い動画をたくさん作るなら、書き出しにかかる時間と計算資源は先に見ておきたい。

**開発目的で丸ごと複製すると重い。** 回帰テスト用の完成動画が Git LFS で約240MB 入っている。ソースだけ要るなら LFS の中身を飛ばす方法が README に書かれている。

**Remotion との違いは書き方の思想。** 作者自身が Remotion に影響を受けたと明記したうえで、あちらは React 部品、こちらは素の HTML、と整理している。すでに React で組んだ資産があるなら、移行用の手順（一方向）はあるが、乗り換えの是非は別に判断したほうがいい。ライセンスの違い（Apache-2.0 と、Remotion 独自のライセンス）は、商用で使うなら確認しておく点になる。

**HeyGen という会社の公開物である点。** クラウドでの書き出しは同社の提供として案内されている。開いている部分と有料の部分の境目は、導入前に見ておきたい。
