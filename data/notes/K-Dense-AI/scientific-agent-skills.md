---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

科学のライブラリとデータベースへの「入り方」を、エージェントに先渡しする

## どういうものか

生物・化学・医学・物理・工学まわりの作業手順を、コーディングエージェント向けにまとめた163本のスキル集です。K-Dense 社が公開していて、Claude Code・Cursor・Codex・Gemini CLI など、Agent Skills の形式に対応した道具ならどれでも読み込めます。

1本のスキルは、`SKILL.md` という説明書と、動かせるスクリプト、そのテストの組で出来ています。**エージェントに新しい能力を足すというより、既にある Python ライブラリや公開データベースへの入り方を先に渡しておく**、という性格のものです。シングルセルRNA-seq の Scanpy、化学構造の RDKit、材料の pymatgen、量子計算の Qiskit といった70以上のパッケージについて、どの関数をどの順で呼ぶか、どこでつまずくかが書かれています。

まとまりが良いのが**データベース側**で、`database-lookup` という1本のスキルの下に PubChem・ChEMBL・UniProt・COSMIC・ClinicalTrials.gov・FDA・USPTO など78の公開データベースが束ねられています。API ごとの作法を毎回調べる部分が、ここで消えます。全体は CI で検証されるとされ、スキルの安全性スキャンも定期的に走る、と説明されています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="研究者の問いが、エージェントとスキル集を通って、公開データベースと科学ライブラリに届き、出典と手順が残った結果になる流れの図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="56" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      エージェントに<tspan style="fill: #1E5A48;">道の通し方</tspan>を先に持たせる
    </text>

    <!-- 問い -->
    <rect x="36" y="184" width="126" height="84" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="99" y="238" text-anchor="middle" style="font-family: var(--jp); font-size: 38px; font-weight: 700; fill: #17160F;">？</text>

    <path d="M174 226 H206" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M206 215 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- スキル集 -->
    <rect x="236" y="164" width="150" height="124" rx="12" fill="#1E5A48"/>
    <rect x="262" y="190" width="98" height="10" rx="5" fill="#FFFFFF" opacity=".9"/>
    <rect x="262" y="210" width="98" height="10" rx="5" fill="#FFFFFF" opacity=".65"/>
    <rect x="262" y="230" width="98" height="10" rx="5" fill="#FFFFFF" opacity=".45"/>
    <text x="311" y="272" text-anchor="middle" style="font-family: var(--jp); font-size: 17px; font-weight: 700; fill: #FFFFFF;">163本</text>

    <!-- 分岐 -->
    <path d="M398 200 C 428 200, 430 164, 452 164" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M452 153 l18 11 -18 11 z" fill="#1E5A48"/>
    <path d="M398 252 C 428 252, 430 288, 452 288" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M452 277 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- データベース -->
    <rect x="478" y="126" width="270" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="613" y="158" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">公開データベース 78</text>
    <text x="613" y="182" text-anchor="middle" style="font-family: var(--jp); font-size: 13px; fill: #6E6A5F;">（PubChem・UniProt ほか）</text>

    <!-- ライブラリ -->
    <rect x="478" y="250" width="270" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="613" y="282" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">科学ライブラリ 70+</text>
    <text x="613" y="306" text-anchor="middle" style="font-family: var(--jp); font-size: 13px; fill: #6E6A5F;">（RDKit・Scanpy ほか）</text>

    <!-- ラベル -->
    <text x="99" y="300" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">研究者の問い</text>
    <text x="99" y="322" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（分野はまちまち）</text>

    <text x="311" y="318" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #1E5A48;">手順書</text>
    <text x="311" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（どれをどう呼ぶか）</text>

    <text x="400" y="410" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 詰まるのは道具の性能ではなく、その道具への入り方だった 〜
    </text>
  </svg>
</figure>

キャプション:

真ん中の箱が足しているのは計算力ではなく、**下調べの時間**です。API の仕様を読み、呼び方を試し、動く形にするまでの往復が、ここで先に済んでいます。

## どんなときに使うか

### 分野の外側のデータに手を出したいとき

自分の専門から少し離れたデータベースを触るとき、いちばん時間を取られるのは解析そのものではなく、**取ってくるまで**です。名前は知っているが叩いたことのない出典に、下調べなしで手を伸ばせます。

### あとから経過を辿れる形で残したいとき

途中の出力・引用元・判断を隠さず出すことが設計方針として書かれています。査読や再現の確認を前提にした作りなので、答えだけが返ってくる使い方とは向きが違います。

## 注意点

**入れる前に中身を読む前提の集まりです。** README には、スキルはコードを実行しエージェントの挙動に影響しうるので**インストールするものは自分で確認すること**、そして**一度に全部を入れないこと**が書かれています。163本をまとめて導入する使い方は、作者自身が想定していません。

**ライセンスが1枚ではありません。** リポジトリ全体は MIT ですが、**スキルごとに別のライセンスが `SKILL.md` に書かれています。** 商用で使うなら、使う1本ずつを確認することになります。

**臨床や規制の判断には使えません。** 臨床研究・変異解釈・規制対応まわりのスキルには、出力は研究用の下書きであって決定の根拠ではない、と明記されています。有資格者の確認を挟む前提で作られています。

なお README が Python 3.13 以降を求めているのは**リポジトリ側の検証ツールを回すため**で、スキルを使う側の必要条件として書かれているわけではありません。必要な Python パッケージは各スキルの `SKILL.md` に個別に書かれています。データベース系のスキルはネット接続と、ものによっては API キーが要ります。
