---
updated: 2026-09-09
image:
image_alt:
---

<!-- ============================================================
  jo-inc/camofox-browser
  https://github.com/jo-inc/camofox-browser
  Stealth headless browser for AI agents
  JavaScript / MIT / スター 10,453
============================================================ -->


## 見出しの一文

エージェントに本物のブラウザを渡し、ページを番号付きの骨組みにして返す


## どういうものか

看板のとおり、これは**検知をかわすためのブラウザ**である。先に断っておくと、弾かれないことと、取得してよいことは別の話だ。相手サイトの利用規約や `robots.txt`、地域ごとの法令はこの道具では解決しないので、対象ごとに自分で確かめる必要がある。

そのうえで中身を見ると、エージェントに Web を見せようとするときの二つの壁に答えている。ひとつは**弾かれること**。Playwright や画面なしの Chrome は特徴が知られていて、見分けられて止められる。しかも「見分けられないようにする拡張」を入れると、その拡張自体が新しい目印になってしまう。camofox-browser が土台に使っている Camoufox は、この問題を Firefox の**C++の実装そのものを書き換える**ことで解いている。CPU のコア数、WebGL の描画装置名、音声処理、画面の大きさ、WebRTC といった、正体がばれる値を **JavaScript から見える前の段階で**差し替えてしまう。上から被せる細工がないので、細工の跡が見えない。

もうひとつの壁は**ページが重すぎること**。生の HTML をそのままモデルに読ませれば、装飾やスクリプトで場所を食い尽くす。このプロジェクトはそこに手を入れていて、返すのは HTML ではなく**支援技術向けの構造（アクセシビリティ・スナップショット）**。README によれば生の HTML より9割ほど小さい。そのうえで、押せる要素や入力欄に `e1` `e2` `e3` という**通し番号**を振って返す。エージェントは座標や CSS の指定を組み立てる必要がなく、「e7 を押す」「e3 に打ち込む」と番号で指すだけで済む。大きいページはページ送りで分割して受け取れる。

全体は **REST の API サーバー**として動く。タブを作る・進む・押す・打つ・巻物のように送る・画面写真を撮る、といった操作が HTTP で呼べて、OpenClaw 向けのプラグインも用意されている。実運用側の作り込みも厚く、ブラウザは必要になるまで立ち上げず、使わなくなれば落とす（待機中は 40MB 程度）ので、Raspberry Pi や小さな VPS に相乗りさせる前提で設計されている。利用者ごとに Cookie と保存領域を分ける、Cookie ファイルを流し込んでログイン済みの状態で見る、noVNC 経由で人間が手でログインしてその状態をエージェントに引き継ぐ、住宅用プロキシを通して地域と時刻帯を自動で合わせる、といった機能が並ぶ。Google 検索・YouTube 検索・Amazon 検索など、よく使う検索は `@google_search` のような短縮の呼び出しにまとめられている。


## 図

<svg viewBox="0 0 800 405" role="img" aria-label="camofox-browser の仕組みの図。左のエージェントがREST APIで指示を送る。中央のサーバーは、書き換えたFirefoxで本物らしく振る舞い、ページを装飾を落とした骨組みに変え、押せる要素にe1・e2・e3の番号を振る。右のエージェントには番号付きの一覧が返り、番号を指して操作する。下に、生のHTMLではなく骨組みを返すので読む量が減ると添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="405" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">ページを<tspan fill="#1E5A48">番号付きの骨組み</tspan>にして返す</text>

  <rect x="16" y="112" width="158" height="180" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="95" y="152" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">エージェント</text>
  <text x="95" y="174" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（HTTPで頼む）</text>
  <text x="95" y="212" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">このページを開いて</text>
  <text x="95" y="240" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">e7 を押して</text>
  <text x="95" y="268" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">e3 に打ち込んで</text>

  <line x1="174" y1="200" x2="216" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#cf-arrow)" />

  <rect x="224" y="112" width="304" height="180" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="376" y="144" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ブラウザサーバー</text>
  <rect x="242" y="162" width="268" height="52" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="376" y="183" text-anchor="middle" font-size="12.5" font-weight="700" fill="#17160F">書き換えた Firefox で開く</text>
  <text x="376" y="202" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">正体がばれる値は、JSから見える前に差し替え</text>
  <rect x="242" y="224" width="268" height="52" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="376" y="245" text-anchor="middle" font-size="12.5" font-weight="700" fill="#17160F">装飾を落として番号を振る</text>
  <text x="376" y="264" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">押せる要素に e1 / e2 / e3 …</text>

  <line x1="528" y1="200" x2="570" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#cf-arrow)" />

  <rect x="578" y="112" width="206" height="180" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="681" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">返ってくるもの</text>
  <text x="681" y="184" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">番号付きの一覧</text>
  <text x="681" y="212" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">e1 検索欄</text>
  <text x="681" y="234" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">e2 検索ボタン</text>
  <text x="681" y="256" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">e3 ログイン</text>
  <text x="681" y="280" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">（生のHTMLより9割小さい）</text>

  <text x="400" y="368" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">座標もCSSの指定も組み立てずに済むので、指し間違いが起きにくい</text>
</svg>

キャプション: 弾かれない工夫と同じくらい、**読ませる量を減らす工夫**に手が入っている。エージェント向けという看板はここに出ている。


## どんなときに使うか

### エージェントに実際のサイトを見せたいのに、途中で止められるとき

Playwright で組んだ手順が、ある日から通らなくなった、というときの乗り換え先。ただし API の互換品ではなく、`localhost:9377` に立つ REST サーバーなので、**呼び出し側は HTTP に書き直すことになる**。

### ログインが要るページを、エージェントに続けて見せたいとき

人が noVNC の画面で手でログインし、その状態を書き出してエージェントに引き継ぐ道が用意されている。**認証だけ人がやって、あとは任せる**という分担ができる。


## 注意点

**最初の導入は軽くない。** 初回起動時に Camoufox の本体（約300MB）を取得する。README には、Playwright のダウンロード抑止を設定している環境で取得が黙って飛ばされ、実行時に落ちる件への対処や、外部に置いた実行ファイルを指定する方法まで書かれている。閉じた環境に入れるなら、この節を先に読んでおきたい。

**動作情報が既定で外に出る。** クラッシュやハングの匿名の報告が自動で送られる設計で、**既定で有効**。ここは中身を分けて読む必要がある。パスや引数、トークン、IP、ページの中身は送らないと書かれている一方、**Google や Amazon のようなよく知られたドメインはそのまま送られる**（どのサイトで失敗したかを集めるのが目的のため）。伏せられるのは、それ以外のドメインをハッシュ化したものだけだ。`CAMOFOX_CRASH_REPORT_ENABLED=false` で止められ、送り先を自分の場所に変えることもできる。

**個人サービスの副産物という出自。** 作者は「jo」という個人向けAIエージェントのチームで、README の冒頭にその案内が入る。悪いことではないが、単体のプロジェクトとしての長期の維持がどうなるかは、別に見ておいたほうがいい。

ライセンスは MIT。
