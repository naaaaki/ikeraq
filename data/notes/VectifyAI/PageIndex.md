---
updated: 2026-10-01
image:
image_alt:
---

<!-- ============================================================
  VectifyAI/PageIndex
  https://github.com/VectifyAI/PageIndex
  📑 PageIndex: Document Index for Vectorless, Reasoning-based RAG
  Python / MIT / スター 38,017
============================================================ -->


## 見出しの一文

長い資料を章と節の木にして、LLM に人のように該当箇所を探させる


## どういうものか

長い文書に質問して答えさせる仕組み（RAG）を、ベクトル検索を使わずに組む Python のライブラリだ。ふつうの RAG は文書を細かく切り分け、質問と「意味が似ている」断片を引いてくる。PageIndex はそれをやめ、文書ごとに章や節の木（目次のようなもの）を作り、LLM にその木をたどらせて答えのある箇所を探させる。README は「似ていることと、関係があることは違う」と書き、専門家が長い報告書の該当する節を開いて読む動きをまねたものだと説明している。

手順は2段ある。まず索引づくり。木の骨格は LLM を使わずに文書のレイアウトから取り出し、索引用のモデルはそれを要約して整えるだけなので、安いモデルで足りるという。次に検索。チャット用のモデルが木をたどり、たどり着いた節だけを読む。README はこちらには払える範囲で最も良いモデルを勧めている。答えは、読んだ箇所までさかのぼれる。

オープンソース版は自分のマシンで動き、LLM は自分の API キーで呼ぶ。扱えるのは文字の入った PDF で、スキャンした資料の文字起こし（OCR）や画像の読み取りは、PageIndex の API キーを使うクラウド版の機能だ。ライセンスは MIT。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「「似ている断片」ではなく章と節をたどって探す」とある図。左から「長い PDF（決算書・マニュアルなど）」「木の索引（章と節の階層）」「LLM がたどる（必要な節だけ読む）」「答え（根拠のページも出せる）」が矢印でつながる。下に「骨格は文書の形から作る。LLM の賢さが要るのは、たどる側」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">「似ている断片」ではなく<tspan fill="#1E5A48">章と節</tspan>をたどって探す</text>

  <rect x="20" y="170" width="160" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="100" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">長い PDF</text>
  <text x="100" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（決算書・マニュアルなど）</text>

  <line x1="184" y1="225" x2="214" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />

  <rect x="220" y="170" width="160" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="300" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">木の索引</text>
  <text x="300" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（章と節の階層）</text>

  <line x1="384" y1="225" x2="414" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />

  <rect x="420" y="170" width="160" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="500" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">LLM がたどる</text>
  <text x="500" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（必要な節だけ読む）</text>

  <line x1="584" y1="225" x2="614" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />

  <rect x="620" y="170" width="160" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="700" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">答え</text>
  <text x="700" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（根拠のページも出せる）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">骨格は文書の形から作る。LLM の賢さが要るのは、たどる側</text>
</svg>

キャプション: 質問に「似た文」を拾うのではなく、章と節の木から該当する節を選んで読むので、どこを根拠に答えたかをたどれる。


## どんなときに使うか

### 数百ページの報告書やマニュアルに、質問で答えさせたいとき

README が向いている例に挙げるのは、決算書、法律文書、規制当局への届出、技術マニュアル、医学文献など。README の測定では、答えが同じだった文書で比べると、PDF を毎回丸ごと渡すほうが 52ページで2.1倍、420ページで16.6倍高くついた（チャット用モデルは gpt-5.6-sol、プロンプトのキャッシュは使わない条件）。805ページでは、そもそもモデルに入りきらなかった。

### 答えの根拠がどこか、あとで示す必要があるとき

答えは、LLM が木のどの節を読んだかまでさかのぼれる。頼めば根拠の場所も示せて、自分のマシンで動かす版ではページ単位になる（クラウド版はもっと細かい単位）。


## 注意点

**スキャンした PDF は、手元で動かす版では扱えない。** 図や画像の中身も読まない。文字起こしと画像の読み取りはクラウド版の機能。MCP サーバー、フォルダ分け、何百万件もの文書をまとめて扱う機能もクラウド側にある。

**質問のたびに LLM の利用料がかかる。** 検索のたびにモデルが木をたどるためだ。README は検索側に良いモデルを勧めており、モデルを1段上げるごとに費用が1桁上がるグラフを載せている。

**性能の数字は開発元自身の測定。** 比較の条件は README とベンチマーク用のリポジトリで確かめてから当てにする。
