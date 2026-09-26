---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  Tencent/WeKnora
  https://github.com/Tencent/WeKnora
  Open-source LLM knowledge platform: turn raw documents into a queryable RAG, an autonomous reasoning agent, and a self-maintaining Wiki.
  Go / MIT（第三者部品は別ライセンス） / スター 28,000台
============================================================ -->


## 見出しの一文

社内に散らばった文書を、質問して引ける知識ベースに作り替える


## どういうものか

文書をためて、質問すると中身から答えを組み立てる仕組みを、**自前のサーバーで丸ごと動かす**ためのものだ。Tencent が公開していて、書かれている言語は Go。README は用途を「企業向けの文書理解・意味検索・自律的な推論」と説明している。導入は Docker Compose で、リポジトリを取ってきて設定ファイルを写し、起動するとブラウザから使える形になる。

出口が3つある。ひとつは**ふだんの調べもの**で、知識ベースに対して質問して答えと引用を返す（RAG）。ふたつめは**エージェント**で、検索・MCP のツール・ウェブ検索・サンドボックスを自分で組み合わせながら、段階を踏んで答えに近づく。みっつめが **Wiki モード**で、取り込んだ生の文書からエージェントが Markdown のページ群を自動で書き起こし、相互にリンクした知識ベースと関係図を作る。Wiki のページは人が直接書き直せて、版の履歴と差分が残り、1クリックで戻せる。

入口の側も広い。Feishu・GitLab・Notion・Yuque・DingTalk の文書や RSS から自動で取り込め、扱える形式として PDF・Word・画像・Excel・XMind などが挙がっている。答える先も、ブラウザだけでなく WeCom・Feishu・Slack・Telegram といったチャットに出せる。中で使う LLM・ベクトルデータベース・保存先はいずれも差し替え前提の設計で、OpenAI・DeepSeek・Qwen・Gemini・Ollama などが並ぶ。公開時点の版は v0.8.0。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「ためた文書に、3つの出口をつける」とある図。左に「集める（社内の文書・外部サービス・RSS）」、中央に「読んで刻む（解析して検索できる形にする）」があり、矢印でつながっている。中央から右へ3本の矢印が伸び、それぞれ「調べもの（質問に引用つきで答える）」「エージェント（道具を使って段階を踏む）」「Wiki（自動で書き起こし、人が直せる）」につながっている。いちばん下に「置き場所も、使うモデルも、自分のサーバーの中で決められる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="wk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">ためた文書に、<tspan fill="#1E5A48">3つの出口</tspan>をつける</text>

  <rect x="20" y="170" width="150" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="95" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">集める</text>
  <text x="95" y="236" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（社内の文書・</text>
  <text x="95" y="252" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">外部サービス・RSS）</text>

  <line x1="176" y1="222" x2="202" y2="222" stroke="#1E5A48" stroke-width="4" marker-end="url(#wk-arrow)" />

  <rect x="208" y="170" width="160" height="104" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="288" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">読んで刻む</text>
  <text x="288" y="236" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（解析して検索</text>
  <text x="288" y="252" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">できる形にする）</text>

  <line x1="374" y1="222" x2="404" y2="130" stroke="#1E5A48" stroke-width="4" marker-end="url(#wk-arrow)" />
  <line x1="374" y1="222" x2="404" y2="222" stroke="#1E5A48" stroke-width="4" marker-end="url(#wk-arrow)" />
  <line x1="374" y1="222" x2="404" y2="314" stroke="#1E5A48" stroke-width="4" marker-end="url(#wk-arrow)" />

  <rect x="412" y="98" width="368" height="64" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="596" y="124" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">調べもの</text>
  <text x="596" y="146" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（質問に引用つきで答える）</text>

  <rect x="412" y="190" width="368" height="64" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="596" y="216" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">エージェント</text>
  <text x="596" y="238" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（道具を使って段階を踏む）</text>

  <rect x="412" y="282" width="368" height="64" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="596" y="308" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">Wiki</text>
  <text x="596" y="330" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自動で書き起こし、人が直せる）</text>

  <text x="400" y="404" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">置き場所も、使うモデルも、自分のサーバーの中で決められる</text>
</svg>

キャプション: 効いてくるのは**入口の手入れ**。取り込みを一度整えておくと、質問にも自動Wikiにも同じ材料が回る。


## どんなときに使うか

### 資料はあるのに、どこに何が書いてあるか誰も把握していないとき

Feishu や Notion や GitLab に文書が分かれて置かれている状態から、まとめて取り込んで引けるようにする。フォルダの構造をそのまま保って取り込めるので、**元の置き場所の感覚を捨てずに移せる。**

### 外部のサービスに社内文書を出したくないとき

全体を自前のサーバーで動かす前提で作られていて、LLM も Ollama のような手元のものに差し替えられる。README は「データ主権」という言い方でここを設計の柱に挙げている。


## 注意点

**機能が多く、決めることも多い。** 公式の文書サイトについて README 自身が、およそ360のAPI と およそ150 の環境変数をカバーすると書いている。すぐ使える代わりに設定を触らない、という性格の道具ではない。

**運用の手間が前提にある。** 用意するものとして README が挙げるのは Docker と Docker Compose、それに Git。中でデータベース・ベクトル検索・解析処理が動く。個人が軽く試す用途には重い。

**動かし方が版で変わっている。** v0.8.0 で、スキルの実行環境からホスト上で直接動かす方式が削除され、Docker 方式は明示的に有効にする扱いになった。以前の版の記事や手順をそのまま追うと合わない可能性がある。

**未解決のものは多い。** issue とプルリクエストを合わせて590件台が開いている。伸びている最中のリポジトリなので、追いかける前提で使うほうがよい。

**ライセンスは MIT だが、全部ではない。** LICENSE には「第三者部品を除いて MIT」と書かれていて、除外される部品とその条件は `THIRD_PARTY_NOTICES.md` と `licenses/` に置かれている。業務で使うなら、そちらも見ておきたい。
