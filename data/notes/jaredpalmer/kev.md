---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  jaredpalmer/kev
  https://github.com/jaredpalmer/kev
  Jev-like family of decision models built on top of Qwen3.5/3.8 you can train and run on your own
  Python / Apache-2.0 / スター 7,000台
============================================================ -->


## 見出しの一文

有料APIの判断モデル「Jev」の代わりを、自分のマシンで動かして鍛える


## どういうものか

TypeSafe が API として提供している判断用モデル「Jev」と同じ呼び方で使える、小さな判断用モデルの一式だ。作者は Jared Palmer。ライセンスは Apache-2.0。Qwen3.5・Qwen3.8 をもとに、0.8B・4B・9B・27B の4つの大きさが公開されている。0.8B は Apple Silicon の Mac でも動き、27B は 80GB の GPU が要る。

使い方は Jev と同じで、文章を1つ渡し、そこへの問いをいくつもまとめて投げる。問いの形は、はい・いいえ（`noul`）、選択肢から選ぶ（`choice`）、段階で測る（`score`）の3種類。答えは文章ではなく**確率つき**で返る。問い同士はお互いを読めない作りなので、ある問いの答えが別の問いに引きずられない。API の形が Jev と同じなので、TypeSafe の Python SDK は送り先を変えるだけでそのまま使える。

もう1つの柱は、**自分のデータで追加学習できる**こと。問いと正解を並べたファイルを用意して、公開済みのモデルから学習を続けさせる。コーディングエージェント向けのスキルを入れると、既存のコードから Jev への問いを見つけ、学習し、元のモデルと比べ、使える API として公開するまでを、GPU を借りられる Modal の上で進める。README は、4B の学習1回を H100 で約1ドルとしている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「Jevと同じ呼び方で、自分で動かす」とある図。左に「文章と問い（はい・いいえ／選ぶ／段階で測る）」、次に「Kev（自分のマシン・GPUで動く判断モデル）」、次に「確率つきの答え（問いごとに独立）」があり、そこから「自動で処理（自信のあるもの）」と「人に回す（自信のないもの）」の2つに矢印が分かれている。下に「TypeSafe の SDK は、送り先を変えるだけでそのまま使える」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="kv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">Jevと同じ呼び方で、<tspan fill="#1E5A48">自分で動かす</tspan></text>

  <rect x="18" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="103" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">文章と問い</text>
  <text x="103" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（はい・いいえ／選ぶ／</text>
  <text x="103" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">段階で測る）</text>

  <line x1="194" y1="206" x2="218" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#kv-arrow)" />

  <rect x="224" y="150" width="170" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="309" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Kev</text>
  <text x="309" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自分のマシン・GPUで</text>
  <text x="309" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">動く判断モデル）</text>

  <line x1="400" y1="206" x2="424" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#kv-arrow)" />

  <rect x="430" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="515" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">確率つきの答え</text>
  <text x="515" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（問いごとに独立）</text>

  <line x1="606" y1="194" x2="630" y2="168" stroke="#1E5A48" stroke-width="4" marker-end="url(#kv-arrow)" />
  <line x1="606" y1="218" x2="630" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#kv-arrow)" />

  <rect x="636" y="118" width="150" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="711" y="152" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">自動で処理</text>
  <text x="711" y="176" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自信のあるもの）</text>

  <rect x="636" y="214" width="150" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="711" y="248" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">人に回す</text>
  <text x="711" y="272" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自信のないもの）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">TypeSafe の SDK は、送り先を変えるだけでそのまま使える</text>
</svg>

キャプション: 答えを1つに決めつけず確率で返すので、確信の持てるものだけを自動にし、残りを人に回す組み方ができる。


## どんなときに使うか

### Jev を使っているが、判断させる文章を外に出したくないとき

呼び出し側のコードは送り先を変えるだけでよい。手元のマシンや自分の GPU サーバーで動かせば、判断のたびに文章を外部の API に送らずに済む。

### 自社の振り分けルールに合わせて、判断を鍛え直したいとき

公開モデルは、公開データと生成した例で学習している。README は、自社独自の分類や別の言語の問いなら、問いの書き方を工夫するより、短い追加学習のほうが効くことが多いとしている。


## 注意点

**自動に回せる割合は、まだ Jev に届かない。** README によれば、学習に使っていない種類のデータでの正解率は、27B で Jev に1ポイント差まで近づいた（開発用データでの比較。Jev はテスト用データでは測っていない。README は、Jev の学習データが分からないので厳密な比較ではないとも書いている）。ただし、誤りを5%までに抑えた場合に自動で処理できる割合は、Kev が0.45〜0.57、Jev が0.70。確信度の基準は、自分のデータで確かめてから決める必要がある。

**知識を問う問題には弱い。** 知識の問題は元のモデルの力で決まり、README の比較では MMLU で Kev-9B が0.74、Jev が0.90。日付の引き算も苦手で、日数を文中に書き足す設定が用意されている。

**選択肢の並び順で答えが変わることがある。** 問い同士は独立しているが、同じ問いの中の選択肢どうしは影響し合うことがある、と README は書いている。

**長い文章は学習の範囲外。** 学習に使った文章は384トークンまで。それより長い文章も受け付けるが、長い文書では精度が落ちる。27B はこの点で小さいモデルより強い。

**手元のサーバーは、既定では鍵なしで開いている。** README によれば、既定では自分のマシンからしか接続できず、鍵もかかっていない。鍵は `KEV_API_KEY` を設定するとかけられる。ほかのマシンからも使えるようにするなら、鍵をかけておくほうが安全だ。

**27B の元モデルの学習データは分かっていない。** README は、27B が Qwen の追加学習済みの版をもとにしていて、その学習内容を把握していないと書いている。学習に使ったデータセットには、それぞれ別のライセンスがある。

**公開から日が浅い。** リポジトリが作られたのは2026年9月17日。
