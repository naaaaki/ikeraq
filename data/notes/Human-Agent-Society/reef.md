---
updated: 2026-09-27
image:
image_alt:
---

<!-- ============================================================
  Human-Agent-Society/reef
  https://github.com/Human-Agent-Society/reef
  Infrastructure for continually self‑improving agents
  Python / Apache-2.0 / スター 5,745
  topics: agent-infrastructure, ai-agents, continual-learning, inference, llm, llm-training, reinforcement-learning, self-improving-agents
============================================================ -->


## 見出しの一文

AIエージェントを、使われ方への評価から少しずつ育て続ける


## どういうものか

AIエージェントを「使いながら育てる」ための土台だ。ライセンスは Apache-2.0 で、Python 3.12 以上で動く。Reef 自体がモデルの応答を返すサーバーとして立ち、受けたリクエストとその応答を記録しておく。あとから届いた評価をその記録に結びつけ、評価がたまったらモデルやエージェントの更新を作り、通ったものを新しい版として出す。README はこの1周を「応答する → 評価を照合する → 更新を作る → 公開する」の4段階で説明している。

呼び出し側は、OpenAI や Anthropic と同じ形の窓口にリクエストを送る。応答には受け取り番号が付いてくるので、あとでその番号を添えて点数や文章での評価を送り返す。評価をどう使って何を更新するかは「レシピ」が決める。更新の対象は2種類あり、ひとつはモデルの重み（GPU で学習させる。学習には Slime、応答には SGLang を使う）、もうひとつはエージェントの周りのプロンプト・ルール・スキル（README は「ハーネス」と呼ぶ）だ。

README の比較表では、推論エンジン（vLLM や SGLang）にも学習の仕組み（Slime など）にも無く、Reef にだけある役割として、版の管理、更新の最中も応答を止めないこと、重み以外（スキルやハーネス）も育てることの3つが挙がっている。重みを更新しても Reef を再起動する必要はなく、以後のリクエストには新しい版が使われる。評価で落ちた候補は出されず、いまの版がそのまま応答を続ける。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「使われながら、育つエージェント」とある図。左から「応答する（やりとりを記録）」「照合する（届いた評価を記録に結ぶ）」「更新を作る（重み か ハーネス）」「公開する（通った版だけ出す）」が矢印でつながり、最後から最初へ「次の1周へ」と戻る矢印がある。下に「評価で落ちた候補は出さず、いまの版が応答を続ける」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="rf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">使われながら、<tspan fill="#1E5A48">育つ</tspan>エージェント</text>

  <rect x="18" y="130" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="103" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">応答する</text>
  <text x="103" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（やりとりを記録）</text>

  <line x1="194" y1="186" x2="218" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#rf-arrow)" />

  <rect x="224" y="130" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="309" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">照合する</text>
  <text x="309" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（届いた評価を</text>
  <text x="309" y="216" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">記録に結ぶ）</text>

  <line x1="400" y1="186" x2="424" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#rf-arrow)" />

  <rect x="430" y="130" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="515" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">更新を作る</text>
  <text x="515" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（重み か ハーネス）</text>

  <line x1="606" y1="186" x2="630" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#rf-arrow)" />

  <rect x="636" y="130" width="150" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="711" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">公開する</text>
  <text x="711" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（通った版だけ出す）</text>

  <polyline points="711,248 711,300 103,300 103,256" fill="none" stroke="#1E5A48" stroke-width="4" marker-end="url(#rf-arrow)" />
  <text x="407" y="324" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">次の1周へ</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">評価で落ちた候補は出さず、いまの版が応答を続ける</text>
</svg>

キャプション: 使うこと・評価すること・育てることが1本の輪になっていて、育てている間もエージェントは止まらない。


## どんなときに使うか

### 自分の頼み方に合わせて、エージェントの癖を直していきたいとき

付属のレシピ「Reefine」を使うと、GPU なしでモデルの API だけで回せる。README の例では「バグ修正を頼んだら、まず失敗するテストで再現して」と言葉で頼むと、使っているモデルがその変更をスキルやルールとして書き、新しい版として入れられるようになる。

### 正誤を判定できる課題を解かせ続けて、モデル自体を伸ばしたいとき

数学の問題のように採点できる課題の流れや、測れる目標がひとつある難問に繰り返し挑ませる場合は、重みを学習させるレシピが用意されている。こちらは学習用の GPU 環境が要る。


## 注意点

**重みを育てるには GPU の学習環境が要る。** GPU が要らないのはハーネスを育てる場合だけで、その場合もモデルの接続先と、代表的な課題、評価の仕組みは自分で用意する。

**レシピの多くはパッケージに入っていない。** `reef-infra` として配られるのは本体と Reefine だけで、ほかのレシピはリポジトリの `recipes/` にある。試すならソースから入れることになる。成果物の保存に `git-lfs` も要る。

**変更を試しに動かすには、隔離の方法を選ぶ必要がある。** 手元で隔離するなら、Linux で `bwrap` と `pasta` を使い root 以外で動かせることが条件になる。ほかに、Reefine のガイドには E2B というクラウドの隔離環境を使う方法（E2B の API キーが要る）と、隔離を切る設定がある。隔離を切るのは信頼できる機械に限るよう README も書いている。

**Reefine の既定の設定は認証なしで待ち受ける。** 手元（127.0.0.1）だけとはいえ、`REEF_TOKEN` を設定してから起動しないとトークンを求めない。

**リポジトリは2026年8月末に作られたばかり。** レシピの名前が変わった例もすでにある（Reefine の旧名 `harness-evolve`）。
