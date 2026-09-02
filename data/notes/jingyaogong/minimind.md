---
updated: 2026-09-02
image:
image_alt:
---

## 見出しの一文

GPU1枚に載る大きさまで削って、モデルを作る側を一度通しでやる

## どういうものか

言語モデルを**ゼロから学習させる工程一式**を、個人の機材で最後まで走らせられる大きさに縮めた教材です。作るモデルは 64M パラメータほど。MoE（専門家混合）の構成も用意されていて、こちらは全体 198M・実際に動くのは 64M ぶん、という形になっています。NVIDIA 3090 が1枚あれば、事前学習に約1.2時間、教師ありファインチューニングに約1.1時間。合わせて約2.3時間で1周します。README にある「3元」は電気代ではなく、**その時間ぶんの GPU の借り賃**（1時間あたり1.3元での計算）で、日本円にすると60円ほどです。

学習の段階は、いま実際に使われているものがひととおり揃っています。事前学習、教師ありファインチューニング、LoRA、DPO による選好の学習、AI のフィードバックによる強化学習＝RLAIF（PPO・GRPO・CISPO）、その一種で道具を使わせるマルチターンの Agentic RL、そして蒸留（ブラックボックス／ホワイトボックスの両方）。データは JSONL の同じ形に揃えて配布されていて、事前学習用の小さい版と全量版、道具呼び出しを含む対話データなどがあります。

この構成でいちばん効いているのは、**中身が素の PyTorch で書かれている**ことです。README には「主要なアルゴリズムはすべて PyTorch で直接実装しており、外部ライブラリの高水準な抽象に依存しない」とあります。トークナイザ、LoRA、DPO、強化学習まで自前です。推論の側は transformers や vLLM と組み合わせられます。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="事前学習・教師ありファインチューニング・選好の学習・蒸留の4段階が横一列に並び、その全体を「GPU1枚・素のPyTorch」という一本の帯が下から支えている図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="58" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      本物と同じ順番を、<tspan style="fill: #1E5A48;">GPU1枚</tspan>に載る大きさで通す
    </text>

    <!-- 1. 事前学習 -->
    <rect x="60" y="120" width="128" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="80" y="144" width="88" height="8" rx="4" fill="#17160F" opacity=".18"/>
    <rect x="80" y="160" width="66" height="8" rx="4" fill="#17160F" opacity=".18"/>
    <rect x="80" y="176" width="88" height="8" rx="4" fill="#17160F" opacity=".18"/>
    <rect x="80" y="192" width="52" height="8" rx="4" fill="#17160F" opacity=".18"/>

    <path d="M196 168 H228" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M228 157 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 2. 教師ありFT -->
    <rect x="244" y="120" width="128" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="264" y="142" width="62" height="26" rx="8" fill="#17160F" opacity=".18"/>
    <rect x="292" y="176" width="62" height="26" rx="8" fill="#1E5A48" opacity=".38"/>

    <path d="M380 168 H412" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M412 157 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 3. 選好の学習 -->
    <rect x="428" y="120" width="128" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="448" y="140" width="56" height="22" rx="7" fill="#1E5A48" opacity=".38"/>
    <path d="M516 145 l8 9 15 -17" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="448" y="176" width="56" height="22" rx="7" fill="#17160F" opacity=".14"/>
    <path d="M518 179 l18 18 M536 179 l-18 18" stroke="#17160F" stroke-width="4" stroke-linecap="round" opacity=".3"/>

    <path d="M564 168 H596" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M596 157 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 4. 蒸留 -->
    <rect x="612" y="120" width="128" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <circle cx="653" cy="168" r="27" fill="#17160F" opacity=".14"/>
    <path d="M690 168 h14" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <circle cx="716" cy="168" r="13" fill="#1E5A48"/>

    <!-- ラベル -->
    <text x="124" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">事前学習</text>
    <text x="124" y="278" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（言葉の続きを覚える）</text>

    <text x="308" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">教師ありFT</text>
    <text x="308" y="278" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（対話の形に直す）</text>

    <text x="492" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">選好の学習</text>
    <text x="492" y="278" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（良い答えを選ばせる）</text>

    <text x="676" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">蒸留</text>
    <text x="676" y="278" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（大きい方から写す）</text>

    <!-- 支える帯 -->
    <rect x="60" y="316" width="680" height="54" rx="12" fill="#1E5A48"/>
    <text x="400" y="350" text-anchor="middle"
          style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #FFFFFF;">
      どの段も素のPyTorch。3090が1枚あれば通る
    </text>

    <text x="400" y="410" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 減らしたのは規模だけで、工程は減らしていない 〜
    </text>
  </svg>
</figure>

キャプション:

横に並んだ4段は、大きなモデルを作るときの順番とほぼ同じです。違うのは下の帯——支えている機材の大きさだけ、という見方をするための図です。

## どんなときに使うか

### 学習の中身を、コードのまま読みたいとき

DPO や GRPO の説明を読んで分かった気になっても、実装を見ると別のことが書いてある、というのはよくあります。ここでは各アルゴリズムが PyTorch で直接書かれているので、ライブラリの引数を追うのではなく、処理そのものを読めます。

### 手順を一度、最後まで走らせておきたいとき

事前学習からファインチューニングまで数時間で終わるので、途中でどこが詰まるか、何が効いて何が効かないかを、待たずに何周か試せます。大きなモデルで同じことをやると、1回の失敗の代償が大きすぎます。

## 注意点

**できあがるモデルの性能には期待しないこと。** README は、この最小構成を GPT-3 の約 1/2700 の大きさだと書いています。目的は使えるモデルを手に入れることではなく、作り方を通しで確かめることにあります。

**「約2.3時間・3元」は1エポックぶんの数字です。** 条件は 3090 が1枚で1エポック。もともと借り賃としての金額なので、GPU を持っていない人もそのまま見積もりに使えますが、試行錯誤して何周も回せば、当然その回数ぶん掛かります。

**主に中国語のプロジェクトです。** README には英語版もありますが、データセットも解説も中国語が中心です。日本語での学習を試したい場合は、データを自分で用意することになります。

ライセンスは Apache 2.0 で、商用利用と改変が明示的に許可されています。
