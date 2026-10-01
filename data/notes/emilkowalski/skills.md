---
updated: 2026-10-02
image:
image_alt:
---

<!-- ============================================================
  emilkowalski/skills
  https://github.com/emilkowalski/skills
  Skills For Designers and Engineers
  Markdown / MIT / スター 42,464
============================================================ -->


## 見出しの一文

AI に動きと見た目の判断基準を渡して、UI の小さな失敗を減らす


## どういうものか

AI のコーディングエージェントに読ませる「スキル」（作業の手引きをまとめた Markdown ファイル）の詰め合わせだ。作者は、トースト通知のライブラリ Sonner の作者でもある Emil Kowalski。README によれば、中身は Vercel や Linear で働いた経験をもとにしている。テーマの中心はアニメーションで、ほかに見た目の設計、モバイルでの使い心地、Swift の書き方なども入っている。

作った理由として README が挙げるのは「エージェントにはあまりセンスがない」こと。たとえば、画面に入ってくる動きには ease-out を使うべきところで ease-in を選ぶ。半透明の影を使うべきところで、不透明な枠線を引く。こうした小さな選択の積み重ねで、画面の印象が決まってしまう。スキルには、エージェントが起こしうる小さな失敗と、その直し方が並んでいる。

README に並ぶスキルは13本。土台になる emil-design-eng のほか、ゼロから動きを作る、既存の動きを厳しく見直す、コード全体の動きを点検して直す計画を出す、動きを付けるべき場所を探す、といった用途別のものがある。土台のスキルは「そもそも動かすべきか」「何のための動きか」「どのイージングか」「どのくらいの速さか」の順で判断させる作りになっている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI に足りない「目利き」を、スキルで外から渡す」とある図。左から「AI エージェント（センスは足りない）」「スキル（動きと見た目の判断基準）」「仕上がった UI（イージングや影の選び方を正す）」が矢印でつながる。下に「基準は、作者が Vercel や Linear で積んだ経験から」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ek-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">AI に足りない「<tspan fill="#1E5A48">目利き</tspan>」を、スキルで外から渡す</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（センスは足りない）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#ek-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">スキル</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（動きと見た目の判断基準）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#ek-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">仕上がった UI</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（イージングや影の選び方を正す）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">基準は、作者が Vercel や Linear で積んだ経験から</text>
</svg>

キャプション: エージェントが自分では持っていない、動きと見た目の判断基準を外から足す。


## どんなときに使うか

### AI に作らせた画面の動きが、なんとなく安っぽいとき

どこが悪いのか言葉にできないまま、作り直しを繰り返している場面に向く。見直し用のスキルを使えば、作者のルールに照らして指摘させられる。

### 欲しい動きを、AI にうまく伝えられないとき

動きを言い表す語彙を集めたスキル（animation-vocabulary）がある。正しい言葉で頼めば、狙った動きに近づけやすい、という考え方だ。


## 注意点

**基準は主に作者の経験にもとづく（Apple の講演をまとめたスキルもある）。** 好みや、所属するチームのデザイン方針と食い違うことはありうる。

**中心はアニメーション。** 13本のうち多くが動きの話で、配色やレイアウトの全般を見てくれるものではない。

**ライセンスは MIT。**
