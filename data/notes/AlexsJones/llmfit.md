---
updated: 2026-09-13
image:
image_alt:
---

<!-- ============================================================
  AlexsJones/llmfit
  https://github.com/AlexsJones/llmfit
  Rust / MIT / スター 36,079
  topics: gguf, llm, localai, mlx, skill, unsloth
============================================================ -->


## 見出しの一文

落としてから「動かない」と分かる前に、載るモデルを絞る


## どういうものか

llmfit は、**手元のマシンでどの LLM が動くか**を、実際に入れる前に見積もるコマンド。走らせると、ハードを調べ、カタログのモデル全部に点を付けて並べる（動かないものは下に沈む）。ローカルで動かすモデル選びは、大きなファイルを落としては消し、量子化を1段落としてまた試す、という繰り返しになりがちで、そこにかかる時間と回線を先に削るための道具だ。

見積もりは3段で進む。まず**ハードを見る**。CPU のコア数、RAM、積んでいる GPU と VRAM、メモリを CPU と GPU で共有する構成（統合メモリ）かどうか、そして NVIDIA CUDA、Apple Silicon、AMD ROCm、Intel OneAPI のどれに当たるか。次に**必要な量を出す**。モデルのパラメータ数、動かしたい文脈の長さ、量子化の形式（GGUF、AWQ、GPTQ、EXL2）から、占めるメモリを計算する。

面白いのは**速度の出し方**で、**生成の**速さを、計算の速さではなく**メモリ帯域**から見積もっている（プロンプトを読む側は演算性能に縛られるため、別に扱われる）。生成中は毎回モデルの重みを読み出すため、一般に、実際の速さは演算性能よりメモリを読む速さで頭打ちになりやすい。llmfit はこの帯域の見積もりに、実行時のサンプリングとコミュニティから集めた計測値を合わせている。結果は「載るか」「速さ」「品質」「文脈」の4つの軸で点数が付く。見積もるだけでなく、自分のマシンで実際の tok/s を測り、その値をプロジェクトへの pull request として送ることもできる。画面はターミナル版と Web 版があり、REST API も生えているので、別のツールから呼べる。


## 図

<svg viewBox="0 0 800 440" role="img" aria-label="見出しに「落とす前に、載るかどうかを計算で出す」とある図。左に「ハードを見る（自動で調べる）」の箱があり、CPU のコア数・RAM・GPU と VRAM、共有メモリかどうかも見ると書かれている。中央に「必要な量を出す（計算で見積もる）」の箱があり、パラメータ数・文脈の長さ・量子化の形式が並び、速さはメモリ帯域から、と書かれている。右に「並べる（4つの軸で点を付ける）」の箱があり、載るか・速さ・品質・文脈が並び、動かないものが下がった順で出ると書かれている。3つの箱は矢印で左から右へつながっている。下に、生成の速さは演算よりも重みを読み出すメモリの速さで頭打ちになりやすい、と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="lf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="440" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">落とす前に、<tspan fill="#1E5A48">載るかどうか</tspan>を計算で出す</text>

  <rect x="20" y="112" width="222" height="216" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="131" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">ハードを見る</text>
  <text x="131" y="174" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（自動で調べる）</text>
  <text x="131" y="214" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">CPU のコア数</text>
  <text x="131" y="240" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">RAM</text>
  <text x="131" y="266" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">GPU と VRAM</text>
  <text x="131" y="298" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">共有メモリかどうかも見る</text>

  <line x1="242" y1="220" x2="282" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#lf-arrow)" />

  <rect x="289" y="112" width="222" height="216" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">必要な量を出す</text>
  <text x="400" y="174" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（計算で見積もる）</text>
  <text x="400" y="214" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">パラメータ数</text>
  <text x="400" y="240" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">文脈の長さ</text>
  <text x="400" y="266" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">量子化の形式</text>
  <text x="400" y="298" text-anchor="middle" font-size="12" fill="#1E5A48" font-weight="700">速さはメモリ帯域から</text>

  <line x1="511" y1="220" x2="551" y2="220" stroke="#1E5A48" stroke-width="4" marker-end="url(#lf-arrow)" />

  <rect x="558" y="112" width="222" height="216" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="669" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">並べる</text>
  <text x="669" y="174" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（4つの軸で点を付ける）</text>
  <text x="669" y="214" text-anchor="middle" font-size="13" fill="#1E5A48" font-weight="700">載るか</text>
  <text x="669" y="240" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">速さ ／ 品質</text>
  <text x="669" y="266" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">文脈</text>
  <text x="669" y="298" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">動かないものが下がった順で出る</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">生成の速さは、演算よりも重みを読み出すメモリの速さで頭打ちになりやすい</text>
</svg>

キャプション: 「どれが強いか」ではなく「**このマシンで何が成立するか**」を先に出す。動かないものが下に沈んだ並びで見えることが、ローカル運用では効いてくる。


## どんなときに使うか

### 新しいモデルが出るたび、落としては試して消しているとき

パラメータ数と量子化の組み合わせは多く、試すたびに大きなダウンロードが挟まる。**先に落ちる組み合わせを外せる**だけで、待ち時間と回線がまとまって減る。

### マシンを買う前・増設する前に、どこまで狙えるか知りたいとき

必要なメモリが計算で出るので、「このモデルを文脈32kで動かすには何 GB 要るか」を、買い物の前に逆から確かめられる。


## 注意点

**出るのは見積もりで、保証ではない。** README 自身も estimates と書いている。速さは、GPU が帯域の表にある場合は効率の係数（既定 0.55）を掛けた式で出しているので、実測とはずれる（表に無い GPU では、バックエンドごとの定数に落ちる）。載るかどうかの判定のほうは、付属の説明書き（How it works）によれば使用率98%で線を引いていて、「最後の1%まで埋まった状態では割り当ての余白が残らず、実際には読み込めない」という理由が添えられている。自分の環境で確かめる前提で使う道具で、推定の根拠を出す `info` と、動かしているランタイムに向けて実測する `bench` が用意されている。

**速さの根拠には、他人の計測値が混ざっている。** README によれば、帯域の見積もりは実行時のサンプリングとコミュニティの計測値をもとにしている。珍しい構成のマシンほど、近い実測が集まっていない可能性は頭に置いておきたい。

**「載る」と「使える」は別。** ぎりぎり載る構成は、文脈を伸ばした途端に足りなくなる。実際に使う長さを入れて見積もらないと、意味のある比較にならない。

ライセンスは MIT。
