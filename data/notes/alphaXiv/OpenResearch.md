---
updated: 2026-09-16
image:
image_alt:
---

<!-- ============================================================
  alphaXiv/OpenResearch
  https://github.com/alphaXiv/OpenResearch
  Turn your coding agents into research agents
  Rust / MIT / スター 3,306
============================================================ -->


## 見出しの一文

手元のコーディング用 AI に、実験を枝分かれさせたまま回させる作業場


## どういうものか

いま使っているコーディングエージェント（Claude Code、Codex、OpenCode、Cursor）を、**研究の進め方のほうに向ける**ための作業場。README の言い方では、文献を読む、仮説を立てる、実験を走らせる、成果物を作るところまでをエージェントにやらせる。自分の機械の上で動くのが前提で、`orx up` と打つと `127.0.0.1` に管理画面が立ち上がり、記録は手元の SQLite に貯まる。プロジェクトを作っても、実行しても、コードが外に出るわけではないと明記されている。

作りの中心は**枝分かれの扱い**にある。試したい方向がいくつかあるとき、方向ごとに別々のエージェントの会話を与え、それぞれに **git の独立した作業コピー**を割り当てる（worktree という仕組み）。同じ場所を奪い合わずに並行して進められる形だ。結果は git を土台にした「実験の木」に積まれていき、実行のたびに、そのとき記録されたコミットの控えが書き換えられない形で残る。ログ、差分、ファイル、結果、成果物は、それを生んだ作業に結びつけたまま置かれる。あとから「この数字はどの版から出たのか」を辿れるようにする、という設計だ。

README によれば、案を出す → コードを直す → 実験を走らせる → 出てきたものを確かめる → 次に何を試すか決める、という一周を**丸ごと任せることもできる**。それを「autoresearch」と呼んでいる。計算をどこでやるかは切り離されていて、同じコミットの状態を、手元でも、SSH の先でも、Slurm・Kubernetes・Ray・Hugging Face Jobs・Modal・Tinker といった場所でも走らせられる。そのためにリポジトリを公開する必要はない、とも書かれている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「分かれた道を、分かれたまま記録する」とある図。左は「ひとつの問い」で 試したい方向が複数ある。中央は「方向ごとのセッション」で 方向A、方向B、方向C が並び、それぞれに別の作業コピー（git worktree）が付く。右は「実験の木」で どの版から出た結果か、ログ・差分・成果物ごと残る。下に「置き場所は手元のまま、計算する場所だけ外に出せる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="orx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">分かれた道を、<tspan fill="#1E5A48">分かれたまま</tspan>記録する</text>
  <rect x="20" y="118" width="188" height="176" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="114" y="186" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ひとつの問い</text>
  <text x="114" y="224" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.72">試したい方向が複数ある</text>
  <line x1="208" y1="206" x2="248" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#orx-arrow)" />
  <rect x="254" y="118" width="250" height="176" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="379" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">方向ごとのセッション</text>
  <rect x="274" y="170" width="210" height="30" rx="5" fill="none" stroke="#17160F" stroke-opacity="0.3" stroke-width="1.2" />
  <text x="379" y="190" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">方向A</text>
  <rect x="274" y="206" width="210" height="30" rx="5" fill="none" stroke="#17160F" stroke-opacity="0.3" stroke-width="1.2" />
  <text x="379" y="226" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">方向B</text>
  <rect x="274" y="242" width="210" height="30" rx="5" fill="none" stroke="#17160F" stroke-opacity="0.3" stroke-width="1.2" />
  <text x="379" y="262" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">方向C</text>
  <text x="379" y="288" text-anchor="middle" font-size="11.5" fill="#1E5A48">それぞれに別の作業コピー（git worktree）</text>
  <line x1="504" y1="206" x2="544" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#orx-arrow)" />
  <rect x="550" y="118" width="230" height="176" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="665" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">実験の木</text>
  <text x="665" y="214" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">どの版から出た結果か</text>
  <text x="665" y="244" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">ログ・差分・成果物ごと残る</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">置き場所は手元のまま、計算する場所だけ外に出せる</text>
</svg>

キャプション: 速く回すことより、**あとから辿れる形で分かれさせること**に重心が置かれている。


## どんなときに使うか

### 試したい案が複数あって、順番に潰していると時間が足りないとき

方向ごとに別のセッションと別の作業コピーを与える形なので、同じリポジトリを行き来しながら1つずつ試す進め方から離れられる。


### 数字は出たが、どの状態のコードから出たのか分からなくなるとき

実行ごとに、記録されたコミットの控えが書き換えられない形で残る。ログや差分も、それを生んだ作業に紐づいたまま置かれる。


## 注意点

**遠隔で立ち上げたときの入口には鍵が無い。** README は、`--remote` で別の機械の上に立てた場合、その待ち受けはループバックに閉じているものの**アプリとしての認証は無い**ので、**その機械に入れる他の利用者は届いてしまう**と明記している。共用のサーバーで使うなら、ここは自分で塞ぐ前提になる。

**Windows はベータ扱い。** macOS は 11 以上。Windows は README 上でベータと書かれていて、Git for Windows の導入が要る。

**公式の配布物は利用状況を送る（止められる）。** 送るのは無作為な導入ID に紐づいた粗い利用記録で、コード・プロンプト・ファイルの中身やパス・リポジトリ名・トークン・メールアドレス・プロジェクトや実験の識別子は含まないと書かれている。`orx telemetry off` で止められ、ソースから作った版はそもそも送らない。

**ライセンスは MIT。**
