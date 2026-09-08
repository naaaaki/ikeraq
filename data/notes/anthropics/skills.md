---
updated: 2026-09-08
image:
image_alt:
---

<!-- ============================================================
  anthropics/skills
  https://github.com/anthropics/skills
  Public repository for Agent Skills
  Python / スター 175,140
============================================================ -->


## 見出しの一文

決まった仕事のやり方をフォルダに書いて、Claude に毎回同じ手順を踏ませる


## どういうものか

同じ依頼をしても、Claude の出来には毎回ばらつきが出る。社内の書式、いつもの手順、避けたい書き方。それを毎回プロンプトに書き足すのは続かない。スキルは、その**手順書を1つのフォルダにまとめて置いておく**仕組み。ここは Anthropic が自社の Claude 向けに作った実装を置く場所で、仕組みの取り決めそのもの（Agent Skills の仕様）は別に公開されている、と README の冒頭に断りがある。フォルダには `SKILL.md` という1枚の文書を置き、先頭に名前と説明、その下に守ってほしい手順を書く。必要なら参考資料やスクリプトを同じフォルダに入れられる。

要になるのは**説明文**のほう。決まりとして必須の項目は「名前」と「説明」の2つだけで、説明には**何をするものかと、どんなときに使うか**を書く。Claude は常に手順の全文を読んでいるわけではなく、この説明を見て、当てはまるときに中身を読み込む。実例を見ると、この説明が非常に長い。Word文書を扱うスキルでは「.docx や .dotx への言及」「報告書・メモ・手紙をWordで求められたとき」まで書き並べ、最後に「PDF・表計算・Googleドキュメントには使わない」と**使わない場面**まで明示している。呼ばれるかどうかがここで決まるので、手順そのものより気を遣う場所だ。

この置き場所には、Anthropic 自身が作った19個の実例が入っている。文書を扱うもの（Word・PDF・PowerPoint・Excel）、作る系（デザイン・配色・アルゴリズムで作る絵）、開発向け（MCPサーバーを作る、Webアプリをテストする、スキル自体を作る）、社内向け（ブランド規定・社内広報）など。ほかに仕様書のフォルダと、書き始めるための雛形が置かれている。Claude Code からはプラグインの取得先として登録して導入でき、claude.ai の有料プランやAPIからも使える。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="スキルの仕組みの図。フォルダには名前と説明、手順、資料やスクリプトが入っている。Claude は常に名前と説明だけを見ており、依頼が当てはまったときに手順と資料を読み込んで、その手順どおりに作業する、という流れが左から右へ示されている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">ふだんは<tspan fill="#1E5A48">説明文だけ</tspan>を見ている</text>
  <rect x="20" y="126" width="200" height="180" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="120" y="162" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">スキルのフォルダ</text>
  <text x="120" y="196" text-anchor="middle" font-size="13" font-weight="700" fill="#1E5A48">名前と説明</text>
  <text x="120" y="218" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（いつ使うかを書く）</text>
  <text x="120" y="250" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">手順</text>
  <text x="120" y="276" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">資料・スクリプト</text>
  <line x1="220" y1="216" x2="262" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />
  <rect x="270" y="126" width="240" height="180" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="390" y="162" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">依頼と照らす</text>
  <text x="390" y="198" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">説明に当てはまるか</text>
  <text x="390" y="234" text-anchor="middle" font-size="13" font-weight="700" fill="#17160F">当てはまった</text>
  <text x="390" y="258" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">→ 手順と資料を読む</text>
  <text x="390" y="288" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">当てはまらなければ読まない</text>
  <line x1="510" y1="216" x2="552" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />
  <rect x="560" y="126" width="220" height="180" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">手順どおりに作る</text>
  <text x="670" y="212" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">書式も、避けたい書き方も</text>
  <text x="670" y="236" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">毎回同じところに揃う</text>
  <text x="670" y="268" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（指示を毎回書き足さない）</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">出来を左右するのは手順の長さより、「いつ使うか」を書いた説明文の精度になる</text>
</svg>

キャプション: 手順書を渡すことより、**必要なときにだけ開かせること**が肝になっている。だから説明文に手間がかかる。


## どんなときに使うか

### 同じ依頼を何度も出していて、毎回同じ注意を書き足しているとき

書式、言い回し、社内の決まり。会話のたびに書き足しているものがあるなら、それがそのままスキルの中身になる。**書き足す場所を、会話からフォルダに移す**という捉え方でいい。

### 自分でスキルを作る前に、書き方の見本が欲しいとき

説明文をどこまで細かく書くのか、手順をどれくらいの粒度で並べるのか。この置き場所には実際に使われているものが19個あり、**実物を読んで真似できる**。仕様書と雛形も同じ場所にある。


## 注意点

**ライセンスが2種類ある。** フォルダごとに `LICENSE.txt` が置かれていて、たとえば MCPサーバーを作るスキルは Apache-2.0。一方、Word・PDF・PowerPoint・Excel を扱う4つは**中身は見られるが自由に使えるものではない**扱いで、Anthropic との利用規約に従う旨が書かれている。読んで学ぶのと、自分の製品に取り込むのは別の話だ。リポジトリ全体をまとめて覆うライセンスファイルは置かれていない。

**「見本であって製品ではない」と明記されている。** README には、これらは実演と教育のために提供するもので、実際の Claude の挙動とは異なる場合がある、大事な用途に使う前に自分の環境で十分に試すこと、と書かれている。

**説明文が甘いと、そもそも呼ばれない。** 手順をどれだけ丁寧に書いても、説明に当てはまらなければ読まれない。実例が「使わない場面」まで書いているのは、そのため。**うまく動かないときは、手順より先に説明文を疑う**のが早い。
