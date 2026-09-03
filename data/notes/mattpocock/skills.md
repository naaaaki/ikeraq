---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

コーディングエージェントに、書き始める前の「詰める工程」を持たせる

## どういうものか

Claude Code や Codex のようなコーディングエージェントに読ませる、**手順書の詰め合わせ**です。TypeScript の教材で知られる Matt Pocock 氏によるもので、engineering 系と productivity 系を合わせて20本あまりが入っています。1本1本は Markdown の指示書で、コードではありません。

収録されているものは、**呼び出し方で2種類に分かれます。** 人が `/grill-me` `/to-spec` `/tdd` のように名前を指定して起動するもの（依頼を問い詰める、仕様に落とす、テストを先に書く、といった段取りを担当する）と、エージェントが必要と判断したときに自分で読みにいくもの（バグの切り分け方、ドメインのモデリング、コードレビューの観点といった「作法」を担当する）です。前者が流れを決め、後者がその中の細かい判断を支えます。

作者が敵と見なしているのは、**思い違いのまま実装が進んでしまうこと**です。だから最初に、使う人の依頼を問い詰める工程が置かれ、そこで出た合意が仕様になり、チケットになり、実装に渡ります。あわせて `CONTEXT.md` という「このリポジトリではこの言葉をこの意味で使う」の置き場を作り、毎回長い説明を書かずに済むようにします。導入後に `/setup-matt-pocock-skills` を1回だけ走らせ、課題管理を GitHub・Linear・ローカルファイルのどれで回すかを決める作りです。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="ぼんやりした依頼が、問い詰める工程を通って仕様とチケットになり、そこから実装に渡る流れの図。左から順に、依頼、grill（問い詰める）、to-spec と to-tickets（形にする）、implement と tdd（作る）の4つが緑の矢印でつながっている。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="58" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      作らせる前に、<tspan style="fill: #1E5A48;">問い詰める工程</tspan>を挟む
    </text>

    <!-- 依頼 -->
    <rect x="46" y="176" width="140" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5" stroke-dasharray="7 5"/>
    <rect x="72" y="205" width="70" height="8" rx="4" fill="#17160F" opacity=".22"/>
    <rect x="72" y="223" width="48" height="8" rx="4" fill="#17160F" opacity=".22"/>
    <rect x="72" y="241" width="60" height="8" rx="4" fill="#17160F" opacity=".22"/>

    <path d="M198 224 H232" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M232 213 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 問い詰める -->
    <rect x="262" y="164" width="140" height="120" rx="12" fill="#1E5A48"/>
    <text x="332" y="216" text-anchor="middle" style="font-family: var(--jp); font-size: 40px; font-weight: 700; fill: #FFFFFF;">？</text>
    <text x="332" y="252" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity:.85;">合意ができるまで</text>

    <path d="M414 224 H448" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M448 213 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 形にする -->
    <rect x="478" y="176" width="140" height="96" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="502" y="198" width="92" height="22" rx="4" fill="#17160F" opacity=".12"/>
    <rect x="502" y="228" width="42" height="22" rx="4" fill="#1E5A48" opacity=".28"/>
    <rect x="552" y="228" width="42" height="22" rx="4" fill="#1E5A48" opacity=".28"/>

    <path d="M630 224 H664" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M664 213 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 作る -->
    <circle cx="736" cy="224" r="30" fill="none" stroke="#1E5A48" stroke-width="4"/>
    <path d="M722 224 l10 11 20 -23" fill="none" stroke="#1E5A48" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- ラベル -->
    <text x="116" y="312" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">ぼんやりした依頼</text>
    <text x="116" y="334" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（人の頭の中だけにある）</text>

    <text x="332" y="312" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">/grill-me</text>
    <text x="332" y="334" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（人に質問を返す）</text>

    <text x="548" y="312" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #17160F;">/to-spec → /to-tickets</text>
    <text x="548" y="334" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（読み返せる形にする）</text>

    <text x="736" y="312" text-anchor="middle" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #1E5A48;">/tdd</text>
    <text x="736" y="334" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（作る）</text>

    <text x="400" y="404" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 手戻りは、書いたコードの中ではなく、依頼の曖昧さから生まれる 〜
    </text>
  </svg>
</figure>

キャプション:

エージェントを速くする話ではなく、**やり直しを減らす話**です。左端の曖昧さを右端まで持ち込むと、出来上がったものを見てから作り直すことになります。工程をひとつ前に足しているのが要点です。

## どんなときに使うか

### 出てきたコードは動くのに、頼んだものと違うとき

依頼を投げると素早く動くものが返ってくるが、読んでみると前提がずれている——という繰り返しに効きます。`/grill-me` は先に人へ質問を返す作りなので、着手前にずれが表に出ます。**待たされる工程が増えるぶん、作り直す回数が減る**、という取り引きです。

### 同じ前提を毎回書かされているとき

同じ前提を毎回打ち込んでいるなら、スキルを入れなくても `CONTEXT.md` の考え方だけ真似できます。置き場が1つあるだけで、説明の量が変わります。

## 注意点

**入れれば速くなる、という道具ではありません。** 中身は指示書なので、効くかどうかは書かれた進め方が自分たちのやり方と合うかどうかで決まります。作者は「vibe coding ではなく実務のアプリ開発向け」と明言していて、確認の工程を厚く取る作りです。とにかく速く動くものが欲しい場面とは、方向が逆になります。

**課題管理の前提が入ります。** `/to-tickets` `/triage` あたりは、GitHub Issues・Linear・ローカルファイルのいずれかに紐づけて使う想定です。この形が合わないチームでは、使えるスキルが減ります。

**全部を入れる必要はありません。** 1本1本が独立した Markdown なので、インストーラで入れたうえで中身を読み、合うものだけ残す使い方ができます。ライセンスは MIT です。
