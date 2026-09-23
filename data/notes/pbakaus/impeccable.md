---
updated: 2026-09-14
image:
image_alt:
---

<!-- ============================================================
  pbakaus/impeccable
  https://github.com/pbakaus/impeccable
  The design language that makes your AI harness better at design.
  JavaScript / Apache-2.0 / スター 67,753
============================================================ -->


## 見出しの一文

AI が作る画面の「どれも同じ見た目」を、決まった検査で見つけて直させる


## どういうものか

コーディングエージェントに、画面のデザインをまともにさせるための道具立て。Anthropic が公開した frontend-design スキルから始めたものだ、と作者は書いている。問題意識ははっきりしていて、**どのモデルも同じような SaaS のテンプレートで学習しているので、放っておくと同じ癖が出る**——書体は何でも Inter、紫から青のグラデーション、カードの中にまたカード、色のついた背景に灰色の文字、見出しの上に必ず置かれる角丸のアイコン。この「AI が作った感じ」を、道具の側で潰しにいく。

入口は1つのスキルで、その下に23のコマンドが並ぶ。`polish`（仕上げ）、`audit`（技術面の点検）、`critique`（UX のレビュー）、`distill`（削ぎ落とす）、`bolder` / `quieter`（強める・抑える）、`animate`、`harden`（例外やはみ出しの処理）といった具合に、**AI と共有する言葉としてコマンドが用意されている**。最初に一度 `init` を実行すると、誰のための製品か・目的・制約・語り口といった変わりにくい事実が `PRODUCT.md` に書き出される。見た目の方向性はそれとは別に `DESIGN.md` に記録され、混ざらないように分けてある。

面白いのは、**LLM を一切使わない検査が付いていること**。61個の決め打ちのルールを持った検出器があり、上に挙げたような癖に加えて、行が長すぎる、余白が詰まりすぎ、押せる領域が小さい、見出しの階層が飛んでいる、といった一般的な品質の問題も機械的に拾う。ディレクトリでも HTML ファイルでも公開中の URL でも走らせられて、JSON で出せば CI に載せられる。API キーは要らない。さらに、フックに対応している5つのツール（Claude Code、GitHub Copilot、Codex、Cursor、Grok Build）では、**画面のファイルを編集すると、その場でこの検出器が走る**。指摘の戻り方は3通りで、Cursor は書き込む前に止める。Claude Code・GitHub Copilot・Codex は編集のあとに返す。Grok Build だけは、走るのは編集のあとでも、指摘が届くのは手が止まったときになる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI の手癖を、LLM を使わない検査で止める」とある図。「エージェントが書く（画面のコード）」から「61 の決まったルール（紫のグラデ、カードの入れ子…）」を通って「指摘が戻る（直してから次へ）」へ進む。「Cursor だけは書き込む前に止める」と添えてある。「同じルールは、CI でも公開中の URL でも走る」とある。下に「LLM も API キーも要らない。ここだけは判断がぶれない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ip-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">AI の手癖を、<tspan fill="#1E5A48">LLM を使わない検査</tspan>で止める</text>

  <rect x="30" y="160" width="190" height="105" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="125" y="204" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">エージェントが書く</text>
  <text x="125" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（画面のコード）</text>

  <line x1="220" y1="212" x2="273" y2="212" stroke="#1E5A48" stroke-width="4" marker-end="url(#ip-arrow)" />

  <rect x="281" y="160" width="230" height="105" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="396" y="204" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">61 の決まったルール</text>
  <text x="396" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（紫のグラデ、カードの入れ子…）</text>

  <line x1="511" y1="212" x2="569" y2="212" stroke="#1E5A48" stroke-width="4" marker-end="url(#ip-arrow)" />

  <rect x="577" y="160" width="188" height="105" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="671" y="204" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">指摘が戻る</text>
  <text x="671" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（直してから次へ）</text>

  <path d="M671,282 L671,320 L125,320 L125,282" fill="none" stroke="#1E5A48" stroke-width="4" stroke-dasharray="9 7" marker-end="url(#ip-arrow)" />
  <text x="398" y="346" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.7">Cursor だけは書き込む前に止める</text>

  <text x="398" y="378" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.7">同じルールは、CI でも公開中の URL でも走る</text>

  <text x="400" y="418" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">LLM も API キーも要らない。ここだけは判断がぶれない</text>
</svg>

キャプション: デザインの良し悪しを AI に問い直すのではなく、**「これは避ける」を機械が読める形に固めてある**。ぶれない部分は、ぶれない仕組みのほうに置いてある。


## どんなときに使うか

### エージェントに書かせた画面が、毎回同じ顔になるとき

出てきたものを見て「なんか見たことある」と思うが、どこを直せと言えばいいか出てこない——という状態を、言葉のほうから崩しにいく道具になる。`bolder`／`quieter`のように、**方向だけを指す言い方**が最初から用意されている。

### 直す基準を、レビューする人の目から外に出したいとき

「余白が狭い」「その紫はやめて」を毎回言うのは続かない。言う側が疲れるうえ、言い忘れた回だけ抜ける。決まった型の指摘は、LLM を通さない検査のほうに渡してしまえる。


## 注意点

**検査が通っても、デザインが良い証明にはならない。** README 自身が「検出器がきれいでも、視覚やアクセシビリティの品質が保証されるわけではない。画面を実際に見るのを置き換えるものではない」と断っている。避けるべきものを避けたかどうかしか見ていない。

**フックの動きは先に把握しておいたほうがいい。** Claude Code では、入ったフックがモデルへの承認とは別に走る。README も「最初の編集でエンジンを取りに行くことがあるので、無人で回す前に入っているフックを確認してほしい」と注意している。人が見ていない自動実行に組み込む前に、ここは読んでおく場所になる。

**ライブモードは手元専用。** ブラウザ上で要素をいじる機能は、手元の開発サーバーか静的 HTML に対して使うもので、**公開中の本番サイトに差し込むのは非対応**と明記されている。動かすためにブラウザの保護や CSP を緩めるな、とも書いてある。公開中のページを見たい場合は、URL を検査するほうを使う。

**規則には好みの向きがある。** 「よく使われる書体は避ける」といった項目は、ブランドで書体が決まっている場合と正面からぶつかる。個別に除外する仕組みは用意されているので、**自分たちの決まりのほうを先に持っているなら、外す作業が要る**と思っておくほうがよい。

**ライセンスは Apache 2.0。**
