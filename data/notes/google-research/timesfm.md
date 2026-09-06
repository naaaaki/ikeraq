---
updated: 2026-09-06
image:
image_alt:
---

<!-- ============================================================
  google-research/timesfm
  https://github.com/google-research/timesfm
  TimesFM (Time Series Foundation Model) is a pretrained time-series foundation model developed by Google Research for time-series forecasting.
  Python / Apache-2.0 / スター 30,684
  

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

学習させ直さずに、過去の数値をそのまま渡して先を予測させる

## どういうものか

時系列予測の「事前学習ずみモデル」です。ふつう売上や需要の予測は、系列ごとにデータを集めてモデルを育てるところから始まります。TimesFM はその工程を前提にしません。過去の数値の並びを配列で渡すと、この先の値が返ってきます。言語モデルと同じデコーダのみの構成で、大量の時系列で先に学習させてあるためです（ICML 2024 の論文が元）。

いまの主役は 3.0 です。1本の系列だけでなく複数系列をまとめて扱え、**共変量**——予測したい値のそばにある別の数字——を一緒に渡せます。共変量は2種類あり、過去ぶんしか分からないもの（実績の気温など）と、未来まで分かっているもの（暦、セール予定など）を区別して渡します。出力は1本の予測線だけでなく、0.1 から 0.9 まで9本の分位が付きます。

版による違いも押さえておくと読みやすくなります。系列の長さの上限は 2.0 の 2048 に対し、2.5 は最大 16k。パラメータ数は 2.5 が2億で、2.0 の5億から小さくなりました（3.0 のパラメータ数は書かれていません）。ベンチマークは fev-bench（実データ100タスク）、TIME Benchmark（50データセット・98タスク）、GIFT-Eval の3つで首位を掲げています。BigQuery ML、Google スプレッドシート、Vertex Model Garden からも呼べます。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="左に過去の観測値の折れ線、中央に緑色のTimesFMの箱、右に予測線と広がる帯。左から右へ緑の矢印でつながり、学習をやり直す工程が図の中に無いことを示した流れの図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="60" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      並びを<tspan style="fill: #1E5A48;">そのまま渡す</tspan>と、先の値と外れ幅が返る
    </text>

    <!-- 過去の観測 -->
    <rect x="60" y="150" width="200" height="140" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <polyline points="76,266 100,240 124,254 148,214 172,236 196,194 220,212 244,178"
              fill="none" stroke="#17160F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="160" y="318" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">過去の数値の並び</text>
    <text x="160" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（1本でも、何千本でも）</text>

    <path d="M274 220 H310" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M310 209 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- モデル -->
    <rect x="336" y="168" width="140" height="104" rx="12" fill="#1E5A48"/>
    <text x="406" y="212" text-anchor="middle" style="font-family: var(--mono); font-size: 21px; font-weight: 500; fill: #FFFFFF;">TimesFM</text>
    <text x="406" y="240" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity: .85;">学習ずみ</text>
    <text x="406" y="318" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">そのまま推論する</text>
    <text x="406" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（育て直す工程が無い）</text>

    <path d="M492 220 H528" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M528 209 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 予測 -->
    <rect x="554" y="150" width="186" height="140" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <path d="M570 234 C 620 214, 680 196, 726 172 L726 276 C 680 260, 620 246, 570 240 Z" fill="#1E5A48" opacity=".16"/>
    <path d="M570 237 C 620 224, 680 214, 726 202" fill="none" stroke="#1E5A48" stroke-width="3.5" stroke-linecap="round"/>
    <text x="647" y="318" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">この先の値</text>
    <text x="647" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（0.1〜0.9 の9本の幅つき）</text>

    <text x="400" y="404" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 系列ごとにモデルを育てる工程が、手前に無い 〜
    </text>
  </svg>
</figure>

キャプション:

図の中に、データを集めてモデルを訓練する箱が無いのが要点です。予測が当たるかどうかとは別に、「試すまでの手数」がまるごと減ります。返ってくるのが1本の線ではなく帯であることも、あわせて見てください。

## どんなときに使うか

### 予測したい系列が多すぎて、1本ずつモデルを作っていられないとき

商品ごと・店舗ごとに需要を読みたい、というときに系列は数千本になります。1本ずつ学習させる設計はそこで詰まります。まず全部を渡してみて、精度が足りないところだけ手をかける、という順番に変えられます。

### 「いくつになるか」だけでなく「どれだけ外れうるか」も要るとき

在庫や人員の計画では、真ん中の値より上振れ・下振れの幅のほうが効きます。3.0 なら9本の分位が最初から付いてくるので、予測とは別に区間推定を組む必要がありません（2.5 では、任意の分位ヘッドを足す形になります）。

## 注意点

**3.0 の重みは非商用ライセンスです。ここが最初に確認すべき点です。** ソースコードは Apache-2.0 ですが、3.0 の既定の学習ずみ重みは `timesfm-non-commercial-license-v1.0` で配られており、商用・本番での利用は認められていません。仕事で使うなら、Apache-2.0 のまま配られている 2.5 以前を選ぶか、Google 側の商用経路（Vertex など）を通すことになります。「リポジトリが Apache-2.0 だから自由に使える」と読むと間違えます。

**Google の公式サポート製品ではない、と本人が明記しています。** 研究成果の公開版という位置づけです。サポート窓口や後方互換の保証を期待する種類のものではありません。

**ベンチマーク1位は、あなたのデータで1位という意味ではありません。** 掲げられている3つの順位は公開データセットの平均での話です。自社の系列は癖が強いことが多く、素朴な移動平均に負けることもあります。乗り換えを決める前に、手元の直近データで従来手法と並べて測るのが先です。

