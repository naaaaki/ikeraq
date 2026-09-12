---
updated: 2026-09-12
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

llmfit は、**手元のマシンでどの LLM が動くか**を、実際に入れる前に見積もるコマンド。走らせると、ハードを調べ、条件に合うモデルを順位付きで並べる。ローカルで動かすモデル選びは、数十 GB を落としては落ち、量子化を1段落としてまた試す、という総当たりになりがちで、そこにかかる時間と回線を先に削るための道具だ。

見積もりは3段で進む。まず**ハードを見る**。CPU のコア数、RAM、積んでいる GPU と VRAM、Apple Silicon のようにメモリを CPU と GPU で共有する構成かどうか、そして CUDA / Metal / ROCm / OneAPI のどれが使えるか。次に**必要な量を出す**。モデルのパラメータ数、動かしたい文脈の長さ、量子化の形式（GGUF、AWQ、GPTQ、EXL2）から、占めるメモリを計算する。

面白いのは**速度の出し方**で、計算の速さではなく**メモリ帯域**から見積もっている。生成中は毎回モデルの重みを読み出すため、実際の速さは演算性能よりメモリを読む速さで頭打ちになりやすい。llmfit はこの帯域の見積もりに、実測のサンプリングとコミュニティから集めた計測値を合わせている。結果は「載るか」「速さ」「品質」「文脈」の4つの軸で点数化され、その順で並ぶ。見積もるだけでなく、自分のマシンで実際の tok/s を測って共有データベースに送ることもできる。画面はターミナル版と Web 版があり、REST API も生えているので、別のツールから呼べる。


## 図

<svg viewBox="0 0 800 440" role="img" aria-label="llmfit の仕組みの図。左に「ハードを見る」の箱があり、CPU・RAM・GPUとVRAM・共有メモリかどうかと書かれている。中央に「必要な量を出す」の箱があり、パラメータ数・文脈の長さ・量子化の形式から占めるメモリを計算し、速さはメモリ帯域から見積もると書かれている。右に「並べる」の箱があり、載るか・速さ・品質・文脈の4つの軸で点数を付けて順に並べると書かれている。下に、演算の速さではなくメモリを読む速さが上限を決める、と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
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
  <text x="669" y="298" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">上から試せばよい形で出る</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">生成の速さを決めるのは演算の速さではなく、重みを読み出すメモリの速さ</text>
</svg>

キャプション: 「どれが強いか」ではなく「**このマシンで何が成立するか**」を先に出す。選ぶ前に候補が絞れていることが、ローカル運用では効いてくる。


## どんなときに使うか

### 新しいモデルが出るたび、落としては試して消しているとき

パラメータ数と量子化の組み合わせは多く、総当たりだと1回あたり数十 GB の往復になる。**先に落ちる組み合わせを外せる**だけで、待ち時間と回線がまとまって減る。

### マシンを買う前・増設する前に、どこまで狙えるか知りたいとき

必要なメモリが計算で出るので、「このモデルを文脈32kで動かすには何 GB 要るか」を、買い物の前に逆から確かめられる。


## 注意点

**出るのは見積もりで、保証ではない。** README 自身も estimates と書いている。ほかのアプリが使っているメモリ、量子化の実装差、推論エンジンの違いで実際は動く。上位に出たものから順に試す、という使い方が前提になる。

**速さの精度は、投稿されている計測値に引きずられる。** 帯域の見積もりにコミュニティの実測が入っているので、自分の構成に近い投稿が少ないハードほど、速さの数字は当てにしにくい。

**「載る」と「使える」は別。** ぎりぎり載る構成は、文脈を伸ばした途端に足りなくなる。実際に使う長さを入れて見積もらないと、意味のある比較にならない。

ライセンスは MIT。
