---
updated: 2026-09-02
image:
image_alt:
---

## 見出しの一文

PDFを開き切る前に仕分けて、OCRに回す枚数そのものを減らす

## どういうものか

PDF から文字を取り出して Markdown にする Rust 製のライブラリです。ただし主役は変換のほうではなく、**その前段にある仕分けの部分**にあります。手元の PDF が、文字データを持っているものなのか、紙をスキャンしただけの画像なのかを判定します。作者は Firecrawl で、README には「OCR を要らないのは約54%の PDF」とあります。その54%のぶんだけ、外部サービスの費用と待ち時間を丸ごと消すのが狙いです。

判定のために全文を解析しない、というのがこのライブラリの設計です。読むのは相互参照テーブルとページツリーだけ。あとはコンテンツストリームを拾い読みして、**文字を置く命令（`Tj` / `TJ`）が出てくるか、画像を貼る命令（`Do`）が出てくるか**を見ます。結果は「テキスト」「スキャン」「画像」「混在」の4つに分けられ、確信度の数値が付きます。ここまでが 10〜50ミリ秒です。

判定はファイル全体の分類として返り、そこに**OCR が要るページ番号の一覧**が付きます。混在した PDF——本文は文字だが、途中の数ページだけスキャン画像、という書類——で、その数ページだけを OCR に送れます。また、パイプライン向けに早めに打ち切る、精度優先で全ページ見る、巨大な PDF は間引く、といった走査のしかたを選べます。Rust のクレートのほか、Python・Node.js・ブラウザ向け WebAssembly・コマンドライン（`pdf2md` / `detect-pdf`）から使えます。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="PDFの束をpdf-inspectorが構造だけ見て仕分け、テキストのPDFはそのまま抽出へ、スキャンされたPDFだけをOCRへ回す、という分岐の図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="60" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      PDFを<tspan style="fill: #1E5A48;">開き切る前に</tspan>仕分けて、重い処理を必要な枚数に
    </text>

    <!-- PDFの束 -->
    <rect x="82" y="192" width="74" height="96" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" opacity=".35"/>
    <rect x="72" y="185" width="74" height="96" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" opacity=".6"/>
    <rect x="62" y="178" width="74" height="96" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="76" y="200" width="46" height="7" rx="3.5" fill="#17160F" opacity=".2"/>
    <rect x="76" y="216" width="34" height="7" rx="3.5" fill="#17160F" opacity=".2"/>
    <rect x="76" y="234" width="46" height="26" rx="3" fill="#17160F" opacity=".12"/>

    <path d="M170 240 H206" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M206 229 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 仕分け -->
    <rect x="240" y="180" width="120" height="120" rx="12" fill="#1E5A48"/>
    <circle cx="292" cy="230" r="24" fill="none" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M310 248 L330 268" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>

    <!-- 分岐 -->
    <path d="M360 214 C 402 214, 410 172, 448 172" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M448 161 l18 11 -18 11 z" fill="#1E5A48"/>
    <path d="M360 266 C 402 266, 410 310, 448 310" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M448 299 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- そのまま抽出 -->
    <rect x="474" y="134" width="266" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="607" y="169" text-anchor="middle" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #17160F;">そのまま Markdown へ</text>
    <text x="607" y="192" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（手元で完結する・追加の費用なし）</text>

    <!-- OCRへ -->
    <rect x="474" y="272" width="266" height="76" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="7 5"/>
    <text x="607" y="307" text-anchor="middle" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #1E5A48">OCR に回す</text>
    <text x="607" y="330" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（重い・外に出す・ページ単位で）</text>

    <!-- ラベル -->
    <text x="99" y="312" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">PDFの束</text>
    <text x="99" y="334" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（中身はまちまち）</text>

    <text x="300" y="332" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">pdf-inspector</text>
    <text x="300" y="354" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（構造だけ見る・10〜50ms）</text>

    <text x="400" y="410" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 全部を重い処理に流していたのを、必要なぶんだけに絞る 〜
    </text>
  </svg>
</figure>

キャプション:

分かれ道が前に来ているのが要点です。上の道に乗ったぶんは外部サービスを呼ばずに済むので、費用も時間も、下に流れた枚数ぶんしか掛かりません。

## どんなときに使うか

### PDFの処理費用が、思ったより膨らんでいるとき

大量の PDF を OCR に投げる作りにしていると、実は文字データを持っていた PDF にも同じ料金と待ち時間が掛かっています。仕分けを前に置けば、その差がそのまま消えます。判定自体が数十ミリ秒なので、入れたことによる遅れはほぼ出ません。

### ファイルを外に出したくないとき

ブラウザ向けの WebAssembly 版があり、CMap を内蔵してサーバへの往復なしで動くと書かれています。判定と Markdown 化までを手元で終わらせられるので、外に出す必要があるページだけを選んで送る、という運用ができます。

## 注意点

**PDF ライブラリの置き換えではありません。** 狙いは仕分けと、素直な文書の Markdown 化までです。複雑なフォーム項目の扱い、汎用のレンダリング、ピクセル単位の再現、構造の推測を超えた意味の理解までは、守備範囲に入っていないと考えたほうがよさそうです。

**得意な文書の形が決まっています。** 想定されているのはレポート、論文、財務資料、請求書、法務文書です。見出しの判定は文字の大きさ、コードの判定は等幅フォント、というように**見た目の特徴からの推測**で組み立てられています。凝ったレイアウトのものほど、期待どおりにはなりにくいはずです。

**OCR は付いてきません。** つなぐための仕組みは Python と Node のパッケージに入っていますが、OCR 本体（PDFium・ONNX Runtime・モデルファイル）は分離されていて、必要になったページで初めて読み込まれます。OCR そのものは自分で用意することになります。

ライセンスは MIT で、商用利用の妨げになる条項はありません。
