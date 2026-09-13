---
updated: 2026-09-14
image:
image_alt:
---

<!-- ============================================================
  nashsu/llm_wiki
  https://github.com/nashsu/llm_wiki
  LLM Wiki is a cross-platform desktop application that turns your documents into an organized, interlinked knowledge base — automatically.
  TypeScript / GPL-3.0 / スター 19,280
============================================================ -->


## 見出しの一文

質問のたびに資料を引き直すのをやめ、育っていく1つの wiki に書き溜める


## どういうものか

手元の資料を放り込むと、LLM がそれを読んで、相互にリンクされた wiki を組み立てるデスクトップアプリ。Tauri v2（中身は Rust）と React で作られていて、macOS・Windows・Linux 向けの実行ファイルが配られている。PDF、Office 文書、EPUB/MOBI、画像、Web クリップなどを取り込める。Karpathy が公開した「LLM Wiki」という手順の実装として始まり、そこに大きく手を入れたものだ、と作者は明記している。

ふつうの RAG は、質問が来るたびに原文を探し、その場で答えを組み立てる。ここが違っていて、**取り込んだときに一度きり知識を「編纂」し、以後はその wiki を更新していく**。取り込みは2段階に分かれている。1回目の呼び出しで LLM が原文を読み、出てくる実体・概念・主張と、すでにある wiki との食い違いまで含めた分析を出す。2回目で、その分析をもとに wiki のページを書く。1回で読みながら書かせるより質が上がる、という理由で分けられている。生成された各ページには出典のファイル名が残るので、どの資料から来た記述かを辿れる。ファイルの中身はハッシュで照合されていて、変わっていない資料は取り込み直さない。

もう一つの柱が、ページ同士のつながりをグラフとして持っていること。関連の強さは、4つの手がかりを重みつきで足して決まる——直接リンクされているか、同じ原文から作られたか、共通の隣人がいるか、同じ種類のページか。いちばん重く見られているのは、同じ原文から作られたかどうかだ。そのうえでページのまとまりを自動で見つけ、つながりがほとんど無いページ（リンクが1本以下）、内部のリンクが薄いまとまり、複数のまとまりを繋いでいる要のページを「知識の穴」として並べる。質問に答えるときは、語で検索し、（設定すれば）ベクトル検索を足し、そこを起点にグラフを辿って関連ページを集め、文脈の枠に収まるよう配分してから LLM に渡す。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「その都度ゼロから調べず、wikiを育ててから答える」とある図。上の段は「ふつうの RAG」で、「質問」から「原文を探す（毎回ゼロから）」を通って「答え」へ進む。下の段は「LLM Wiki」で、「資料」から「取り込みのときに書く（分析してからページ化）」を通って「wiki（残って、更新されていく）」へ進み、そこから「答え」へ進む。「質問が来たら、ここを読む」と添えてある。下に「編纂は一度きり。以後は足したぶんだけ書き足していく」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="lw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">その都度ゼロから調べず、<tspan fill="#1E5A48">wikiを育てて</tspan>から答える</text>

  <text x="60" y="118" font-size="13" font-weight="700" fill="#17160F" fill-opacity="0.55">ふつうの RAG</text>
  <rect x="60" y="132" width="130" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="125" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">質問</text>
  <line x1="190" y1="169" x2="240" y2="169" stroke="#1E5A48" stroke-width="4" marker-end="url(#lw-arrow)" />
  <rect x="248" y="132" width="230" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="363" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">原文を探す</text>
  <text x="363" y="189" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（毎回ゼロから）</text>
  <line x1="478" y1="169" x2="528" y2="169" stroke="#1E5A48" stroke-width="4" marker-end="url(#lw-arrow)" />
  <rect x="536" y="132" width="130" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="601" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">答え</text>

  <line x1="60" y1="238" x2="740" y2="238" stroke="#17160F" stroke-opacity="0.12" stroke-width="1" />

  <text x="60" y="278" font-size="13" font-weight="700" fill="#1E5A48">LLM Wiki</text>
  <rect x="60" y="292" width="130" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="125" y="336" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">資料</text>
  <line x1="190" y1="329" x2="240" y2="329" stroke="#1E5A48" stroke-width="4" marker-end="url(#lw-arrow)" />
  <rect x="248" y="292" width="230" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="363" y="326" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">取り込みのときに書く</text>
  <text x="363" y="349" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（分析してからページ化）</text>
  <line x1="478" y1="329" x2="528" y2="329" stroke="#1E5A48" stroke-width="4" marker-end="url(#lw-arrow)" />
  <rect x="536" y="292" width="204" height="74" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="638" y="326" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">wiki</text>
  <text x="638" y="349" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（残って、更新されていく）</text>

  <path d="M740,292 L768,292 L768,169 L674,169" fill="none" stroke="#1E5A48" stroke-width="4" marker-end="url(#lw-arrow)" />
  <text x="680" y="258" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">質問が来たら、ここを読む</text>

  <text x="400" y="414" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">編纂は一度きり。以後は足したぶんだけ書き足していく</text>
</svg>

キャプション: 同じ資料を何度も読み直させるかわりに、**読んだ結果のほうを残す**。回を重ねるほど、質問が当たる先は原文ではなく自分の wiki になっていく。


## どんなときに使うか

### 同じ資料に、何度も違う角度から聞くとき

論文や仕様書のように、1回読んで終わりにならない資料が溜まっている場合に向く。知識を組み直すのは取り込みのときだけなので、同じ資料を毎回読み直させずに済む。

### 資料どうしの関係のほうを知りたいとき

「何が書いてあるか」ではなく「どれとどれが繋がっているか」を見たいときに、グラフの画面が効く。離れた分野のページが繋がっている箇所や、逆にほとんど繋がりを持たないページが並ぶので、**自分が何を調べていないか**が目に見える形で出てくる。


## 注意点

**取り込みのたびに LLM を呼ぶ。** 1つの資料につき2回の呼び出しが基本になるので、資料が多いほど費用と時間がかかる。接続先は OpenAI・Anthropic・Google・Ollama・独自エンドポイントから選べる、と README にある。外に出したくない資料なら、手元で動かす選択肢があるかどうかを先に確かめておくほうがいい。

**ベクトル検索は初期状態では切れている。** 設定で有効にすると、別途 embedding の接続先が要る。README は「有効にすると全体の再現率が 58.2% から 71.4% に上がった」と書いているが、**どう測ったのかまでは書かれていない**。数字は目安として読むところだと思っておくほうがよい。

**ライセンスは GPL-3.0。** 手元で使うぶんには関係しないが、自分の製品に組み込んで配る形にすると、公開の義務が付いてくる。MIT の道具と同じ感覚では扱えない。

**まだ 0.x 台。** 未解決のものは issue とプルリクエスト合わせて 260 件あまり残っていて、リリースもかなりの頻度で出ている。仕様が動く前提で触るものだと思っておくほうがよい。
