---
updated: 2026-09-04
image:
image_alt:
---

## 見出しの一文

同じ前置きを何度も計算し直すのをやめて、LLMの応答が返るまでを縮める

## どういうものか

大規模言語モデルを**動かして配る側**のためのサーバーです。学習ではなく推論を担当し、GPU1枚から複数台のクラスタまで同じ仕組みで動きます。非営利のオープンソース団体 LMSYS のもとで公開されているもので、README には40万を超える GPU で稼働していると書かれています。開発は特定の1社ではなく、複数の企業と個人が持ち寄る形で進んでいます。

速さの中心にあるのが **RadixAttention** です。README では「前置きの使い回しのための仕組み」と一行だけ触れられていますが、要点は次のところにあります。実際のリクエストは、先頭が同じことが多くあります。同じシステムプロンプトが毎回付く、同じ会話の続きが何度も送られてくる、同じ文書について質問が並ぶ——このとき、共通している部分の計算は毎回まったく同じものになります。SGLang は計算済みの状態を木の形で持っておき、**枝分かれした先だけを計算します。** 前置きが長いほど、削れる量が増えます。

残りは、詰まりやすい場所を1つずつ潰す作りです。リクエストをまとめる処理から CPU 側の待ちを取り除く、入力を読む段階と1文字ずつ生成する段階を別々のマシンに分ける、次に来る語をまとめて先読みする、長い入力を分割して流す、といったものが並びます。動く先も広く、NVIDIA の GPU のほか、AMD の GPU（MI355／MI300）、Intel Xeon の CPU、Google の TPU、Ascend の NPU が挙がっています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="同じシステムプロンプトを持つ3つのリクエストが、共通部分を幹として共有する木の形にまとめられ、枝分かれした質問の部分だけが新しく計算される、という図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="56" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      同じ前置きは、<tspan style="fill: #1E5A48;">一度だけ</tspan>計算する
    </text>

    <!-- 3つのリクエスト -->
    <rect x="34" y="122" width="176" height="52" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="46" y="140" width="86" height="16" rx="4" fill="#1E5A48" opacity=".85"/>
    <rect x="138" y="140" width="34" height="16" rx="4" fill="#17160F" opacity=".18"/>

    <rect x="34" y="196" width="176" height="52" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="46" y="214" width="86" height="16" rx="4" fill="#1E5A48" opacity=".85"/>
    <rect x="138" y="214" width="48" height="16" rx="4" fill="#17160F" opacity=".18"/>

    <rect x="34" y="270" width="176" height="52" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="46" y="288" width="86" height="16" rx="4" fill="#1E5A48" opacity=".85"/>
    <rect x="138" y="288" width="26" height="16" rx="4" fill="#17160F" opacity=".18"/>

    <path d="M222 222 H262" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M262 211 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 木：共通の幹 -->
    <rect x="298" y="204" width="150" height="36" rx="8" fill="#1E5A48"/>
    <text x="373" y="228" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">共通の前置き</text>

    <!-- 枝 -->
    <path d="M448 222 C 486 222, 486 150, 524 150" fill="none" stroke="#17160F" stroke-width="3" stroke-linecap="round" opacity=".45"/>
    <path d="M448 222 H524" stroke="#17160F" stroke-width="3" stroke-linecap="round" opacity=".45"/>
    <path d="M448 222 C 486 222, 486 294, 524 294" fill="none" stroke="#17160F" stroke-width="3" stroke-linecap="round" opacity=".45"/>

    <rect x="524" y="132" width="104" height="36" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" stroke-dasharray="6 4"/>
    <rect x="524" y="204" width="104" height="36" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" stroke-dasharray="6 4"/>
    <rect x="524" y="276" width="104" height="36" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" stroke-dasharray="6 4"/>

    <text x="576" y="156" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">質問A</text>
    <text x="576" y="228" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">質問B</text>
    <text x="576" y="300" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">質問C</text>

    <!-- 計算するのはここだけ -->
    <text x="700" y="196" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #1E5A48;">計算するのは</text>
    <text x="700" y="218" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #1E5A48;">この先だけ</text>
    <path d="M660 222 H640" stroke="#1E5A48" stroke-width="3" stroke-linecap="round"/>
    <path d="M646 222 l14 -8 0 16 z" fill="#1E5A48"/>

    <!-- ラベル -->
    <text x="122" y="356" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">届いたリクエスト</text>
    <text x="122" y="378" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（先頭がそろっている）</text>

    <text x="420" y="356" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">RadixAttention</text>
    <text x="420" y="378" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（計算済みの状態を木で持つ）</text>

    <text x="400" y="424" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 前置きが長いほど、捨てられる計算が増える 〜
    </text>
  </svg>
</figure>

キャプション:

速いモデルに替える話ではありません。**同じ答えを出すのに、同じ計算を何度もしていた**——そこを削っているので、モデルを変えずに待ち時間が縮みます。

## どんなときに使うか

### 長いシステムプロンプトを毎回付けているとき

社内ルールや口調の指定を毎回先頭に積んでいると、その部分の計算が呼び出しの回数だけ発生します。前置きが共通なら、そこが丸ごと使い回されます。**プロンプトを短くする工夫をする前に、配る側で消せる無駄**です。

### 同じ資料に何度も質問するとき

長い文書を読ませて質問を重ねる使い方では、文書の部分が毎回同じです。会話の続きも同様で、往復が増えるほど共通部分が伸びていきます。

## 注意点

**自分で GPU を用意して運用する人向けの道具です。** 外部の API を呼ぶ側には出番がありません。モデルの重みを持ち、サーバーを立て、面倒を見る立場になって初めて効きます。

**速さの数字は環境しだいです。** 削れるのは前置きが共通している部分なので、毎回まったく違う短い入力ばかりが来る用途では、効きが小さくなります。自分のリクエストがどれくらい似ているかが、そのまま効果の上限になります。

**対応ハードウェアの幅と、実際の熟れ具合は別です。** NVIDIA 以外の環境も並んでいますが、どこまで検証されているかは README の一覧だけでは分かりません。手元の構成で試すのが確実です。

ライセンスは Apache-2.0 で、商用利用の妨げになる条項はありません。特許条項が付いている点も、企業で使うときはむしろ安心材料になります。
