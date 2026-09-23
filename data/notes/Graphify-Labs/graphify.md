---
updated: 2026-09-05
image:
image_alt:
---

<!-- ============================================================
  Graphify-Labs/graphify
  https://github.com/Graphify-Labs/graphify
  Turn any codebase, with its docs, SQL schemas, configs, and PDFs, into a queryable knowledge graph.
  Python / Apache-2.0 / スター 113,994
============================================================ -->


## 見出しの一文

コードも資料も1枚のつながりにして、読んだのか推測したのかを残す


## どういうものか

リポジトリ、設計資料、SQLのスキーマ、設定ファイル、PDF、スクリーンショット——種類の違うファイルをまとめて読み込み、そこに出てくる概念を点、概念どうしの関係を線にした1枚のグラフを作る。作ったあとはコマンドラインから、ふつうの言葉で聞いて関係する範囲を切り出す（`query`）、2つの点のあいだの道をたどる（`path`）、ある点が何なのか説明させる（`explain`）といった聞き方ができる。`--watch` を付ければファイルの変更に追従し、`--wiki` でグラフから Markdown のウィキを書き出す。

読み方はファイルの種類で切り替わる。**コードは tree-sitter で構文木にして、呼び出し関係もたどる**（tree-sitter の文法37種、約40言語）。Markdown やテキストは LLM に概念を抜き出させ、画像もモデルに読ませる。読ませる先は、使っている AI アシスタントのモデルか、自分で設定した API キーの先になる。コード中の `# WHY:` のようなコメントや、ADR・RFC への参照は、それが説明している対象と結びついた別の点として取り込まれる。**つまりコードの部分は機械的に、文章の部分はLLMで、と役割が分かれている。**

この道具の姿勢がいちばん出ているのは、**線の引き方を隠さない**ところ。1本1本の線に `EXTRACTED`（そのまま書いてあった）/ `INFERRED`（推測した）/ `AMBIGUOUS`（確信が持てない）のどれかが付く。つないだ根拠を文章で書いてくれるわけではないが、読み取ったものと推測したものが混ざらない。似ているかどうかの数値だけを返す作りをあえて避けており、ベクトルの保管場所も持たない。まとまりの検出には Leiden 法も使える（別に入れる必要があり、Python 3.13 未満向け）。`--update` を付けると、変わったファイルだけを読み直す。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「読み方は分けて、つなぎ先は1枚にまとめる」とある図。左に3つの入り口が縦に並び、上から「コード（構文木と呼び出し関係）」「文書・PDF（LLM が概念を抜く）」「画像（視覚で読む）」。3本の線が1つにまとまって、中央の「知識グラフ」へ矢印で入る。知識グラフの箱には点と線が描かれ、「（線ごとに、読んだのか推測したのかが付く）」と添えられている。そこから右へ矢印が伸び、「問い合わせ（探す・たどる・説明させる）」に至る。下に、線には「そのまま書いてあった／推測した／確信が持てない」の区別が付く。似ている度合いの数値は返さない、と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="gf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">読み方は分けて、<tspan fill="#1E5A48">つなぎ先は1枚</tspan>にまとめる</text>

  <rect x="26" y="108" width="176" height="62" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="114" y="136" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">コード</text>
  <text x="114" y="156" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（構文木と呼び出し関係）</text>

  <rect x="26" y="194" width="176" height="62" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="114" y="222" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">文書・PDF</text>
  <text x="114" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（LLM が概念を抜く）</text>

  <rect x="26" y="280" width="176" height="62" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="114" y="308" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">画像</text>
  <text x="114" y="328" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（視覚で読む）</text>

  <path d="M202,139 L262,139 L262,225" fill="none" stroke="#1E5A48" stroke-width="4" />
  <line x1="202" y1="225" x2="262" y2="225" stroke="#1E5A48" stroke-width="4" />
  <path d="M202,311 L262,311 L262,225" fill="none" stroke="#1E5A48" stroke-width="4" />
  <line x1="262" y1="225" x2="330" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#gf-arrow)" />

  <rect x="338" y="152" width="216" height="146" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="446" y="184" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">知識グラフ</text>
  <circle cx="396" cy="228" r="9" fill="#1E5A48" />
  <circle cx="470" cy="212" r="9" fill="#1E5A48" />
  <circle cx="452" cy="266" r="9" fill="#1E5A48" />
  <circle cx="508" cy="252" r="9" fill="#1E5A48" />
  <line x1="396" y1="228" x2="470" y2="212" stroke="#1E5A48" stroke-width="2.5" />
  <line x1="396" y1="228" x2="452" y2="266" stroke="#1E5A48" stroke-width="2.5" />
  <line x1="470" y1="212" x2="508" y2="252" stroke="#1E5A48" stroke-width="2.5" />
  <line x1="452" y1="266" x2="508" y2="252" stroke="#1E5A48" stroke-width="2.5" />
  <text x="446" y="290" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（線ごとに、読んだのか推測したのかが付く）</text>

  <line x1="554" y1="225" x2="606" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#gf-arrow)" />

  <rect x="614" y="180" width="160" height="90" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="694" y="216" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">問い合わせ</text>
  <text x="694" y="238" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（探す・たどる・説明させる）</text>

  <text x="400" y="386" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">線には「そのまま書いてあった／推測した／確信が持てない」の区別が付く。似ている度合いの数値は返さない</text>
</svg>

キャプション: 入り口はばらばらでも、出口は1枚。**どこから来た線なのかが最後まで消えない**のが、この道具のいちばんの主張になっている。


## どんなときに使うか

### 引き継いだコードと、そこに付いてきた資料が噛み合わないとき

コードだけ読んでも、設計資料だけ読んでも埋まらない部分がある。両方を同じグラフに入れると、「この資料の言葉は、どのコードのことなのか」を線としてたどれるようになる。`path` で2点のあいだの道を出せるので、**関係があるらしいと分かった時点で、その道筋をたどれる。**

### 生成された答えを、根拠まで戻って確かめたいとき

線ごとに、読み取ったのか推測したのかが残る。あとから「この2つは書いてあったのか、推測なのか」を分けて見られるので、**出てきた答えを鵜呑みにできない場面**で効いてくる作りになっている。


## 注意点

**費用がかかるかは、何を読ませるかで変わる。** コードだけなら API キーは要らず、手元だけで完結する（`--code-only` でコードに絞れる）。費用が出るのは文書・PDF・画像の概念抜き出しで、こちらは LLM が担う。手元で動くモデルを指定する道も用意されている。

**「意外なつながり」は、意外さの順に並べたものでしかない。** どれだけ予想外かで順位を付ける作りなので、そのまま意味のある関係とは読めない。**出てきたグラフを結論として扱わないほうがよい**（これは当サイトの見立てで、README にこの断りは無い）。

**導入は `pip` を避けるよう案内されている。** README は `uv tool install`（または `pipx`）を勧めていて、`pip` だと参照する環境がずれて動かないことがあるとしている。入れた直後にコマンドが見つからない場合は `uv tool update-shell` を走らせる。PowerShell では先頭の `/` を付けずに打つ、という注意もある。

**規模のわりに動きが速い。** 2026年4月の公開から短い期間でスターを集め、リリースも頻繁に出ている。未解決の不具合や要望、修正依頼も多く残っている。伸びの理由までは当サイトでは確かめられていないが、**まだ落ち着いた段階ではなさそうに見える。** ライセンスは Apache-2.0 で、使うぶんの制約は緩い。
