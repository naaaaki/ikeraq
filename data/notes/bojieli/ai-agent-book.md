---
updated: 2026-09-18
image:
image_alt:
---

<!-- ============================================================
  bojieli/ai-agent-book
  https://github.com/bojieli/ai-agent-book
  《深入理解 AI Agent：设计原理与工程实践》（李博杰 著）
  Python / Apache-2.0 / スター 48,000台
============================================================ -->


## 見出しの一文

AIエージェントの教科書を、実験のコードごと全部公開している


## どういうものか

中国語で書かれた技術書『深入理解 AI Agent：設計原理与工程実践』（李博杰 著）の、本文そのものを置いたリポジトリ。本文・図・実験のコードが公開されていて、PDF と EPUB は配布物として無料で落とせる。ブラウザで読めるサイトも用意されている。ライセンスは Apache-2.0。

本は **「エージェント ＝ LLM ＋ 文脈 ＋ 道具」** というひとつの式を軸に置き、10章でそこを順にたどる構成になっている。入門、文脈の設計、記憶と知識、道具（MCP を含む）、コーディング用エージェント、やり取りの広げ方（音声や画面操作など）、評価、モデルの追加学習、運用しながらの改善、複数エージェントの協調、という並び。**各章に実験が付いていて、リポジトリ全体では109本**。ただし全部がそのまま動くわけではなく、README は「動かせる」「再現する」「設計のみ」の3種類に分けている。

実験は Python で、章ごとに依存関係を入れる形になっている（README は Python 3.11〜3.13 を対象として挙げている）。モデルを呼ぶ実験では、自分で用意した API キーを設定して動かす。原著は中国語で、日本語を含む各国語版は**有志による翻訳**。README 自身が「翻訳版は中国語の原版より遅れることがある」と断っている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「エージェント ＝ LLM ＋ 文脈 ＋ 道具 を10章で追う」とある図。左に3つの箱が並ぶ。LLM（考える部分）、文脈（何を知らせるか）、道具（何をさせるか）。矢印の先に「エージェント」（この本が扱うもの）がある。下に「各章の本文に実験が付く（全10章・109本。動かせるものと設計だけのものがある）」とある。いちばん下に「原著は中国語。日本語版は有志の訳で、原版より遅れることがある」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ab-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="25" font-weight="700" fill="#17160F">エージェント ＝ <tspan fill="#1E5A48">LLM ＋ 文脈 ＋ 道具</tspan> を10章で追う</text>

  <rect x="20" y="140" width="140" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="90" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">LLM</text>
  <text x="90" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（考える部分）</text>
  <text x="175" y="196" text-anchor="middle" font-size="20" fill="#17160F" fill-opacity="0.6">＋</text>

  <rect x="190" y="140" width="140" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="260" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">文脈</text>
  <text x="260" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（何を知らせるか）</text>
  <text x="345" y="196" text-anchor="middle" font-size="20" fill="#17160F" fill-opacity="0.6">＋</text>

  <rect x="360" y="140" width="140" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="430" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">道具</text>
  <text x="430" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（何をさせるか）</text>

  <line x1="508" y1="190" x2="548" y2="190" stroke="#1E5A48" stroke-width="4" marker-end="url(#ab-arrow)" />

  <rect x="556" y="140" width="220" height="100" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="666" y="184" text-anchor="middle" font-size="18" font-weight="700" fill="#1E5A48">エージェント</text>
  <text x="666" y="212" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（この本が扱うもの）</text>

  <text x="400" y="310" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">各章の本文に実験が付く（全10章・109本。動かせるものと設計だけのものがある）</text>
  <text x="400" y="376" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">原著は中国語。日本語版は有志の訳で、原版より遅れることがある</text>
</svg>

キャプション: この本の立ち位置は**式ひとつ**に出ている。エージェントを製品名ではなく、3つの要素の組み合わせとして分解して扱う。


## どんなときに使うか

### 断片的に覚えたことを、いちど順番に並べ直したいとき

文脈の設計、記憶、道具、評価、追加学習といった話題を、ひとつの式の下で章立てにしている。**個別の記事で拾ってきた知識の、抜けている場所が見える**タイプの読み物になっている。

### 読んだだけで分かった気になりたくないとき

章ごとに実験が付いている。動かせる種類のものは手元で試せるので、API キーの用意は要るが、**読む→動かす→次の章**という進み方ができる。


## 注意点

**原著は中国語。** 日本語版は有志の翻訳で、README も原版より遅れることがあると書いている。最新の内容を確かめたいときは、中国語版か、更新の反映されるオンライン版を見ることになる。

**版が新しくなって章の並びが変わっている。** README は 1.4 版から 2.0 版への変更として、章の統合と番号のずれを説明している。古い PDF を持っている場合は、章番号で人と話が食い違う。

**実験を動かすには自分の支度が要る。** Python の環境、章ごとの依存関係、モデルの API キー。README が挙げている API の提供元は中国のサービスが中心（世界向けの中継サービスも入っている）で、ここは読む人の環境によって置き換えが必要になる。ブラウザや CUDA など、実験ごとに追加で必要になるものもある。さらに一部の章の実験は、対応する外部リポジトリ（README は22件としている）を自分で取ってくる前提になっている。

**協賛が入っている。** README の中ほど、API キーの節のすぐ後に、API の中継サービスによる協賛の表示がある。紹介されている提供元の並びは、そこと切り離して読むほうがいい。ライセンスは Apache-2.0。
