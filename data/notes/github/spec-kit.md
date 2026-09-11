---
updated: 2026-09-11
image:
image_alt:
---

<!-- ============================================================
  github/spec-kit
  https://github.com/github/spec-kit
  💫 Toolkit to help you get started with Spec-Driven Development
  Python / MIT / スター 134,925
  topics: ai, copilot, development, engineering, prd, spec, spec-driven
============================================================ -->


## 見出しの一文

思いつきの指示をやめ、仕様書を正本にしてAIに作らせる


## どういうものか

AIのコーディングエージェントに「こういうのを作って」と一言で頼むと、書かれていない部分をAIがそれらしく埋めてしまい、出来上がってから「そうじゃない」が起きる。Spec Kit は GitHub が公開している、この頼み方そのものを変えるための道具一式。**先に仕様書を書き、コードはそこから作る**という進め方（スペック駆動開発）を、決まった順番の手順として持ち込む。考え方の文書では、これまで「コードが本物で、それ以外は努力目標」だった関係を逆にし、**仕様のほうを正本、コードをその出力**として扱うと説明している。

中身は、`specify` というコマンドラインの道具と、エージェントに登録される一連のコマンドでできている。プロジェクトを初期化すると、Claude Code や GitHub Copilot など使っているエージェントに `/speckit.〜` という手順用のコマンドが入る。柱になる手順は、プロジェクト全体の原則を決める**憲章**、何を・なぜ作るかを書く**仕様**、技術の選び方と構成を決める**計画**、それを細かい作業に割る**タスク**、そして**実装**。その間に、曖昧な点を先につぶす確認や、書類どうしの食い違いを調べる分析などを、必要に応じて挟める。一段ごとに Markdown の書類が残り、次の段はその書類を読んで進む。仕様を書き始めると機能ごとに番号付きのフォルダとGitのブランチが用意され、計画の段では調査メモやデータの形、APIの取り決めまで別々の書類として出てくる。

仕掛けの要は、**AIに勝手な推測をさせない**ことにある。仕様のひな形は、決まっていない点を埋めずに「要確認」の印を付けるよう求めていて、印が残っているうちは仕様が仕上がったことにならない。計画の段では、憲章に書いた原則（たとえば「最初は構成を増やしすぎない」「テストを先に書く」）に照らした関門があり、外れるなら理由を書かせる。対応しているエージェントは30種類以上。手順を足す拡張や、既存の手順を社内の書式に合わせて差し替えるプリセットの仕組みもある。


## 図

<svg viewBox="0 0 800 440" role="img" aria-label="Spec Kit の流れの図。左に「作りたいもの」（ことばで書く）があり、緑の矢印で仕様（何を・なぜ）、計画（どう作るか）、タスク（細かい作業）の3つの書類へ順に進み、最後に実装（AIが書く）に着く。仕様の下には「決まっていない点に要確認の印を付ける」、計画の下には「憲章の原則に照らして関門を通す」と添えられている。上には、すべての段を貫く帯として「憲章（プロジェクトの原則）」が描かれている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="440" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">コードの前に、<tspan fill="#1E5A48">書類を3段</tspan>通す</text>

  <rect x="150" y="84" width="630" height="34" rx="6" fill="none" stroke="#1E5A48" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="465" y="106" text-anchor="middle" font-size="13" fill="#1E5A48" font-weight="700">憲章（プロジェクトの原則）が、すべての段に効く</text>

  <rect x="20" y="150" width="124" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="82" y="202" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">作りたいもの</text>
  <text x="82" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（ことばで書く）</text>

  <line x1="144" y1="215" x2="170" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />

  <rect x="176" y="150" width="140" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.45" stroke-width="1.5" />
  <text x="246" y="202" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">仕様</text>
  <text x="246" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（何を・なぜ）</text>

  <line x1="316" y1="215" x2="342" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />

  <rect x="348" y="150" width="140" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.45" stroke-width="1.5" />
  <text x="418" y="202" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">計画</text>
  <text x="418" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（どう作るか）</text>

  <line x1="488" y1="215" x2="514" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />

  <rect x="520" y="150" width="120" height="130" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.45" stroke-width="1.5" />
  <text x="580" y="202" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">タスク</text>
  <text x="580" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（細かい作業）</text>

  <line x1="640" y1="215" x2="666" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#sk-arrow)" />

  <rect x="672" y="150" width="108" height="130" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="726" y="202" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">実装</text>
  <text x="726" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（AIが書く）</text>

  <text x="246" y="310" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">決まっていない点に</text>
  <text x="246" y="330" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">要確認の印を付ける</text>
  <text x="418" y="310" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">原則に照らして</text>
  <text x="418" y="330" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">関門を通す</text>

  <text x="400" y="398" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">一段ごとに書類が残るので、ずれたときはコードではなく書類に戻って直せる</text>
</svg>

キャプション: AIに渡すのは一言の依頼ではなく、段階を踏んで固めた書類。推測で埋められる余地を、実装より前に一つずつ消していく作りになっている。


## どんなときに使うか

### AIに頼んだ結果が、毎回どこか思っていたのと違うとき

一言で頼んで直させる、を繰り返しているなら、ずれの原因は多くの場合「書いていなかったこと」にある。仕様と確認の段で、**AIが推測で埋めようとした箇所を先に洗い出せる**ので、作ってからの手戻りが減る。

### チームで同じ進め方をそろえたいとき

誰がどのエージェントを使っても、仕様・計画・タスクという同じ形の書類が残る。憲章に原則を書き、プリセットで社内の書式に合わせれば、**人によって頼み方がばらばらになる状態**を抑えられる。


## 注意点

**小さな修正には重い。** 一つの機能を作るのに、仕様・計画・タスクと書類が何枚も生まれる。README 自身も、自分たちの開発でもすべての変更にこの手順を通しているわけではない、と書いている。1行直したいだけのときに使う道具ではない。

**書類を読むのは結局人。** AIが書いた仕様や計画を読まずに次へ進めると、ずれがそのまま書類に固定されるだけになる。確認の段で聞かれたことに、自分で答えられる人向け。

**変化が速い。** 1.0 に到達したが、開発側は「番号にすぎない」とし、安定よりも変わり続けることを優先すると明言している。手順やコマンド名が変わりうる前提で使いたい。導入には Python 3.11 以上と uv（または pipx）、Git が要る。

ライセンスは MIT。
