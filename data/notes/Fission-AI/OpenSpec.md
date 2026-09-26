---
updated: 2026-09-18
image:
image_alt:
---

<!-- ============================================================
  Fission-AI/OpenSpec
  https://github.com/Fission-AI/OpenSpec
  Spec-driven development (SDD) for AI coding assistants.
  TypeScript / MIT / スター 69,000台
============================================================ -->


## 見出しの一文

AIにコードを書かせる前に、何を作るかを文書で決めておく


## どういうものか

AI にコードを書かせるとき、「何を作るか」はたいていチャットの履歴の中だけにある。OpenSpec は、そこに**仕様の層をひとつ足す**道具で、コードが書かれる前に人間と AI が合意するところを作業の中心に置く。README はこれを「要件がチャット履歴の中にしか無い状態」への対処だと説明している。書かれている言語は TypeScript、ライセンスは MIT。

入れるのと更新するのは CLI（`openspec init` など）で、日々の入口はコーディング支援ツール側のスラッシュコマンドになる。`/opsx:explore` で何を作るか相談し、`/opsx:propose` で**変更ひとつぶんのフォルダ**を作る。中には提案・要件・設計・タスクの4つが入る。要件は**ふつうの Markdown** で書かれ、覚える独自の記法は無いと README は書いている。書き方は「〜する」という文と、「こうしたとき、こうなる」という場面の組になっている。そのまま `/opsx:apply` で実装し、`/opsx:archive` でその変更をしまうと、決まった内容が仕様の側に反映される。

コマンドの呼び名は使う道具によって綴りが変わり（`/opsx-propose` や `@opsx-propose` など）、初期化のときに自分の道具に合った形が表示される。README は対応を「30種類以上」と書いている。チーム向けには **Stores** という仕組みがあり、計画だけを別のリポジトリに置いて複数のリポジトリから参照する使い方ができる。ただしこちらは**ベータ**と明記されている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「コードの前に、変更ごとの文書を作る」とある図。左から順に、相談する（どう作るか、先に話す）、提案する（変更フォルダが1つできる）、実装する（タスクを順に消す）、しまう（仕様に反映して保管）が矢印でつながっている。下に「変更フォルダの中身：提案・要件・設計・タスク（すべてMarkdown）」とある。いちばん下に「次の機能に進んでも、決めたことはチャットではなく仕様に残る」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="os-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">コードの前に、<tspan fill="#1E5A48">変更ごとの文書</tspan>を作る</text>

  <rect x="18" y="130" width="160" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">相談する</text>
  <text x="98" y="198" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（どう作るか、先に話す）</text>

  <line x1="184" y1="178" x2="208" y2="178" stroke="#1E5A48" stroke-width="4" marker-end="url(#os-arrow)" />

  <rect x="214" y="130" width="160" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="294" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">提案する</text>
  <text x="294" y="198" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（変更フォルダが1つできる）</text>

  <line x1="380" y1="178" x2="404" y2="178" stroke="#1E5A48" stroke-width="4" marker-end="url(#os-arrow)" />

  <rect x="410" y="130" width="160" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="490" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">実装する</text>
  <text x="490" y="198" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（タスクを順に消す）</text>

  <line x1="576" y1="178" x2="600" y2="178" stroke="#1E5A48" stroke-width="4" marker-end="url(#os-arrow)" />

  <rect x="606" y="130" width="160" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="686" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">しまう</text>
  <text x="686" y="198" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（仕様に反映して保管）</text>

  <text x="400" y="296" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">変更フォルダの中身：提案・要件・設計・タスク（すべてMarkdown）</text>
  <text x="400" y="368" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">次の機能に進んでも、決めたことはチャットではなく仕様に残る</text>
</svg>

キャプション: 効いてくるのは**2回目以降**。前の変更で決めたことが仕様として残るので、次の相談を同じ土台から始められる。


## どんなときに使うか

### 決めたはずのことが、チャットの履歴に埋もれるとき

やり取りの中で決めた仕様は、会話を閉じた時点で追いにくくなる。OpenSpec は変更ごとにフォルダを切り、提案・要件・設計・タスクをファイルとして残す。**リポジトリの中に置かれるので、次に開いた AI も同じものを読める。**

### 複数のリポジトリにまたがる機能を、先に決めたいとき

API とアプリと共通部品に分かれている場合、計画だけを別リポジトリ（Stores）に置いて、各リポジトリから参照する形が取れる。README は「コードが3つのリポジトリに分かれても、計画はひとつ」と説明している。ただしベータ扱いなので、重要な案件でいきなり頼るのは早い。


## 注意点

**Stores はまだベータ。** README 自身がそう書いている。チームで使う前提の機能なので、動かなくなったときの影響も人数ぶんになる。まずは1リポジトリでの使い方から始めるほうが安全だ。

**枠が緩いぶん、進め方は自分で持つことになる。** OpenSpec は、工程ごとに関門を置くやり方（README は Spec Kit をその例に挙げている）と対比して、**どの文書もいつでも直せる**ことを利点として挙げている。裏を返せば、どこまで決まったかを管理するのは書き手の側だということでもある。

**モデルと文脈の条件が付く。** README は推論の強いモデルを勧め、実装に入る前に文脈（コンテキスト）を空にしておくことを勧めている。手元の道具立てによって、同じようには動かない可能性がある。

**匿名の利用統計が既定で送られる。** 送るのはコマンド名と版だけで、引数やパスや中身は含まないと明記されている。設定か環境変数で止められる。動かすのに Node.js 20.19.0 以上が要る。ライセンスは MIT。
