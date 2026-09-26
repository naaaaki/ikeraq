---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  NVIDIA/Model-Optimizer
  https://github.com/NVIDIA/Model-Optimizer
  A unified library of SOTA model optimization techniques like quantization, distillation, pruning, neural architecture search, speculative decoding, etc.
  Python / Apache-2.0 / スター 4,000台
============================================================ -->


## 見出しの一文

学習済みのAIモデルを小さく速くして、そのまま推論エンジンに渡す


## どういうものか

作り終えたAIモデルを、動かす前に軽くするための Python ライブラリだ。NVIDIA が作っていて、ライセンスは Apache-2.0。略して ModelOpt と呼ばれ、2025年12月に「TensorRT Model Optimizer」から今の名前に変わった。入力として受け付けるのは Hugging Face・PyTorch・ONNX のモデル。

軽くする手法をひとまとめに持っているのが特徴だ。数値の桁を落としてモデルを縮める**量子化**、要らない重みを削る**枝刈り**、大きなモデルのふるまいを小さなモデルに教え込む**蒸留**、回答の先読みで生成を速める**投機的デコーディング**などを、Python からの呼び出しで組み合わせられる。README の表では、学習し直さずに行う量子化だけで、モデルの大きさが2〜4倍小さくなるとしている。量子化で落ちた精度は、少しだけ学習し直して取り戻す手段も用意されている。

仕上がったモデルは、TensorRT-LLM・TensorRT・vLLM・SGLang といった推論エンジンでそのまま読める形で書き出せる。書き出しは文章生成の transformers 系モデルだけでなく、画像生成の diffusers 系モデルにも対応している。NVIDIA 自身がこれで軽くしたモデルを、Hugging Face で配っている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「作ったモデルを、軽く速くしてから渡す」とある図。左に「学習済みモデル（Hugging Face・PyTorch・ONNX）」、次に「ModelOpt（量子化・枝刈り・蒸留などを組み合わせる）」、次に「軽くしたモデル（そのまま読める形で書き出す）」、最後に「推論エンジン（TensorRT-LLM・vLLM・SGLang など）」が矢印でつながっている。下に「落ちた精度は、少し学習し直して取り戻す手段もある」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="mo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">作ったモデルを、<tspan fill="#1E5A48">軽く速く</tspan>してから渡す</text>

  <rect x="18" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="103" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">学習済みモデル</text>
  <text x="103" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Hugging Face・</text>
  <text x="103" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">PyTorch・ONNX）</text>

  <line x1="194" y1="206" x2="218" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#mo-arrow)" />

  <rect x="224" y="150" width="170" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="309" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ModelOpt</text>
  <text x="309" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（量子化・枝刈り・蒸留</text>
  <text x="309" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">などを組み合わせる）</text>

  <line x1="400" y1="206" x2="424" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#mo-arrow)" />

  <rect x="430" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="515" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">軽くしたモデル</text>
  <text x="515" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（そのまま読める形で</text>
  <text x="515" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">書き出す）</text>

  <line x1="606" y1="206" x2="630" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#mo-arrow)" />

  <rect x="636" y="150" width="150" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="711" y="188" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">推論エンジン</text>
  <text x="711" y="214" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（TensorRT-LLM・vLLM・</text>
  <text x="711" y="230" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">SGLang など）</text>

  <text x="400" y="360" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">落ちた精度は、少し学習し直して取り戻す手段もある</text>
</svg>

キャプション: 軽くする手法を1か所に集め、仕上がりを推論エンジンがそのまま読める形で出すところまでを受け持つ。


## どんなときに使うか

### 自社で動かすLLMの、GPU代や応答の遅さを減らしたいとき

同じモデルを小さくできれば、一般に必要な GPU のメモリが減る。書き出しは vLLM や SGLang で読める形にも対応している。

### 大きなモデルから、元より小さい派生モデルを作りたいとき

枝刈りと蒸留を組み合わせれば、元のモデルに近いふるまいのまま、パラメータ数を減らした版を作れる。README の事例紹介には、この方法で 355B のモデルを 260B に縮めた例や、33%小さく50%速くしながら品質の90%を保った 7B のモデルの例が載っている。


## 注意点

**まだ 1.0 前で、機能がすぐ消えることがある。** README の方針では、廃止が決まった機能は警告を出しながら1リリース（約1か月）だけ使え、その後は削除される。0.x のあいだは小さな版上げでも互換性が壊れうる。

**入れると、ほかのオープンソースも一緒に入る。** README は、追加で入るソフトのライセンスを使う前に確かめるよう書いている。NVIDIA のコンテナで使う場合も同じだ。

**NVIDIA の製品群との組み合わせが前面に出ている。** README は NVIDIA の AI ソフト群との組み合わせを強く打ち出している。vLLM や SGLang にも書き出せるが、手順や事例は Megatron 系のものが目立つ。

**速さや縮み方は、モデルと条件で変わる。** README のニュース欄に並ぶ「何倍速い」といった数字は、それぞれ特定のモデル・形式・比較対象での結果だ。自分のモデルでどうなるかは試すしかない。
