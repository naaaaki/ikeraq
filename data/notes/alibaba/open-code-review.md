---
updated: 2026-09-16
image:
image_alt:
---

<!-- ============================================================
  alibaba/open-code-review
  https://github.com/alibaba/open-code-review
  Fast, efficient, battle-tested at Alibaba's scale. Hybrid architecture code review tool: deterministic pipelines + LLM Agent, precise line-level comments, built-in multi-language ruleset (NPE, thread-safety, XSS, SQL injection), OpenAI & Anthropic compatible.
  Go / Apache-2.0 / スター 28,445
============================================================ -->


## 見出しの一文

AI に任せる範囲を前後から挟んで、レビューの指摘が行からずれるのを抑える


## どういうものか

コードレビューを AI にやらせる、ターミナルで動く道具。変更の差分を読み、変わったファイルを、設定したモデルに渡す。返ってくるのは**どの行への指摘か**まで付いた形の講評で、モデルは差分だけでなく、ファイル全体を読んだり、リポジトリの中を検索したり、同じ変更にある別のファイルを見に行ったりできる。差分が無いコードをまとめて見たいときのために、ファイル全体を対象にする `ocr scan` も用意されている。README によると、もとはアリババ社内の公式の AI レビュー係として2年ほど使われてきたもので、それを社外に出したのがこのリポジトリだという。

作りの中心にあるのは、**決まった手順と AI の分担**という考え方。README は、汎用のコーディングエージェントにレビューをさせたときに起きることを3つ挙げている。変更が大きいと一部のファイルだけ見て済ませてしまう、指摘の場所が実際のコードとずれる、書き方を少し変えただけで結果が揺れる。原因は「全部を言葉で指示している」ことにある、という立場だ。そこで、間違えては困る工程は言葉ではなくプログラムの側で決める。**どのファイルを見るかの選別、関連するファイルを一つの単位に束ねること、ファイルの性質に応じた規則の割り当て、そして指摘の位置合わせと見直し**。束ねられた単位はそれぞれ別の文脈を持つ子エージェントとして動くので、変更が大きくなっても分けて進められる。

AI の側に残すのは、その場で決める仕事と、必要な材料を自分で取りに行く仕事に絞られる。プロンプトはレビュー向けに練り直してあり、効きをよくしながらトークンの消費も抑えられる、と書かれている。渡す道具のほうも、実際の運用で集めた呼び出しの記録を分析したうえで、この用途のために組み直したものだという。README はこの設計の裏づけとして自前の測定を載せていて、同じモデルを使った汎用エージェント（Claude Code）と比べると、**指摘の当たっている率と F1 は上回り、使うトークンはおよそ9分の1**、ただし**見つけられる欠陥の割合（再現率）は下回る**としている。取りこぼしより誤検知を減らすほうを選んだ、意図的な交換だと書かれている。測定の土台は、50 のリポジトリ・200 件の実際のプルリクエスト・10 の言語から作り、80人以上の技術者が突き合わせた 1,505 件の正解データだという。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI に任せる範囲を、前後から挟んで狭くする」とある図。左は「決まった手順」で 対象を選ぶ、関連ファイルを束ねる、規則を割り当てる。中央は「AI エージェント」で 束ごとに読む、足りなければ探しに行く。右は「位置合わせと見直し」で 指摘を行に当てる、内容を確かめ直す。その先に「行単位の指摘」。下に「見落としの少なさより、当たっている率のほうへ振ってある」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ocr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">AI に任せる範囲を、<tspan fill="#1E5A48">前後から挟んで</tspan>狭くする</text>
  <rect x="20" y="106" width="225" height="184" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="132" y="144" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">決まった手順</text>
  <text x="132" y="186" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">対象を選ぶ</text>
  <text x="132" y="218" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">関連ファイルを束ねる</text>
  <text x="132" y="250" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">規則を割り当てる</text>
  <line x1="245" y1="198" x2="283" y2="198" stroke="#1E5A48" stroke-width="4" marker-end="url(#ocr-arrow)" />
  <rect x="287" y="106" width="225" height="184" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="399" y="144" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="399" y="192" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">束ごとに読む</text>
  <text x="399" y="230" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">足りなければ探しに行く</text>
  <line x1="512" y1="198" x2="551" y2="198" stroke="#1E5A48" stroke-width="4" marker-end="url(#ocr-arrow)" />
  <rect x="555" y="106" width="225" height="184" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="667" y="144" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">位置合わせと見直し</text>
  <text x="667" y="192" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">指摘を行に当てる</text>
  <text x="667" y="230" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">内容を確かめ直す</text>
  <line x1="667" y1="290" x2="667" y2="326" stroke="#1E5A48" stroke-width="4" marker-end="url(#ocr-arrow)" />
  <text x="667" y="358" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">行単位の指摘</text>
  <text x="400" y="414" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">見落としの少なさより、当たっている率のほうへ振ってある</text>
</svg>

キャプション: AI を賢くするのではなく、**AI が間違えられる場所をあらかじめ減らしておく**という考え方でできている。


## どんなときに使うか

### 変更が大きく、AI に見てもらっても全部は見てくれないとき

README が最初に挙げている不満がこれで、対象を選んで束に分ける工程を、モデルではなくプログラムの側に持たせてある。束はそれぞれ別の文脈で動くので、まとめて1回のやりとりに詰め込む形にはならない。

### 指摘の場所が実際のコードと合わず、毎回読み替えているとき

指摘を行に当て直す部分と、内容を見直す部分が、レビュー本体とは別に置かれている。README がこの道具を作った理由として挙げているのも、この「場所のずれ」だ。


## 注意点

**取りこぼしは増える前提で選ばれている。** README 自身が、汎用エージェントより再現率は低いと明記している。誤検知を減らすためにそう振ったと書かれているので、**漏れなく洗い出したい**用途には向きの違う道具になる。

**掲載されている比較は、作った側が出した測定。** 条件（同じモデルを使い、比較相手は Claude Code）は書かれていて、正解データのほうは80人以上で突き合わせたうえで公開もされている。ただし測定そのものを第三者がやり直した結果ではないので、数字をそのまま自分の環境の見込みにはできない。

**モデルの用意は自分でする。** 使う前にモデルの接続先を設定する必要がある（README には、手元のコーディングエージェントにレビューそのものをやらせる「委任」の使い方もあり、そちらはモデルの設定が要らないと書かれている）。動かすには Git 2.41 以上が要る。

**ライセンスは Apache-2.0。**
