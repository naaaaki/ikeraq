---
updated: 2026-10-01
image:
image_alt:
---

<!-- ============================================================
  trycua/cua
  https://github.com/trycua/cua
  Scale computer-use 2.0 with open-source drivers, cross-OS fleets, and benchmarks for training, evaluation, and data generation.
  HTML / MIT / スター 27,289
============================================================ -->


## 見出しの一文

AI エージェントに、自分で操作できるパソコンを用意する道具一式


## どういうものか

AI エージェントにパソコンを操作させる（computer use）ための部品を集めたリポジトリだ。開発元は Cua AI。エージェントとモデルは基本的に使う側が持ち込み、Cua は「操作するパソコン」と操作の道具を用意する、という分担になっている。README は、1つの作業の中でエージェントがコード、API、画面の操作を行き来することを「Computer-Use 2.0」と呼んでいる。

エージェントに直接つなぐのは Cua Driver。macOS・Windows・Linux のデスクトップアプリやブラウザの中身を調べて操作する道具で、コマンド・MCP・SDK のどれかでつなぐ。Claude Code、Codex、Cursor などへのつなぎ方が用意されている。アプリと OS が対応していれば、人のマウスを動かさず、手前の画面も奪わずに裏で作業できる。

ほかの部品は次のとおり。Lume は Apple シリコンの Mac の上に macOS や Linux の仮想マシンを作る道具。Cua Fleets はクラウド上の隔離されたデスクトップを貸すサービス（run.cua.ai）。Cua Bench は操作の課題を作ってエージェントを採点し、操作の記録を学習用に書き出す。CUA-S1 は、フォームのどの欄に何を入れるかといった小さな判断に絞った小型モデルで、まだ研究段階の公開だ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「エージェントに使えるパソコンを渡す」とある図。上の段に左から「エージェント（Claude Code・Codex など）」「Cua Driver（アプリを調べて操作する）」「デスクトップのアプリ（macOS・Windows・Linux）」が矢印でつながる。点線の下に「ほかの部品」として「Lume（Mac 上の仮想マシン）」「Cua Fleets（クラウドの隔離デスクトップ）」「Cua Bench（課題でエージェントを採点）」が並ぶ。下に「エージェントは自分で持ち込む。Cua は操作の手段と場所を用意する」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cua-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">エージェントに<tspan fill="#1E5A48">使えるパソコン</tspan>を渡す</text>

  <rect x="30" y="100" width="200" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="130" y="142" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">エージェント</text>
  <text x="130" y="168" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Claude Code・Codex など）</text>

  <line x1="236" y1="148" x2="292" y2="148" stroke="#1E5A48" stroke-width="4" marker-end="url(#cua-arrow)" />

  <rect x="300" y="100" width="200" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="142" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Cua Driver</text>
  <text x="400" y="168" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（アプリを調べて操作する）</text>

  <line x1="506" y1="148" x2="562" y2="148" stroke="#1E5A48" stroke-width="4" marker-end="url(#cua-arrow)" />

  <rect x="570" y="100" width="200" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="142" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">デスクトップのアプリ</text>
  <text x="670" y="168" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（macOS・Windows・Linux）</text>

  <line x1="30" y1="232" x2="770" y2="232" stroke="#17160F" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
  <text x="30" y="258" font-size="12" fill="#17160F" fill-opacity="0.72">ほかの部品</text>

  <rect x="30" y="272" width="200" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="130" y="306" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Lume</text>
  <text x="130" y="330" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Mac 上の仮想マシン）</text>

  <rect x="300" y="272" width="200" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="306" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Cua Fleets</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（クラウドの隔離デスクトップ）</text>

  <rect x="570" y="272" width="200" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="306" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Cua Bench</text>
  <text x="670" y="330" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（課題でエージェントを採点）</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">エージェントは自分で持ち込む。Cua は操作の手段と場所を用意する</text>
</svg>

キャプション: 自分のエージェントはそのままに、パソコンを操作する手段と、操作させてよい場所を後から足せる。


## どんなときに使うか

### API の無いデスクトップアプリを、エージェントに操作させたいとき

Cua Driver を入れて手持ちのエージェントにつなぐと、画面のアプリを調べて操作できる。最初の練習は、電卓で 6 × 7 を計算させ、画面に 42 が出たことをエージェント自身に確かめさせる課題だ。

### 手元の環境を汚さずに、エージェントの操作を試したいとき

Apple シリコンの Mac なら Lume で仮想マシンを作ってその中で試せる。手元に用意したくなければ、Cua Fleets でクラウドのデスクトップを借りる手もある。


## 注意点

**ライセンスが部品ごとに違う。** 本体は MIT だが、一部のフォルダは別のライセンスを持つ。任意で入れる `cua-som` は AGPL-3.0 以上で、Cua Driver の追加機能 `cua-perception` は MIT ではなく AGPL-3.0 のモデルを含む。README は `cua-perception` について、配布したりネット越しに提供したりすると、AGPL のソース公開の義務がかかりうると注意している。

**Cua Fleets はクラウドの有料容量を使う。** README によれば、使い終わったあとも待機ぶんの有料容量が残ることがあるので、チュートリアルの後片付けの手順まで済ませるよう求めている。

**裏での操作は、対応している場合だけ。** マウスを奪わずに作業できるかどうかは、アプリと OS しだいだ。

**CUA-S1 は研究段階。** GitHub にあるのはソースだけの初期版で、モデルの重みは Hugging Face に別に置かれている。
