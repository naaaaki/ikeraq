---
updated: 2026-10-07
image:
image_alt:
---

<!-- ============================================================
  pingdotgg/t3code
  https://github.com/pingdotgg/t3code
  (説明なし)
  TypeScript / MIT / スター 25,630
  

============================================================ -->


## 見出しの一文

手元の Claude Code や Codex を、スマホやブラウザから動かす


## どういうものか

パソコンに入れてある Claude Code、Codex、Cursor、Grok Build、OpenCode、Google Antigravity といったコーディングエージェントを、1つの画面から動かすためのアプリだ。作者は「エージェントの操作盤（agent harness control surface）」と呼んでいる。エージェントそのものを置き換えるのではなく、手元で入れてログインしてあるエージェントを、それぞれの契約のまま呼び出す。

パソコンで T3 Code のサーバーを動かし、同じパソコンのデスクトップアプリ（Electron 製）やブラウザから使うのが基本だ。そのうえで、スマホ（iOS・Android のアプリ）や別のパソコンからもつなげる。離れた場所からは、T3 Connect のアカウントでサインインすれば、ルーターの転送設定をしなくて済む。ほかに Tailscale や SSH でつなぐ方法もあり、同じ LAN の中なら QR コードやペアリング用のリンクで直接つなぐこともできる。

作者は README で、売りたいものは何も無いと書いている。Codex のデスクトップアプリや Conductor、Claude Desktop、Cursor Glass を参考にしたが、どれも満足できなかったので作った、という経緯だ。重視したのは速さと、離れた場所から使えることと、開かれていること。ライセンスは MIT で、自分たちが方向を誤ったときには、フォークして作り直せるようにしておきたいとも書いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「手元のエージェントを、どこからでも動かす」とある図。左に「スマホ（iOS・Android アプリ）」「ブラウザ（ウェブアプリ）」「別のパソコン（デスクトップアプリ）」があり、どれも矢印で中央の「T3 Code（あなたのパソコンで動く）」につながり、そこから「Claude Code・Codex など（それぞれの契約のまま）」へ矢印が伸びる。下に「離れた場所からは T3 Connect など、同じネットワークの中ならペアリングでつなぐ」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="t3c-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">手元のエージェントを、<tspan fill="#1E5A48">どこからでも</tspan>動かす</text>

  <rect x="30" y="100" width="190" height="70" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="125" y="130" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">スマホ</text>
  <text x="125" y="154" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（iOS・Android アプリ）</text>

  <rect x="30" y="190" width="190" height="70" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="125" y="220" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ブラウザ</text>
  <text x="125" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ウェブアプリ）</text>

  <rect x="30" y="280" width="190" height="70" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="125" y="310" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">別のパソコン</text>
  <text x="125" y="334" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（デスクトップアプリ）</text>

  <line x1="226" y1="140" x2="284" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#t3c-arrow)" />
  <line x1="226" y1="225" x2="284" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#t3c-arrow)" />
  <line x1="226" y1="310" x2="284" y2="250" stroke="#1E5A48" stroke-width="4" marker-end="url(#t3c-arrow)" />

  <rect x="290" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="390" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">T3 Code</text>
  <text x="390" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（あなたのパソコンで動く）</text>

  <line x1="496" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#t3c-arrow)" />

  <rect x="560" y="170" width="210" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="665" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Claude Code・Codex など</text>
  <text x="665" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（それぞれの契約のまま）</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">離れた場所からは T3 Connect など、同じネットワークの中ならペアリングでつなぐ</text>
</svg>

キャプション: エージェントが動くのは、T3 Code のサーバーを置いたパソコン。T3 Code は、そこへ外からつなぐための窓口になる。


## どんなときに使うか

### 長い作業をエージェントに任せたまま、席を離れたいとき

動かしているパソコンを起動したままにしておけば、スマホのアプリからつないで指示を出せる。

### Claude Code と Codex など、複数のエージェントを使い分けているとき

それぞれの契約を使ったまま、1つの画面から動かせる。


## 注意点

**まだごく初期の段階。** README 自身が「バグがあるものと思ってほしい」と書いている。外からの貢献は今のところほぼ受け付けておらず、小さな修正なら検討されることもあるが、大きな機能は受け付けないとしている。

**エージェントは別に入れる。** T3 Code だけでは動かない。Claude Code や Codex などを少なくとも1つ入れて、ログインしておく必要がある（Antigravity だけは、T3 Code の設定画面から入れてサインインできる）。

**つなぐ先のパソコンは動かし続ける必要がある。** 離れた場所から使っている間、サーバーを動かしているパソコンが止まっていたり、つながらない状態になっていたりすると使えない。
