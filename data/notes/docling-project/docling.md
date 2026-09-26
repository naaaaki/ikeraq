---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  docling-project/docling
  https://github.com/docling-project/docling
  Get your documents ready for gen AI
  Python / MIT / スター 67,000台
============================================================ -->


## 見出しの一文

PDFやWordを、AIに渡せる構造つきのテキストに変換する


## どういうものか

いろいろな形式の文書を読み込んで、**中身の構造を保ったまま**別の形に書き出すための道具だ。Python で書かれていて、ライセンスは MIT。もとは IBM Research Zurich のチームが始めたもので、現在は LF AI & Data 財団のプロジェクトとして置かれている。

中心にあるのは、PDF の読み解きだ。README は、ページの配置・読む順番・表の構造・コード・数式・画像の分類までを扱うと書いている。文字が埋まっていない紙のスキャンには OCR が使える。読み取った結果は **DoclingDocument** という共通の形にまとめられ、そこから Markdown・HTML・WebVTT・DocTags・欠落のない JSON などに書き出す。**入口が何であっても、いったん同じ形を経由する**のがこの設計の要点になる。

入口として挙がっている形式は幅広く、PDF・DOCX・PPTX・XLSX・HTML・EPUB・Apple Pages・LaTeX・プレーンテキストのほか、画像、音声（WAV・MP3）、メール（EML・MSG）が並ぶ。特許（USPTO）や論文（JATS）、財務報告（XBRL）といった用途ごとの XML にも対応している。使い方は、コマンド1行で変換する CLI、Python から呼ぶ方法、サービスとして立てる API サーバー（docling-serve）がある。エージェントからつなぐための MCP サーバーも用意されていて、LangChain・LlamaIndex・Crew AI・Haystack との連携も挙げられている。処理を手元で完結させられる点は、README が明示的に利点として書いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「入口がどれでも、いったん同じ形にする」とある図。左に「いろいろな形式（PDF・Word・画像・音声・メールなど）」、次に「中身を読み解く（配置・読む順番・表・数式）」、次に「ひとつの形（DoclingDocument）」、右に「書き出す（Markdown・JSON・HTMLなど）」が矢印でつながっている。下に「紙のスキャンはOCR、音声は文字起こしを通してから同じ形に入る」とある。いちばん下に「手元だけで動かせるので、外に出せない文書も通せる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="dl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">入口がどれでも、いったん<tspan fill="#1E5A48">同じ形</tspan>にする</text>

  <rect x="18" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">いろいろな形式</text>
  <text x="98" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（PDF・Word・画像・</text>
  <text x="98" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">音声・メールなど）</text>

  <line x1="184" y1="186" x2="208" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#dl-arrow)" />

  <rect x="214" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="294" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">中身を読み解く</text>
  <text x="294" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（配置・読む順番・</text>
  <text x="294" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">表・数式）</text>

  <line x1="380" y1="186" x2="404" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#dl-arrow)" />

  <rect x="410" y="130" width="160" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="490" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ひとつの形</text>
  <text x="490" y="198" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（DoclingDocument）</text>

  <line x1="576" y1="186" x2="600" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#dl-arrow)" />

  <rect x="606" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="686" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">書き出す</text>
  <text x="686" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Markdown・JSON・</text>
  <text x="686" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">HTMLなど）</text>

  <text x="400" y="308" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">紙のスキャンはOCR、音声は文字起こしを通してから同じ形に入る</text>
  <text x="400" y="376" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">手元だけで動かせるので、外に出せない文書も通せる</text>
</svg>

キャプション: 効いてくるのは**真ん中の共通の形**。入口を増やしても、後ろにつなぐ処理はひとつのままで済む。


## どんなときに使うか

### PDFの表が、コピーすると崩れてしまうとき

ページの配置と表の構造を読み取ったうえで書き出すので、行と列の関係を保ったまま Markdown や JSON にできる。**テキストとして抜くのではなく、構造ごと移すのが目的の道具だ。**

### 社外に出せない資料を、AIに読ませたいとき

処理を手元で完結できることが README に明記されていて、ネットワークから切り離した環境での実行も想定されている。クラウドの変換サービスに文書を送らずに済む。


## 注意点

**Python の版に下限がある。** 2.70.0 で Python 3.9 の対応が終わっていて、README は 3.10 以上を使うよう書いている。動く環境として macOS・Linux・Windows、x86_64 と arm64 が挙げられている。

**コードとモデルでライセンスが別になる。** 本体は MIT だが、README は「個々のモデルの利用については、元のパッケージにあるモデルのライセンスを参照してほしい」と書いている。OCR や画像を読む処理を使うときは、そこを確認する必要がある。

**画像や音声には、別のモデルが要る。** 図表を読むのに視覚言語モデル（GraniteDocling など）、音声を文字に起こすのに音声認識のモデルが使われる。テキストが埋まった PDF を変換するのとは、用意するものが違う。

**開いているものは多い。** issue とプルリクエストを合わせて900件台が開いている。使われている量に比例した数ではあるが、報告してすぐ対応が返る規模ではない。
