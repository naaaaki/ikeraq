---
updated: 2026-09-12
image:
image_alt:
---

<!-- ============================================================
  virgiliojr94/book-to-skill
  https://github.com/virgiliojr94/book-to-skill
  Python / MIT / スター 30,077
  topics: agent-skills, ai-agents, book-to-skill, context-engineering, document-processing, edtech, knowledge-base, llm, pdf-to-markdown, rag, self-study, study-tools
============================================================ -->


## 見出しの一文

本を丸ごと渡すのをやめ、必要な章だけ開ける形に組み替える


## どういうものか

book-to-skill は、PDF・EPUB・Word などの文書を、**エージェント用のスキル**に変換するツール。要約を作るのではなく、その本が持っている考え方の枠組み、繰り返し出るパターン、判断の基準を取り出して、あとから引ける形に組み替える。作ったスキルは Claude Code、GitHub Copilot CLI、Amp、Hermes Agent から使える。

狙いは**費用のかけどころを移すこと**にある。本をそのまま文脈に流し込むやり方だと、質問するたびに本1冊ぶんを読ませることになり、聞いた回数だけ費用がかかる。book-to-skill は構造化の手間を**変換のときに1回だけ**払い、以後は聞いた内容に見合った量で済むようにする。README は、この形にすると回答時のトークンが「24×–51× fewer tokens than dumping the book into context」になるとしている。

処理は2段。まず**取り出す**。形式ごとにパーサが分かれていて、PDF は中身で道具を使い分ける（文章中心なら `pdftotext`、表やコードの多い技術書なら `docling`）。次に**組み立てる**。中心になる考え方と章の目次を書いた `SKILL.md` を作り、その下に章ごとのファイル、さらに用語集・パターン集・チートシートを並べる。**章ファイルは聞かれるまで読み込まれない**ので、置いてあるだけでは容量を食わない。出力は `~/.agents/skills/<slug>/` に置かれ、処理は手元で完結する（ファイルはどこにも送られない）。原文をそのまま写さず、言い換えた枠組みと定義として書き出す方針が明記されている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="book-to-skill の仕組みの図。左に「文書」の箱があり、PDF・EPUB・Word と書かれている。矢印で「取り出す」に進み、形式ごとのパーサで文章と目次を抜くと書かれている。次に「組み立てる（ここで1回だけ手間をかける）」の箱があり、中に SKILL.md（中心の考え方と章の目次）、章ごとのファイル、用語集・パターン集・チートシートの3つが並んでいる。右に「質問するとき」の箱があり、SKILL.md は常に読み、必要な章だけを開くと書かれている。下に、聞くたびに本1冊ぶんを読ませない、と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="bs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">手間は<tspan fill="#1E5A48">変換のとき1回</tspan>。聞くたびには払わない</text>

  <rect x="20" y="128" width="118" height="186" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="79" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">文書</text>
  <text x="79" y="192" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（手元のファイル）</text>
  <text x="79" y="230" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">PDF</text>
  <text x="79" y="254" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">EPUB</text>
  <text x="79" y="278" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">Word</text>

  <line x1="138" y1="221" x2="174" y2="221" stroke="#1E5A48" stroke-width="4" marker-end="url(#bs-arrow)" />

  <rect x="181" y="128" width="118" height="186" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="240" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">取り出す</text>
  <text x="240" y="192" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（形式ごとの道具）</text>
  <text x="240" y="234" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">文章と目次を</text>
  <text x="240" y="256" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">そろえて抜く</text>

  <line x1="299" y1="221" x2="335" y2="221" stroke="#1E5A48" stroke-width="4" marker-end="url(#bs-arrow)" />

  <rect x="342" y="128" width="248" height="186" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="466" y="164" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">組み立てる</text>
  <text x="466" y="186" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（ここで1回だけ手間をかける）</text>
  <rect x="356" y="202" width="220" height="30" rx="4" fill="none" stroke="#1E5A48" stroke-width="1.8" />
  <text x="466" y="222" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1E5A48">SKILL.md（考え方と章の目次）</text>
  <rect x="356" y="240" width="220" height="28" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="466" y="259" text-anchor="middle" font-size="12.5" fill="#17160F">章ごとのファイル</text>
  <rect x="356" y="276" width="220" height="28" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="466" y="295" text-anchor="middle" font-size="12.5" fill="#17160F">用語集・パターン集・チートシート</text>

  <line x1="590" y1="221" x2="626" y2="221" stroke="#1E5A48" stroke-width="4" marker-end="url(#bs-arrow)" />

  <rect x="633" y="128" width="147" height="186" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="706" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">質問するとき</text>
  <text x="706" y="192" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（読む量が変わる）</text>
  <text x="706" y="230" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">SKILL.md は常に</text>
  <text x="706" y="262" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">必要な章だけ開く</text>
  <text x="706" y="288" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">残りは置いたまま</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">丸ごと渡す方式は、聞いた回数だけ本1冊ぶんの費用がかかる</text>
</svg>

キャプション: 変換しているのは形式ではなく**引き方**。目次と章を分けておくことで、読む量が質問の大きさに比例するようになる。


## どんなときに使うか

### 社内のマニュアルや設計指針を、毎回貼り付けて渡しているとき

本以外にも使える。仕様書やデザイン指針のような**毎回同じものを貼っている書類**ほど、1回組み替えておく効果が出る。処理は手元で終わるので、外に出せない資料でも扱える。

### 分厚い技術書を、読み切る前に使いたいとき

章の目次と用語集が先にできるので、「今ぶつかっている箇所」から引ける。通しで読む代わりに、必要になった章だけ開く形に変わる。


## 注意点

**作ったスキルを配るのは危ない。** MIT ライセンスは変換する側のコードにかかるもので、処理した本には及ばない。README も、生成物は個人の学習ノートとして扱い、第三者の著作物から作ったスキルを再配布しないよう促している。手元で使う、が前提の道具だと考えたほうがいい。

**紙をスキャンした PDF はそのままでは通らない。** 文字情報が無いため、先に OCR をかける必要がある。

**書き出しの質は、元の本の性格に左右される可能性がある。** 取り出しているのが枠組み・パターン・判断の基準なので、手順や原則がはっきりしている実務書とは噛み合いやすい一方、筋や描写そのものが中身である本では、抜き出せる形が少なくなることが考えられる。

**追加の導入が要ることがある。** 表やコードの多い PDF を通す `docling` などは別に入れる。足りない場合は、必要なインストール手順が表示される作りになっている。
