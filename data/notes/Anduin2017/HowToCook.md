---
updated: 2026-08-30
image:
image_alt:
---

## 見出しの一文

「適量」をなくす。レシピを仕様書の書き方で書き直したリポジトリ

## どういうものか

料理のレシピ集です。中身はコードではなく文章で、README には閲覧用の Web サービスを Docker で立てる手順も添えられています。文章のリポジトリで、スターが10万を超えています。

出発点は、作者が家で料理を始めたときの不満です。ネットのレシピは書き方がばらばらで、材料の欄になかったものが手順の途中から突然出てくる。分量は「適量」で終わる。形式言語に慣れた人間には、これが非常に読みにくい。だったら自分で、**もっと明確で正確な書き方に統一して整理し直そう**というのが趣旨です。掲げているのは「プログラマのための料理指南」です。

書き方が全編で揃っているのが肝です。材料を分量つきで先に全部並べ、手順は番号を振って、時間と火加減を数字で書く。読み手が途中で判断を求められる箇所を減らす、という方向で統一されています。そしてこれが個人のメモで終わらず、**コミュニティ運営のリポジトリ**として作られています。レシピの追加や修正はプルリクエストで入ってきて、フォークは1万を超えています。料理の手順をレビューして取り込む、という光景がそこにあります。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="「レシピを同じ形に揃える」と題した図。左に行の長さがばらばらのレシピカード、中央に番号の揃ったレシピカード、右に人を表す複数の丸が並び、左から右へ矢印でつながっている。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="60" text-anchor="middle"
          style="font-family: var(--jp); font-size: 31px; font-weight: 700; fill: #17160F;">
      レシピを<tspan style="fill: #1E5A48;">同じ形</tspan>に揃える
    </text>

    <!-- ばらばらのレシピ -->
    <rect x="88" y="146" width="124" height="118" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="106" y="168" width="72" height="7" rx="3.5" fill="#17160F" opacity=".18"/>
    <rect x="112" y="186" width="46" height="7" rx="3.5" fill="#17160F" opacity=".18"/>
    <rect x="104" y="204" width="88" height="7" rx="3.5" fill="#17160F" opacity=".18"/>
    <rect x="118" y="222" width="34" height="7" rx="3.5" fill="#17160F" opacity=".18"/>
    <text x="106" y="248" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">適量・お好みで</text>

    <path d="M230 205 H 268" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M268 194 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 揃ったレシピ -->
    <rect x="338" y="146" width="124" height="118" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5"/>
    <rect x="356" y="168" width="9" height="9" rx="2" fill="#1E5A48"/>
    <rect x="373" y="169" width="70" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>
    <rect x="356" y="190" width="9" height="9" rx="2" fill="#1E5A48"/>
    <rect x="373" y="191" width="70" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>
    <rect x="356" y="212" width="9" height="9" rx="2" fill="#1E5A48"/>
    <rect x="373" y="213" width="70" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>
    <text x="356" y="248" style="font-family: var(--mono); font-size: 14px; fill: #1E5A48;">300g / 5min</text>

    <path d="M480 205 H 518" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M518 194 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- コミュニティ -->
    <circle cx="596" cy="172" r="17" fill="#1E5A48" opacity=".85"/>
    <circle cx="650" cy="160" r="17" fill="#1E5A48" opacity=".55"/>
    <circle cx="702" cy="176" r="17" fill="#1E5A48" opacity=".75"/>
    <circle cx="616" cy="228" r="17" fill="#1E5A48" opacity=".45"/>
    <circle cx="676" cy="234" r="17" fill="#1E5A48" opacity=".65"/>

    <!-- ラベル -->
    <text x="150" y="300" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">よくあるレシピ</text>
    <text x="150" y="322" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（書き方がばらばら）</text>

    <text x="400" y="300" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">決まった書き方</text>
    <text x="400" y="322" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（材料が先、分量は数字）</text>

    <text x="650" y="300" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">みんなで足す</text>
    <text x="650" y="322" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（プルリクエストで追加）</text>

    <text x="400" y="400" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 形を決めたから、他人が足せるようになった 〜
    </text>
  </svg>
</figure>

キャプション:

読み手のためだけの統一に見えて、実は書き手のための統一でもある、という図です。形が決まっていれば他人がレビューできるので、料理の手順にプルリクエストが飛ぶという珍しい光景が成り立っています。

## どんなときに使うか

### 「適量」「お好みで」で止まるレシピに困っているとき

料理に慣れていないうちは、その一言がいちばん困ります。数字で書かれているものを探しているなら、そもそもそこを直すために始まったリポジトリなので、目的が一致します。

### 手順を書く形式のお手本がほしいとき

料理に限らず、社内の作業手順書や運用マニュアルでも「読み手に判断させない書き方」は同じ課題です。同じ形式で大量にそろっている実例として見ると、料理とは別の読み方ができます。

## 注意点

**全編中国語です。** 日本語に訳されたものは見当たりません。翻訳を通せば読めますが、調味料や調理法の言葉は訳がぶれやすいところなので、そのまま鵜呑みにはできません。

**中国の家庭料理が中心です。** 材料や調味料に、日本のスーパーではそのまま手に入らないものが出てきます。火力の前提も家庭用の中華コンロ寄りです。書き方の考え方は真似できますが、レシピをそのまま実行できるとは限りません。

**スターの多さは実用性の証明ではありません。** 動かして確かめてから星を付ける類のものではないので、「10万人が使って動作を確認した」という意味にはなりません。着眼点の面白さに票が集まっている面が大きいと考えたほうがいいです。

ライセンスは Unlicense で、著作権を主張しない、ほぼパブリックドメインに置く形が選ばれています。無保証である点も明記されています。火加減や食品の扱いを含む内容なので、そこは頭に入れて読んだほうがいいです。
