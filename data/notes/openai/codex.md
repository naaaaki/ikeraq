---
updated: 2026-09-23
image:
image_alt:
---

<!-- ============================================================
  openai/codex
  https://github.com/openai/codex
  Lightweight coding agent that runs in your terminal
  Rust / Apache-2.0 / スター 12万台
============================================================ -->


## 見出しの一文

OpenAIのコーディング用AIを、自分のPCのターミナルで動かす


## どういうものか

OpenAI が出しているコーディング用のAIエージェント「Codex」のうち、**自分のコンピュータの上で動くコマンドライン版**（Codex CLI）の本体だ。ターミナルで `codex` と打つと起動し、そこから作業を頼む形になる。言語は Rust、ライセンスは Apache-2.0。

Codex には入口がいくつかある。README は、エディタ（VS Code・Cursor・Windsurf）で使いたいならエディタに入れる方法を、デスクトップアプリとして使いたいなら `codex app` を、クラウドで動くエージェントを使いたいなら **Codex Web**（chatgpt.com/codex）を、と案内を分けている。このリポジトリの README が扱っているのは、そのうち**手元で動く CLI** のほうだ。

README が案内している使い始め方は、ChatGPT のアカウントか API キーでのサインインだ。勧めているのは **ChatGPT のアカウントでのサインイン**で、Plus・Pro・Business・Edu・Enterprise のプランの一部として Codex を使える、と書かれている。API キーでも使えるが、その場合は追加の設定が必要になる。インストールは、Mac・Linux 向けと Windows 向けのインストール用スクリプトのほか、npm と Homebrew、GitHub のリリースに置かれた実行ファイルからも選べる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「Codex を手元のターミナルで動かす」とある図。左に「サインイン」とあり、その下に「ChatGPTのプラン（Plus・Proなど）」と「APIキー（追加の設定が要る）」の2つが並ぶ。どちらからも矢印が中央の「Codex CLI（自分のコンピュータで動く）」につながり、そこから右の「手元のコード（ターミナルから指示する）」へ矢印がつながっている。その下に「ほかの入口：エディタ版・デスクトップアプリ（codex app）・Codex Web（クラウド）」とある。いちばん下に「入口はほかにもあるが、このリポジトリは手元で動く CLI の本体」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">Codex を<tspan fill="#1E5A48">手元のターミナル</tspan>で動かす</text>

  <text x="115" y="112" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">サインイン</text>

  <rect x="20" y="124" width="190" height="82" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="115" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ChatGPTのプラン</text>
  <text x="115" y="184" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Plus・Proなど）</text>

  <rect x="20" y="226" width="190" height="82" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="115" y="262" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">APIキー</text>
  <text x="115" y="286" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（追加の設定が要る）</text>

  <line x1="216" y1="170" x2="280" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#cx-arrow)" />
  <line x1="216" y1="264" x2="280" y2="234" stroke="#1E5A48" stroke-width="4" marker-end="url(#cx-arrow)" />

  <rect x="288" y="162" width="220" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="398" y="208" text-anchor="middle" font-size="18" font-weight="700" fill="#1E5A48">Codex CLI</text>
  <text x="398" y="236" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自分のコンピュータで動く）</text>

  <line x1="514" y1="217" x2="582" y2="217" stroke="#1E5A48" stroke-width="4" marker-end="url(#cx-arrow)" />

  <rect x="590" y="162" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="685" y="208" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">手元のコード</text>
  <text x="685" y="236" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ターミナルから指示する）</text>

  <rect x="80" y="330" width="640" height="40" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="400" y="355" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">ほかの入口：エディタ版・デスクトップアプリ（codex app）・Codex Web（クラウド）</text>

  <text x="400" y="412" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">入口はほかにもあるが、このリポジトリは手元で動く CLI の本体</text>
</svg>

キャプション: 「Codex」という名前の入口はいくつもあるが、**このリポジトリの README が扱うのは手元で動く CLI**。使う前に、どのアカウントでサインインするかを決めておく。


## どんなときに使うか

### ChatGPT を契約していて、コードの作業はターミナルで済ませたいとき

README は ChatGPT のアカウントでのサインインを勧めていて、Plus や Pro などのプランの一部として使える。**エディタやブラウザに移らず、いつものターミナルのまま**AIに作業を頼みたい人向けの入口だ。

### 対話画面を開かずに、コマンドとして呼び出したいとき

`codex exec` という、対話画面を開かないモードが用意されている。README には出てこず、リポジトリ内の資料から公式ドキュメントへ案内されているので、細かい動きはそちらで確かめたい。


## 注意点

**サインイン方法を先に決めておきたい。** README が勧めているのは ChatGPT のアカウントでのサインインで、挙げられているプランは Plus・Pro・Business・Edu・Enterprise。どこまで含まれるかは OpenAI のヘルプ記事を見るよう案内されている。API キーで使う方法もあるが、README は「追加の設定が必要」としていて、手順は別の文書に分かれている。

**Windows の対応状況は、公式の文書で確かめたい。** README には Windows 向けのインストール手順が載っている一方、リポジトリ内のインストール資料の要件表では、Windows は「WSL2 経由の Windows 11」となっている。ほかに macOS 12 以上、Ubuntu 20.04 以上／Debian 10 以上、メモリは最低4GB（推奨8GB）とある。

**インストール用スクリプトは、OpenAI のサーバーから取ってくる。** 既定では releases.openai.com から実行ファイルを落とし、取れない場合に GitHub のリリースへ切り替える。環境変数を指定すれば、最初から GitHub のリリースから取るよう固定することもできる。

**Apache-2.0 なのは、このリポジトリのコード。** 改変や再配布を認めるライセンスだが、README が案内している使い方は、ChatGPT のアカウントか API キーでサインインする形だ。
