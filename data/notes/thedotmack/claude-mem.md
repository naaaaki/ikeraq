---
updated: 2026-10-05
image:
image_alt:
---

<!-- ============================================================
  thedotmack/claude-mem
  https://github.com/thedotmack/claude-mem
  Persistent Context Across Sessions for Every Agent –  Captures everything your agent does during sessions, compresses it with AI, and injects relevant context back into future sessions. Works with Claude Code, OpenClaw, Codex, Gemini, Hermes, Copilot, OpenCode + More
  TypeScript / Apache-2.0 / スター 95,561
  topics: ai, ai-agents, ai-memory, anthropic, artificial-intelligence, chromadb, claude, claude-agent-sdk, claude-agents, claude-code, claude-code-plugin, claude-skills, embeddings, long-term-memory, mem0, memory-engine, openmemory, rag, sqlite, supermemory

============================================================ -->


## 見出しの一文

前回までの作業を、次のセッションの AI エージェントが覚えている


## どういうものか

Claude Code などの AI エージェントに、セッションをまたいだ記憶を持たせるプラグインだ。エージェントがツールを使うたびにその中身を記録し、AI で要約・圧縮して保存する。次にセッションを始めると、関係する記録が自動で文脈に差し込まれる。Claude Code のほか、OpenCode、Codex、Gemini、Copilot などにも対応するとしている。

仕組みは、Claude Code のフック（セッション開始、指示の送信、ツールの使用後、停止、セッション終了の5か所）で出来事を拾い、手元で動く常駐サービス（ワーカー）に渡す形だ。記録は SQLite に入り、キーワードでの検索と、Chroma というベクトルデータベースによる意味の近さでの検索を組み合わせて探せる。ワーカーにはブラウザで開ける画面もあり、記録がたまっていく様子を見られる。

過去の記録を探すときは、3段階に分けて読み込む。まず ID つきの短い一覧だけを取り、次に気になる記録の前後の流れを見て、最後に必要なものだけ詳しい中身を取る。README は、詳細を取る前に絞ることで、トークンを約10分の1に節約できるとしている。要約を日本語で残すモード（`code--ja`）もある。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「今日の作業を、次のセッションに持ち越す」とある図。左から「今日のセッション（ツールの使用をフックで拾う）」「ワーカー（AI で要約し、SQLite に保存）」「次のセッション（関係する記録を差し込む）」が矢印でつながる。下に「残したくない内容は &lt;private&gt; で囲めば保存されない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cmem-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">今日の作業を、<tspan fill="#1E5A48">次のセッション</tspan>に持ち越す</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">今日のセッション</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ツールの使用をフックで拾う）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cmem-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ワーカー</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（AI で要約し、SQLite に保存）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cmem-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">次のセッション</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（関係する記録を差し込む）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">残したくない内容は &lt;private&gt; で囲めば保存されない</text>
</svg>

キャプション: セッションが終わっても作業の記録は手元に残り、次に始めたときに必要な分だけ戻ってくる。


## どんなときに使うか

### 毎回、プロジェクトの前提をエージェントに説明し直しているとき

前のセッションで何をしたかが、新しいセッションの冒頭に自動で入る。

### 何日も前に直したバグや決めたことを、エージェントに探させたいとき

記録を検索する道具（MCP）があるので、「あの認証のバグはどう直したか」をエージェント自身に調べさせられる。


## 注意点

**要約にも AI を使う。** インストールの最後に、claude-mem へのサインインを勧められ、サインインすると開発元が用意する要約役を最大14日間無料で使える。期間が終わると、購読しない限り要約は Anthropic のプランの枠で行われる。OpenRouter や Gemini の自分のキーを選ぶこともでき、サインインせずに入れる方法も README に書かれている。

**npm でグローバルに入れるだけでは動かない。** `npm install -g claude-mem` で入るのは SDK だけで、フックは登録されない。`npx claude-mem install` か、Claude Code の `/plugin` で入れる。

**必要なものが自動で入る。** Bun と uv が無ければ、自動でインストールされる。

**README の末尾に暗号資産の話がある。** 第三者が作った「CMEM」というトークンを、作者が公式に支持していると書かれている。
