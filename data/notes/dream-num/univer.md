---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  dream-num/univer
  https://github.com/dream-num/univer
  The Office Harness for AI Agents — Spreadsheets, Docs, Slides, Canvas, Relational Tables, and PDF in one runtime.
  TypeScript / Apache-2.0 / スター 18,000台
============================================================ -->


## 見出しの一文

表計算や文書の編集機能を、自分のサービスに部品として組み込む


## どういうものか

表計算・文書・スライドといったオフィス系の機能を、自分の製品の中に作り込むための開発キット（SDK）だ。TypeScript で書かれ、ライセンスは Apache-2.0。開発元は DreamNum 社。できあがったアプリを使わせるのではなく、**部品を渡して、自分の製品の中の表計算を組み立てさせる**。README も「表計算ファイルを表示するだけのものではなく、自分の作業画面を作るための枠組み」と書いている。

機能はすべてプラグインに分かれていて、必要なものだけを組み合わせて使う。細かく選ぶ「プラグインモード」のほか、よく使う組み合わせをまとめた「プリセットモード」で手早く始めることもできる。画面は Canvas で描き、専用の数式エンジンを持つ。**同じ仕組みがブラウザでも Node.js でも動く**のが特徴で、Node.js では画面なしで、ブックの処理や数式の計算をさせられる。操作は Facade API という共通の窓口から行い、React・Vue・Web Components と組み合わせられる。

最近は「AIエージェントのためのオフィス基盤」を前面に出している。エージェントが決まった API で中身を読み書きし、画面の写しなどで結果を確かめ、人は下書きとして分けられた変更を見て取り込むかを決める、という使い方だ。ただし README は、共同編集や、この下書きを使う流れには対応する Web SDK と共同編集の機能が必要で、提供の形とライセンスは機能ごとに違うと断っている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「同じ作りを、画面つきでも画面なしでも」とある図。左に「プラグイン（表計算・数式・書式など、必要な分だけ選ぶ）」、次に「Univer（描画エンジン・数式エンジン・Facade API）」があり、そこから「ブラウザ（編集画面として埋め込む）」と「Node.js（画面なしで処理・計算する）」の2つに矢印が分かれている。下に「共同編集・編集履歴・読み込みと書き出し・グラフは商用版（Univer Pro）」とある。いちばん下に「いちばん成熟しているのは表計算。文書とスライドは発展の途中」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="uv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">同じ作りを、<tspan fill="#1E5A48">画面つきでも画面なしでも</tspan></text>

  <rect x="30" y="140" width="210" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="135" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">プラグイン</text>
  <text x="135" y="204" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（表計算・数式・書式など、</text>
  <text x="135" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">必要な分だけ選ぶ）</text>

  <line x1="246" y1="196" x2="276" y2="196" stroke="#1E5A48" stroke-width="4" marker-end="url(#uv-arrow)" />

  <rect x="282" y="140" width="210" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="387" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Univer</text>
  <text x="387" y="204" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（描画エンジン・数式エンジン・</text>
  <text x="387" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">Facade API）</text>

  <line x1="498" y1="186" x2="530" y2="160" stroke="#1E5A48" stroke-width="4" marker-end="url(#uv-arrow)" />
  <line x1="498" y1="206" x2="530" y2="232" stroke="#1E5A48" stroke-width="4" marker-end="url(#uv-arrow)" />

  <rect x="536" y="108" width="230" height="84" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="651" y="144" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ブラウザ</text>
  <text x="651" y="170" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（編集画面として埋め込む）</text>

  <rect x="536" y="200" width="230" height="84" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="651" y="236" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Node.js</text>
  <text x="651" y="262" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（画面なしで処理・計算する）</text>

  <text x="400" y="340" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">共同編集・編集履歴・読み込みと書き出し・グラフは商用版（Univer Pro）</text>
  <text x="400" y="394" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">いちばん成熟しているのは表計算。文書とスライドは発展の途中</text>
</svg>

キャプション: 画面に出す側とサーバーで処理する側を**同じ作りで書ける**ので、表示と自動処理で作りが分かれない。


## どんなときに使うか

### 自社のサービスの中に、表計算の編集画面を入れたいとき

別の表計算ソフトに飛ばさず、自分の画面の中で数式・並べ替え・絞り込み・条件付き書式まで使える。要らない機能はプラグインごと外せる。

### サーバー側で、ブックの処理や数式の計算を自動で回したいとき

オープンソース版の範囲でも Node.js で画面なしに動かせるので、画面で使っているのと同じ仕組みで、裏側の自動処理やAIエージェントからの操作を組める。


## 注意点

**オープンソース版と商用版の線引きを先に確認する。** このリポジトリにあるのはオープンソースの中核部分で、表計算の編集・数式・書式・絞り込みと並べ替え・入力規則・条件付き書式・コメントなどが入っている。一方、**共同編集・編集履歴・ファイルの読み込みと書き出し・印刷・グラフ・ピボットテーブル**などは商用版の Univer Pro の側だ。「ファイルを開いて編集して保存する」までをオープンソース版だけで組めるとは限らない。

**成熟度に差がある。** README は、いちばん成熟しているのは表計算だとしている。文書とスライドは同じ仕組みの上で発展の途中で、スライドは開発が進行中と書かれている。

**部品の版を揃える必要がある。** `@univerjs/*` の各パッケージは同じ版で揃えて使うよう README が求めている。Node.js で画面なしに動かすには Node.js 18.17 以上が要る。
