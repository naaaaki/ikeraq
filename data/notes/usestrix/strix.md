---
updated: 2026-09-18
image:
image_alt:
---

<!-- ============================================================
  usestrix/strix
  https://github.com/usestrix/strix
  Open-source AI penetration testing tool to find and fix your app's vulnerabilities.
  Python / Apache-2.0 / スター 63,000台
============================================================ -->


## 見出しの一文

攻撃を実際に試して、通った経路を攻撃例つきで示す


## どういうものか

Strix は、アプリに対して**侵入テストを自分で実行する AI エージェント**をまとめたもの。README は「本物の攻撃者と同じように、コードを実際に動かして脆弱性を見つけ、実際に成り立つ攻撃例で裏を取る」と説明している。狙っているのは、静的解析の**誤検知**と、人手による侵入テストの**重さ**のあいだにある空白だ。書かれている言語は Python、ライセンスは Apache-2.0。

動かすには Docker と、自分で用意した LLM の API キーが要る。最初に動かすときに、作業用の隔離環境（Docker のイメージ）が自動で取り込まれる。エージェントが持たされている道具は、通信を横取りして書き換える proxy、ブラウザの操作、シェル、攻撃例を書いて試すための Python の実行環境、対象の洗い出し、静的解析と動的解析、そして見つけたものを CVSS や OWASP の分類付きで貯める置き場。README はこれを「専門の侵入テスターが使うのと同じ道具立て」と書いている。

対象の渡し方は、手元のディレクトリ、GitHub のリポジトリの URL、動いているアプリの URL、OpenAPI や Postman の定義ファイルなど。複数を同時に渡して、ソースと稼働中のアプリを突き合わせることもできる。エージェントは1体ではなく、偵察・攻撃・その後の掘り下げに分かれた**複数体が手分けし、見つけたものを共有する**形になっている。複数の対象にまたがる並行実行も挙げられている。結果は実行するたびにディスクへ書き出され、`strix view` で手元のダッシュボードとして開ける。対話画面を使わないモード（`-n`）では、脆弱性が見つかると終了コードが 0 以外になるので、プルリクエストごとに CI で回す使い方も README に載っている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「当ててみて、通った経路を残す」とある図。左に「対象」（コード、動いているアプリ、API定義）。中央は「隔離した箱の中のAI」で、偵察・攻撃・掘り下げに分かれて手分けする と書かれている。右は「通った攻撃」で、攻撃例（PoC）が付く、分類と深刻度が付く が並ぶ。下に「実行のたびに手元へ保存される。対話画面を使わないモードでは、見つかると終了コードが変わるのでCIでも止められる」とある。いちばん下に「READMEが掲げるのは、怪しい箇所の一覧ではなく実際に通った経路」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">当ててみて、<tspan fill="#1E5A48">通った経路</tspan>を残す</text>

  <rect x="20" y="120" width="200" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="120" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">対象</text>
  <text x="120" y="190" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">コード</text>
  <text x="120" y="214" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">動いているアプリ</text>
  <text x="120" y="238" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">API定義</text>

  <line x1="226" y1="185" x2="262" y2="185" stroke="#1E5A48" stroke-width="4" marker-end="url(#sx-arrow)" />

  <rect x="270" y="120" width="230" height="130" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="385" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">隔離した箱の中のAI</text>
  <text x="385" y="204" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">偵察・攻撃・掘り下げに</text>
  <text x="385" y="228" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">分かれて手分けする</text>

  <line x1="506" y1="185" x2="542" y2="185" stroke="#1E5A48" stroke-width="4" marker-end="url(#sx-arrow)" />

  <rect x="550" y="120" width="230" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="665" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">通った攻撃</text>
  <text x="665" y="196" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">攻撃例（PoC）が付く</text>
  <text x="665" y="222" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">分類と深刻度が付く</text>

  <text x="400" y="318" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">実行のたびに手元へ保存される。対話画面を使わないモードでは、見つかると終了コードが変わるのでCIでも止められる</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">READMEが掲げるのは、怪しい箇所の一覧ではなく実際に通った経路</text>
</svg>

キャプション: README が押しているのは**出力の性質**。「ここが危ないかもしれない」ではなく、通った攻撃例そのものを出すという主張だ。


## どんなときに使うか

### 検査の結果が多すぎて、どれが本物か分からないとき

README は、見つけたものを実際に試して裏を取る設計だとしている。通った攻撃例が残るので、**直したあとに同じものをもう一度当てて確かめる**という流れが作れる。

### リリース前に、外から見た穴を見ておきたいとき

動いているアプリの URL をそのまま渡せる。OpenAPI や Postman の定義は、その URL と組みで渡す。宣言されている入り口を順に試す形になるので、画面をたどって探す必要がない。ただし**自分の管理下にあるものだけ**に限られる（下の注意点）。


## 注意点

**許可のない対象に向けてはいけない。** README は警告として、自分が所有しているか、**書面で明確な許可を得ている**システムだけを、合意した範囲の中で対象にするよう求めている。無断の侵入テストは多くの国で違法であること、責任は使う側にあることも明記されている。ここは機能の話ではなく、使う前に決着させておく話だ。

**実際に攻撃するので、当てる先を選ぶ。** 静的解析と違い、対象を動かして通信を送る。稼働中の本番環境に当てれば、データや利用者に影響が出る余地がある。

**無料で使えるのは、自分で動かす部分。** README は3つの提供形態を分けて書いている。オープンソース版は**無料で、Docker と自分の LLM キーを使って手元で動かす**もの。クラウド版（登録は無料と書かれている）は、修正のプルリクエスト作成や継続的な検査などが付く別立て。企業向けはさらに SSO や各種の報告書が付く。この記事で書いているのは、オープンソース版の範囲だ。

**LLM の利用料は自分持ちになる。** 手元で動かす以上、モデルの料金は自分の契約にかかる。README は推奨モデルを複数挙げているが、どれを選ぶかで費用も結果も変わる。

**手元のダッシュボードの共有リンクに注意。** `strix view` は既定では手元だけに開く（別のマシンから見る設定もある）一方、印字されるリンクにはその実行結果を見るための鍵が含まれる。README も「共有には注意」と添えている。ライセンスは Apache-2.0。
