---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  vectorize-io/hindsight
  https://github.com/vectorize-io/hindsight
  Hindsight: Agent Memory That Learns
  Python / MIT / スター 29,000台
============================================================ -->


## 見出しの一文

AIエージェントの記憶を、ため込むだけでなく整理し直して賢くする


## どういうものか

AIエージェントに長く使える記憶を持たせるための仕組みだ。自分のサーバーで動かす本体（Docker・pip・Kubernetes で入れられる）と、Python・Node.js・Go のクライアントでできている。ライセンスは MIT。運営元の Vectorize は、サーバーを立てずに使える有料のクラウド版（従量課金）も出している。README は、会話の履歴を思い出させるだけの仕組みとの違いを「覚えるだけでなく、学ぶ」と説明している。

中心になる操作は3つある。**retain** で覚えさせると、LLM が文章から事実・人や物事・時期・関係を取り出して、記憶の置き場（**bank**。利用者・エージェント・プロジェクトごとに1つ）にしまう。**recall** で思い出させると、意味の近さ、キーワード、人や物事・時期・因果のつながり、期間の絞り込み、の4通りの検索を同時に走らせ、結果を1つの順位にまとめて返す。**reflect** は、ためた記憶を読み直して、調べるだけでは答えられない問いに答える。

もう1つの特徴は、記憶を積みっぱなしにしないことだ。関連する事実は裏で**observation**（根拠の引用つきの「見方」）にまとめ直され、新しい事実が来ても上書きされず、今ある見方が強まったり弱まったりする。さらに「この利用者の好みは？」のような問いを1度決めておくと、答えを書いて保存し、記憶が増えるのに合わせて裏で書き直してくれる（**mental model**）。これは LLM を呼ばずに読めるので、エージェントは起動するたびに一から調べ直さずに済む。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「記憶を積むだけでなく、まとめ直す」とある図。左に「会話・作業（エージェントが見聞きしたこと）」、次に「retain（LLMが事実・人や物事・時期を取り出す）」、次に「bank（事実を「見方」にまとめ直す）」があり、そこから「recall（4通りの検索で思い出す）」と「reflect（読み直して考えて答える）」の2つに矢印が分かれている。下に「新しい事実は上書きせず、今ある見方を強めたり弱めたりする」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="hs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">記憶を積むだけでなく、<tspan fill="#1E5A48">まとめ直す</tspan></text>

  <rect x="18" y="150" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">会話・作業</text>
  <text x="98" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（エージェントが</text>
  <text x="98" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">見聞きしたこと）</text>

  <line x1="184" y1="206" x2="208" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#hs-arrow)" />

  <rect x="214" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="299" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">retain</text>
  <text x="299" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（LLMが事実・人や物事・/text>
  <text x="299" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">時期を取り出す）</text>

  <line x1="390" y1="206" x2="414" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#hs-arrow)" />

  <rect x="420" y="150" width="170" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="505" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">bank</text>
  <text x="505" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（事実を「見方」に</text>
  <text x="505" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">まとめ直す）</text>

  <line x1="596" y1="194" x2="620" y2="168" stroke="#1E5A48" stroke-width="4" marker-end="url(#hs-arrow)" />
  <line x1="596" y1="218" x2="620" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#hs-arrow)" />

  <rect x="626" y="118" width="160" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="706" y="152" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">recall</text>
  <text x="706" y="176" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（4通りの検索で思い出す）</text>

  <rect x="626" y="214" width="160" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="706" y="248" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">reflect</text>
  <text x="706" y="272" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（読み直して考えて答える）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">新しい事実は上書きせず、今ある見方を強めたり弱めたりする</text>
</svg>

キャプション: 覚えた事実をそのまま積まず、裏で「見方」にまとめ直していく。新しい事実は、今ある見方を書き換えるのではなく、強めたり弱めたりする材料になる。


## どんなときに使うか

### AIアシスタントに、利用者ごとの好みや経緯を覚えさせたいとき

利用者ごとに bank を分けるか、覚えさせるときに利用者の情報を付けておけば、思い出すときにその人の記憶だけに絞れる。README は、これを簡単な使い道の1つとして挙げている。

### コーディングエージェントに、毎回プロジェクトの事情を説明し直したくないとき

コーディングエージェント向けのパッケージを入れると、git の履歴と過去の作業からリポジトリごとの記憶が自動で作られ、エージェントが作業を始めるときに渡される。README によれば、Claude Code・Codex CLI・Cursor CLI など十数種類に対応している。


## 注意点

**簡単な自動化には重すぎる。** README 自身が、n8n などで組む単純な流れには「過剰かもしれない」と書いている。向いているのは、利用者の反応で振る舞いを変えながら、決まった答えのない仕事をこなすエージェントだ。

**覚えさせるたびに LLM を呼ぶ。** retain は裏で LLM を使って事実を取り出す。有料の LLM を使うなら、記憶を増やすほど利用料がかかる。LLM は OpenAI・Anthropic などのほか、Ollama などの手元で動くものも選べる。

**手軽な組み込み方の送り先に気をつける。** 既存の LLM クライアントを包むだけで記憶を付けられる「LLM Wrapper」は、送り先を指定しないとクラウド版に送る設定になっている。自分のサーバーで動かすなら、送り先を指定する。

**秘密情報の検査は、自分でオンにしないと動かない。** 覚えさせる内容から APIキーや個人情報を見つけて伏せる「Memory Defense」は、bank ごとに有効にする方式だ。

**性能の比較は README の主張として読む。** README は、長期記憶のベンチマーク LongMemEval で最高の成績だとし、その数字は大学の研究者と The Washington Post が再現したと書いている。一方で、比べている他社の数字は各社の自己申告だとも書いている。
