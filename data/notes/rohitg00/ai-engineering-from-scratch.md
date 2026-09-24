---
updated: 2026-09-24
image:
image_alt:
---

<!-- ============================================================
  rohitg00/ai-engineering-from-scratch
  https://github.com/rohitg00/ai-engineering-from-scratch
  Learn it. Build it. Ship it for others.
  Python / MIT / スター 55,778
  topics: agents, ai, ai-agents, ai-engineering, computer-vision, course, deep-learning, from-scratch, generative-ai, llm, machine-learning, mcp, nlp, python, reinforcement-learning, rust, swarm-intelligence, transformers, tutorial, typescript

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->



## 見出しの一文

数学からエージェントまで、自分で作りながら積み上げるAI開発の教材


## どういうものか

AIエンジニアリングを基礎から学ぶための、無料の教材一式だ。README によれば、全体は20のフェーズと520を超えるレッスンからなり、目安の学習時間はおよそ340時間。使う言語は Python・TypeScript・Rust・Julia。線形代数などの数学から始まり、機械学習、深層学習、Transformer、LLM、ツールとプロトコル（MCP など）、エージェント、本番運用を経て、最後の総仕上げの課題に至る。下のフェーズが上のフェーズの土台になる順に並んでいる。

1つのレッスンは1つのフォルダで、実行できるコード、本文、成果物の3つを持つ。README が柱と呼ぶのは **Build It と Use It の分け方** だ。まずフレームワークを使わずに仕組みを自分で実装し、そのあと同じことを PyTorch などのライブラリで動かす。レッスンの最後には、プロンプト・スキル・エージェント・MCPサーバーといった、ほかの場面でも使い回せるものが残る。

読み方は3通り用意されている。サイトで読む、手元に複製してコードを動かす、そしてコーディングエージェントに学習用のスキルを入れて**家庭教師にする**方法だ。最後の方法では、10問の実力判定で始める位置と学習計画が決まり、1回に1レッスンずつ、説明・数式・コード・小テストの順で進む。進み具合は作業フォルダ内のファイルに記録され、次の回に続きから再開できる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="1つのレッスンは、自分で作ってから道具を使う。問題（何に困るか）。理屈（図と直感）。Build It（ライブラリなしで実装）。Use It（PyTorchなどで同じことを）。Ship It（使い回せる成果物）。最後に残るのは、プロンプト・スキル・エージェント・MCPサーバーのどれか" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="aie-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">1つのレッスンは、<tspan fill="#1E5A48">自分で作ってから</tspan>道具を使う</text>

  <rect x="16" y="180" width="124" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="78" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">問題</text>
  <text x="78" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（何に困るか）</text>

  <line x1="144" y1="228" x2="168" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#aie-arrow)" />

  <rect x="172" y="180" width="124" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="234" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">理屈</text>
  <text x="234" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（図と直感）</text>

  <line x1="300" y1="228" x2="324" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#aie-arrow)" />

  <rect x="328" y="180" width="140" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="398" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">Build It</text>
  <text x="398" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ライブラリなしで実装）</text>

  <line x1="472" y1="228" x2="496" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#aie-arrow)" />

  <rect x="500" y="180" width="140" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="570" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">Use It</text>
  <text x="570" y="242" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">（PyTorchなどで</text>
  <text x="570" y="258" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">同じことを）</text>

  <line x1="644" y1="228" x2="668" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#aie-arrow)" />

  <rect x="672" y="180" width="116" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="730" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">Ship It</text>
  <text x="730" y="242" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">（使い回せる</text>
  <text x="730" y="258" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">成果物）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">最後に残るのは、プロンプト・スキル・エージェント・MCPサーバーのどれか</text>
</svg>

キャプション: どのレッスンも、**先に仕組みを自分で実装し**、それからライブラリで同じことを動かす。フレームワークが中で何をしているかを、自分の書いた小さな版で分かるようにする作り。


## どんなときに使うか

### APIを呼ぶだけでなく、中で何が起きているかを説明できるようになりたいとき

README が想定する読者は、コードは書けるが AI の仕組みまでは分かっていない人だ。誤差逆伝播や Attention を自分で組むところから始めるので、使っている道具の中身を言葉にできるようになることを目指している。

### エージェントや MCP など、一部の分野だけを順に学びたいとき

全部を頭から読む必要はなく、目的別の入口が用意されている。MCP だけを17レッスンで学ぶ道筋や、エージェント用のスキルだけを学ぶ道筋もあり、進み具合はそれぞれ別のファイルに記録される。


## 注意点

**量が多く、読み流す作りにはなっていない。** README 自身が「5分の動画も、手取り足取りもない」と書いている。レッスンごとに、実行したコマンドや出力を「証拠」として残しながら進む流れが勧められている。

**日本語で読めるのは入口のページまで。** README によれば、各言語の案内ページはリポジトリに入っているが、正本は英語だ。レッスン本文の機械翻訳は別ブランチにあるが、日本語はまだその対象に入っていない。

**家庭教師のスキルは、実行環境がそろっていることが前提。** スキルを読めるコーディングエージェントが要り、`npx` で入れるなら Node.js も要る（Claude Code なら、リポジトリを手元に複製するだけでもスキルが読み込まれると README にある）。コードを実際に動かす演習には Python と手元への複製も必要になる。そろっていなければ、サイトで読むか本文を直接読むことになる。
