---
updated: 2026-09-17
image:
image_alt:
---

<!-- ============================================================
  danny-avila/LibreChat
  https://github.com/danny-avila/LibreChat
  Enhanced ChatGPT Clone (self-hosted AI chat platform)
  TypeScript / MIT / スター 44,200
============================================================ -->


## 見出しの一文

各社のAIを1つの画面にまとめて、自分のサーバーの中で使う


## どういうものか

AI の窓口はいま会社ごとに分かれていて、モデルを変えるたびに画面も履歴も別になる。LibreChat は、それらを**1つの画面にまとめる**チャットの土台で、**自分で立てて自分で動かす**ところが軸になっている。README は自らを「主要な提供元をひとつの画面にまとめた、自分で運用するAIチャットの基盤」と説明している。書かれている言語は TypeScript、ライセンスは MIT。

つなげる先は Anthropic、OpenAI、Azure OpenAI、Google、Vertex AI、AWS Bedrock などが名前で挙がっている。加えて**OpenAI と同じ形式の API なら、仲介を挟まずそのまま追加できる**仕組みがあり、手元で動かす Ollama のようなものから、各種の中継サービスまで同じ枠で足せる。会話の途中で行き先を切り替えられるので、同じ話の続きを別のモデルに渡すことができる。

チャットの外側も厚い。**エージェント**（役割を決めた助手をコードなしで作り、共有もできる）、**MCP** への対応、`SKILL.md` の形で手順をまとめて持たせる仕組み、返事の中に React や HTML や図を作らせる機能、隔離した場所でコードを実行する機能、ウェブ検索、音声の読み上げと聞き取り。運用のほうでは、複数人で使う前提の認証（OAuth2・LDAP・メール）と、**ブラウザから利用者や権限を管理する管理画面**が用意されていて、設定の変更に入れ直しが要らないと書かれている。画面の表示言語には日本語も入っている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「窓口をひとつにして、中身は自分の側に置く」とある図。左に「各社のAI」（Anthropic、OpenAI、Google ほか）と「OpenAIと同じ形式のAPI」（手元のモデルも、中継サービスも）が並ぶ。中央は「LibreChat」で、自分のサーバーで動かす、会話の途中で行き先を替えられる と書かれている。右は「ひとつの画面」で、会話と履歴、エージェントとMCP、コード実行・検索・音声 が並ぶ。下に「利用者の管理と権限は、同じ画面の中に付いてくる」とある。いちばん下に「提供元を替えても、会話が置かれる場所は自分の側のまま」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="lc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">窓口をひとつにして、中身は<tspan fill="#1E5A48">自分の側</tspan>に置く</text>
  <rect x="20" y="104" width="200" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="120" y="134" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">各社のAI</text>
  <text x="120" y="160" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（Anthropic、OpenAI、Google ほか）</text>
  <rect x="20" y="196" width="200" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="120" y="226" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">OpenAIと同じ形式のAPI</text>
  <text x="120" y="252" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（手元のモデルも、中継サービスも）</text>
  <line x1="220" y1="188" x2="262" y2="188" stroke="#1E5A48" stroke-width="4" marker-end="url(#lc-arrow)" />
  <rect x="270" y="104" width="220" height="168" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="380" y="160" text-anchor="middle" font-size="18" font-weight="700" fill="#1E5A48">LibreChat</text>
  <text x="380" y="196" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">自分のサーバーで動かす</text>
  <text x="380" y="226" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">会話の途中で行き先を替えられる</text>
  <line x1="490" y1="188" x2="532" y2="188" stroke="#1E5A48" stroke-width="4" marker-end="url(#lc-arrow)" />
  <rect x="540" y="104" width="240" height="168" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="140" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ひとつの画面</text>
  <text x="660" y="176" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">会話と履歴</text>
  <text x="660" y="204" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">エージェントとMCP</text>
  <text x="660" y="232" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">コード実行・検索・音声</text>
  <text x="400" y="330" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">利用者の管理と権限は、同じ画面の中に付いてくる</text>
  <text x="400" y="384" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">提供元を替えても、会話が置かれる場所は自分の側のまま</text>
</svg>

キャプション: 効き目が出るのは**乗り換えたあと**。行き先を替えても、履歴も設定も利用者の管理も同じ場所に残る。


## どんなときに使うか

### 会話の中身を自分の管理下に置きたいとき

自分のサーバーに立てて動かす形なので、会話の履歴や添付したファイルの置き場所を自分で決められる。複数人での認証と権限の管理が最初から入っているため、**個人で試したあと、そのままチームで使う**という広げ方ができる。

### 使うモデルをまだ決めきれないとき

行き先は会話の途中でも切り替えられ、OpenAI と同じ形式の API なら仲介なしで足せる。**先に画面を決めておいて、モデルはあとから入れ替える**という順番が取れる。ChatGPT などからの会話の取り込みにも対応している。


## 注意点

**新しい機能ほど、まだ固まっていない。** README の最新版の案内はリリース候補（rc）で、エージェントの管理APIは「ベータ」、エージェントに作業場所を割り当てる機能は「非常に実験的」と本人が但し書きを付けている。手前の機能から試すほうが安全だ。

**更新には段差がある。** README は、**更新する前に変更履歴で破壊的変更を確認すること**と警告している。動いているものを上げるときは、いきなり本番で上げない前提で考えたほうがいい。

**自分で運用する分の手間は自分に返ってくる。** 提供元との接続、利用者と権限の管理、投稿の監視、使った量の管理。README はこれらを「できること」として挙げているが、裏を返せば**誰かが設定して見張る必要がある**ということでもある。手間をかけずに使いたいだけなら、各社のサービスをそのまま使うほうが早い。

ライセンスは MIT。関連する部品として、検索まわりの RAG API とサイトが別のリポジトリに分かれている。
