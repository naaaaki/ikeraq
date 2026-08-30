---
updated: 2026-08-30
image:
image_alt:
---

## 見出しの一文

管理画面に要る部品を、設計思想ごとまとめて借りられる React ライブラリ

## どういうものか

React 向けの UI ライブラリです。ボタンやフォームだけでなく、業務アプリで面倒になりがちな部品——並べ替えと絞り込みつきのテーブル、日付・時刻の入力、階層のある選択肢、手順を進めるウィザードなど——がひととおり入っています。10年以上積み上がっているので、「この部品は自作するしかないか」となる場面が少ないのが強みです。

構造としては2階建てです。下に **Ant Design** というデザイン言語（余白の取り方、色の意味、文言の書き方といった決めごと）があり、その上に **antd** という React 実装が載っています。部品を借りるだけでなく、判断の基準ごと借りられる、という形になっています。

v5 からは見た目の調整の仕組みが変わり、**Design Token** で色や角丸、余白をまとめて上書きできるようになりました。スタイルは CSS-in-JS で実行時に組み立てられるので、テーマの切り替えがビルドをまたがずにできます。表示言語のロケールも、テーマと同じ `ConfigProvider` から差し替えます。日本語も用意されています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="「部品の下に、決めごとが敷いてある」と題した図。3段に積まれた層。下から Ant Design（余白・色・文言の決めごと）、antd（React の部品）、あなたの画面。右側の Design Token から層に向かって矢印が伸びている。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="60" text-anchor="middle"
          style="font-family: var(--jp); font-size: 31px; font-weight: 700; fill: #17160F;">
      部品の下に、<tspan style="fill: #1E5A48;">決めごと</tspan>が敷いてある
    </text>

    <!-- あなたの画面 -->
    <rect x="110" y="126" width="390" height="72" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="136" y="162" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #17160F;">あなたの画面</text>
    <text x="136" y="184" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（作るもの）</text>

    <!-- antd -->
    <rect x="110" y="212" width="390" height="72" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5"/>
    <text x="136" y="248" style="font-family: var(--mono); font-size: 20px; font-weight: 500; fill: #1E5A48;">antd</text>
    <text x="136" y="270" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（テーブル・フォーム・日付入力などの部品）</text>

    <!-- Ant Design -->
    <rect x="110" y="298" width="390" height="72" rx="10" fill="#1E5A48"/>
    <text x="136" y="334" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #FFFFFF;">Ant Design</text>
    <text x="136" y="356" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity: .75;">（余白・色・文言の決めごと）</text>

    <!-- Design Token -->
    <rect x="580" y="200" width="176" height="96" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="7 5"/>
    <text x="668" y="240" text-anchor="middle" style="font-family: var(--mono); font-size: 18px; font-weight: 500; fill: #1E5A48;">Design Token</text>
    <text x="668" y="266" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">（色・角丸・余白）</text>

    <path d="M572 248 H 534" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M516 248 l18 -11 v22 z" fill="#1E5A48"/>

    <text x="400" y="412" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 部品を借りると、判断の基準も一緒についてくる 〜
    </text>
  </svg>
</figure>

キャプション:

いちばん下の層まで込みで借りる、という点がこのライブラリの性格です。右から差す Design Token は、その見た目の部分だけを後から上書きする入口です。

## どんなときに使うか

### 社内向けの管理画面を、短期間で形にしたいとき

管理画面は、見た目の独自性より「必要な機能が揃っていること」が優先されます。テーブルと検索フォームを自作しないで済むだけで、着手から動くものが出るまでの時間がかなり変わります。

### デザイナーがいないチームで、見た目の判断を減らしたいとき

余白をいくつにするか、エラーの色をどうするかを毎回チームで議論するのは消耗します。設計側の決めごとまで込みで提供されているので、「ここはこのライブラリの流儀に従う」で止められます。

## 注意点

**見た目に強い個性があります。** Ant Design で作った画面は、見る人が見ればすぐ分かります。自社のブランドを前面に出したい一般公開向けのサイトでは、上書きが増えて戦うことになりがちです。逆に、見た目を主張しなくていい社内ツールとは相性がいいです。

**規模が大きい分、乗り換えのコストも大きくなります。** 部品の作り込みが深いので、一度これで作った画面を別のライブラリに移すのは簡単ではありません。v4 から v5 への移行のように、大きなバージョン更新のときにも作業が発生します。採用は「長く付き合う」判断として決めたほうがいいです。

**議論は中国語が中心のようです。** Issue やディスカッションは中国語のやりとりが目立ち、込み入った不具合を追うときに言語の壁を感じることがあります。ドキュメント自体は英語版が整備されています。

**スタイルを実行時に組み立てます。** v5 の CSS-in-JS はテーマの差し替えを軽くする代わりに、描画時の処理と、サーバーサイドレンダリング側の手当てが必要になります。表示速度に厳しい一般公開向けのページでは、そこを確かめてから決めたほうがいいです。

ライセンスは MIT です。
