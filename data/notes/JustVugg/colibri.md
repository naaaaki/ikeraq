---
updated: 2026-09-14
image:
image_alt:
---

<!-- ============================================================
  JustVugg/colibri
  https://github.com/JustVugg/colibri
  Run frontier MoE models on hardware you already own — pure C, zero deps, experts streamed from disk. Tiny engine, immense model. 🐦
  C / Apache-2.0 / スター 29,221
============================================================ -->


## 見出しの一文

巨大なモデルを丸ごと載せず、要る部分だけディスクから流して手元で動かす


## どういうものか

数千億〜数兆パラメータの大きなモデルを、手元にある機械で動かすための推論エンジン。エンジン本体は C の1ファイル。起動役と API の窓口は Python で書かれているので Python 3 は入れておく必要があるが、**推論そのものは BLAS も Python も使わず、GPU も必須ではない**（あれば速くなる、という位置づけ）。作者は GLM-5.2（744B）を基準のモデルに置いていて、これを含めた9系統——Kimi K3（2.8T）、Inkling（975B）、DeepSeek V4 Flash（284B）など——が同じ `coli chat` / `coli serve` / `coli web` という入口で動く、としている。

考え方の中心は、**モデルを「載せるもの」ではなく「運び込むもの」として扱う**ところにある。MoE（混合エキスパート）型のモデルは、1つの語を出すのに全パラメータを使うわけではない。744B のモデルでも実際に働くのは 40B ほどで、語ごとに入れ替わるのは 11GB ぶん程度だという。そこで colibrì は、いつも使う密な部分（注意機構や共有エキスパート、およそ 17B ぶん。int4 にして約 9.9GB）を RAM に常駐させ、19,456 個のルーティング対象エキスパート（int4 で1つ 19MB ほど、合わせて 370GB ほど）はディスクに置いたまま、必要になったものだけを読み出す。作者はこれを「**重みの JIT**」と呼んでいる。コンパイラの JIT がプログラム全体をコンパイルせず、実際に通った道だけを処理するのと同じ賭けだ、という説明になっている。

置き場所を決めるのは、その機械の使われ方そのもの。どのエキスパートが呼ばれたかを記録していき、よく通るものを上の段（RAM や VRAM）に固定する。ルーターは1層先を走るので、読み込みの待ち時間を計算の裏に隠しにいく。ただし作者は、どちらも保証ではないと書いている。先読みは機械によっては損をする。履歴からの固定は、目の前の使い方に寄りすぎることがある。SSD が2台あれば同じモデルの複製を両方に置いて、読み出しの帯域を合算することもできる。そして設計上の約束として、**置き場所は速さだけを決め、モデルの精度やルーターの判断は変えない**ことを掲げている。速さのほうは保証しない、と作者ははっきり書いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「全部を載せずに、要るぶんだけ運び込む」とある図。「密な部分（約9.9GB）は最初から RAM に残る」と添えてある。「ディスク（エキスパート約370GB）」から「RAM・VRAM（よく使うぶんだけ置く）」を通って「次の1語（答えが進む）」へ進む。「ルーターが1層先に決めて、読み込みの待ちを隠しにいく」「よく通ったエキスパートを覚えて、次はもっと手前に置く」とある。下に「置き場所で変わるのは速さだけ。答えの中身は変えない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="60" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">全部を載せずに、<tspan fill="#1E5A48">要るぶんだけ</tspan>運び込む</text>

  <text x="400" y="122" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.7">密な部分（約9.9GB）は最初から RAM に残る</text>

  <rect x="45" y="160" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="140" y="208" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">ディスク</text>
  <text x="140" y="232" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（エキスパート約370GB）</text>

  <line x1="235" y1="215" x2="297" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#cb-arrow)" />

  <rect x="305" y="160" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="400" y="208" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">RAM・VRAM</text>
  <text x="400" y="232" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（よく使うぶんだけ置く）</text>

  <line x1="495" y1="215" x2="557" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#cb-arrow)" />

  <rect x="565" y="160" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="660" y="208" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">次の1語</text>
  <text x="660" y="232" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（答えが進む）</text>

  <text x="400" y="300" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.7">ルーターが1層先に決めて、読み込みの待ちを隠しにいく</text>

  <path d="M400,325 L400,355 L140,355 L140,285" fill="none" stroke="#1E5A48" stroke-width="4" stroke-dasharray="9 7" marker-end="url(#cb-arrow)" />
  <text x="285" y="382" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.7">よく通ったエキスパートを覚えて、次はもっと手前に置く</text>

  <text x="400" y="420" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">置き場所で変わるのは速さだけ。答えの中身は変えない</text>
</svg>

キャプション: 大きなモデルを動かせるかどうかを、**積んでいるメモリの量ではなく、運び方の問題に置き換えている**。手前に何を置くかは、使っているうちに機械のほうが覚えていく。


## どんなときに使うか

### 大きなモデルを、自分の手元で触りたいとき

API 越しに借りるのではなく、中で何が起きているかを見ながら動かしたい場合の選択肢になる。付属のダッシュボードでは、どのエキスパートがどの段に置かれ、いまどれが呼ばれたかが実時間で見える。速さよりも「持っていること」を優先する使い方に寄っている。

### 手持ちの機械で、どこまで動くかを測りたいとき

同じエンジンが、ノート PC 級から GPU 複数枚の機械まで同じ形で動く。違うのは、エキスパートがどの段に載るかだけ。作者自身が結論を出しきっていない項目（読み出しの履歴でどこまで置き場所を当てられるか、SSD 2台が本当に効くかなど）を表にして、反証つきの報告を募っている。


## 注意点

**プログラムは小さいが、モデルは小さくない。** エンジンは数百KBで済む一方、基準になっている GLM-5.2 の int4 版は 372GB ほどある。置く場所を用意できるかが、動かせるかどうかの最初の分かれ目になる。

**速さは機械しだいで、桁で変わる。** README が主なものとして挙げている実測は4つ。6枚の RTX 5090 に全エキスパートを載せた状態で 5.8〜6.8 tok/s、ノートPC級の RTX 5070 Ti 1枚の機械では、GPU 側に載せる経路を使って 1.07 tok/s、CPU だけの 128GB デスクトップで温まった状態のとき 1.8 tok/s ほど、25GB の開発機では冷えた状態で 0.05〜0.1 tok/s。作者も「速さに SLA は無く、保証するのは意味のほうだ」と書いている。会話の応答を待てる速度が要る用途では、先に自分の機械での数字を確かめるほうがいい。

**どの変換済みモデルを取るかで結果が変わる。** README は、量子化の作り方が違う古い配布物を使うと品質が落ち、生成が止まらなくなる原因になったと名指しで注意している。取ってくる場所を README の指示どおりに選ぶ必要がある。

**まだ変化が大きい。** 2026年7月に公開されたプロジェクトだ。ライセンスは Apache 2.0 だが、**動かすモデルの重みには別のライセンスが付く**（GLM-5.2 は Z.ai が MIT で公開している、と README にある）。
