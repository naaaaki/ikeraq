---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  nextlevelbuilder/ui-ux-pro-max-skill
  https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  An AI skill that provides design intelligence for building professional UI/UX across multiple platforms.
  Python / MIT / スター 130,000台
============================================================ -->


## 見出しの一文

AIに画面を作らせる前に、業種に合うデザインの決まりごとを先に引かせる


## どういうものか

Claude Code や Cursor などのコーディングAIに入れて使う、画面デザインの知識の詰め合わせ（スキル）だ。ライセンスは MIT。中身は、デザインの見本を表にしたデータと、それを引く Python のスクリプトでできている。README によれば、業種の分類とそれぞれのルールが192、画面の見た目の系統（スタイル）が79（通常のおすすめに出るのは50）、配色が192、書体の組み合わせが74、ページ構成の型が34ある。

「美容サロンの紹介ページを作って」のように頼むと、AIはまずこのスキルを使って業種を検索し、その業種のルールを引く。ルールにある配色や書体の雰囲気、ページ構成を手がかりに、スタイル・配色・ページ構成・書体を検索する。結果は、使うべき配色・書体・ページ構成・効果に、「銀行なら紫とピンクのグラデーションは避ける」といった業種ごとの**やってはいけない表現**と公開前の確認項目を加えた、ひとまとめの「デザインの決まりごと」として出てくる。AIはそれに沿って画面のコードを書く。

検索とルールの照合を受け持つスクリプトは、Python の標準機能だけで動き、ネットにもつながない。つまり、どのデザインを選ぶかを決めているのは表とルールで、AIはその結果を読んで使う側に回る。出した決まりごとはファイルに保存でき、全体の決まりとページごとの上書きを分けて持てるので、別の日の作業でも同じデザインを引き継げる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「作る前に、デザインの決まりごとを引く」とある図。左に「依頼（美容サロンの紹介ページを作って）」、次に「業種ごとのルール（業種を検索して引く）」、次に「4つの検索（スタイル・配色・構成・書体）」、最後に「デザインの決まりごと（避ける表現も含めてまとめる）」が矢印でつながっている。下に「検索とルールの照合は、Python の標準機能だけで動き、ネットにつながない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="uu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">作る前に、<tspan fill="#1E5A48">デザインの決まりごと</tspan>を引く</text>

  <rect x="18" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="103" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">依頼</text>
  <text x="103" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（美容サロンの</text>
  <text x="103" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">紹介ページを作って）</text>

  <line x1="194" y1="206" x2="218" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#uu-arrow)" />

  <rect x="224" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="309" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">業種ごとのルール</text>
  <text x="309" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（業種を検索して</text>
  <text x="309" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">引く）</text>

  <line x1="400" y1="206" x2="424" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#uu-arrow)" />

  <rect x="430" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="515" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">4つの検索</text>
  <text x="515" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（スタイル・配色・</text>
  <text x="515" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">構成・書体）</text>

  <line x1="606" y1="206" x2="630" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#uu-arrow)" />

  <rect x="636" y="150" width="150" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="711" y="188" text-anchor="middle" font-size="14" font-weight="700" fill="#1E5A48">デザインの決まりごと</text>
  <text x="711" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（避ける表現も</text>
  <text x="711" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">含めてまとめる）</text>

  <text x="400" y="360" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">検索とルールの照合は、Python の標準機能だけで動き、ネットにつながない</text>
</svg>

キャプション: デザインの判断を AI の思いつきに任せず、業種ごとに用意された表とルールから先に決めてしまう。


## どんなときに使うか

### AIに作らせた画面が、どれも似たような見た目になってしまうとき

業種ごとにスタイル・配色・書体の候補とルールが用意されているので、医療・金融・飲食など、何のサービスかに合わせた見た目から始められる。

### 何ページも作るうちに、デザインがばらばらになるのを防ぎたいとき

決まりごとをファイルに保存しておけば、ページごとに AI に読ませて同じ配色・書体で作らせられる。例外があるページだけ、上書きのファイルを足せばよい。


## 注意点

**「AIの推論」ではなく、表とルールの検索。** README は「AIによる推論エンジン」と書いているが、実際に組み立てているのは Python のスクリプトによる検索とルールの照合だ（README 自身も、検索の方式が BM25 というキーワード検索であることは書いている）。業種の分け方やルールの中身が自分の考えと合うかは、表を見て確かめる必要がある。

**Python が要る。** 検索のスクリプトを動かすには Python 3 が入っている必要がある。README は、AIに勝手に入れさせず、利用者に頼むようにスキルへ指示してあると書いている。

**有料版との線引き。** このリポジトリは無料の基本版で、UI の知識と決まりごとの生成が入っている。ロゴやブランドの一式、スライド、AIによる画像づくり、大人数のチーム向けにより大きく組んだデザインの決まりごと（デザイントークン）などは有料版の機能だ。

**指定しなければ HTML＋Tailwind で作られる。** React・Vue・SwiftUI・Flutter など22の技術向けの指針もあるが、頼むときに使う技術を伝える必要がある。
