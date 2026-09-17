---
updated: 2026-09-17
image:
image_alt:
---

<!-- ============================================================
  NationalSecurityAgency/ghidra
  https://github.com/NationalSecurityAgency/ghidra
  Ghidra is a software reverse engineering (SRE) framework
  Java / Apache-2.0 / スター 77,750
  topics: disassembler, reverse-engineering, software-analysis
============================================================ -->


## 見出しの一文

中身のわからない実行ファイルを、人が読める形に戻して調べる


## どういうものか

配布されているソフトは、ほとんどが**コンパイル済み**の形で届く。人が書いた元のコードは手元になく、機械が実行するための並びだけがある。この状態から中身を読み解く作業をリバースエンジニアリングと呼ぶ。Ghidra は、その作業に必要な道具をひとまとめにした土台で、**アメリカ国家安全保障局（NSA）の研究部門が作り、いまも手入れしている**。Windows・macOS・Linux をはじめ、さまざまな環境向けにコンパイルされたコードを扱えると README にある。

できることは、逆アセンブル（機械語を命令の並びに戻す）、アセンブル、逆コンパイル（より高い水準のコードの形に起こす）、図として描く、スクリプトで動かす、ほか多数と README は並べている。**対応している命令セットと実行ファイルの形式が幅広い**ことも特徴に挙がっている。使い方は2通りあり、画面を見ながら人が追っていく形と、自動で流す形の両方に対応する。利用者が自分で拡張機能やスクリプトを作ることもでき、その言語は Java と Python。

作られた背景も README に書かれている。規模が大きく、**複数人で分担する解析**でうまく回らなくなる問題を解くために作られ、研究の土台として手を入れやすいことを狙っている。NSA 自身は、悪意のあるコードの解析や、ネットワークや機器に潜む弱点を深く知るための道具として使ってきたとある。GitHub にこのリポジトリが置かれたのは2019年3月で、以来ずっと更新が続いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「配布された実行ファイルを、読める形に戻す」とある図。左に「実行ファイル」があり、コンパイル済みで、元のコードは付いてこない と書かれている。中央は「Ghidra」で、逆アセンブル、逆コンパイル、図にして描く と並ぶ。右は「読み解いた結果」で、命令の並び、コードに近い形 と書かれている。下に「画面で人が追う道と、自動で流す道の両方がある（拡張とスクリプトは Java と Python）」とある。いちばん下に「ひとりで抱えきれない規模の解析を、分担して進めるために作られている」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="gh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">配布された実行ファイルを、<tspan fill="#1E5A48">読める形</tspan>に戻す</text>
  <rect x="20" y="120" width="205" height="170" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="122" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">実行ファイル</text>
  <text x="122" y="208" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">コンパイル済みで、</text>
  <text x="122" y="232" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">元のコードは付いてこない</text>
  <line x1="225" y1="205" x2="267" y2="205" stroke="#1E5A48" stroke-width="4" marker-end="url(#gh-arrow)" />
  <rect x="275" y="120" width="250" height="170" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="168" text-anchor="middle" font-size="18" font-weight="700" fill="#1E5A48">Ghidra</text>
  <text x="400" y="206" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">逆アセンブル</text>
  <text x="400" y="232" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">逆コンパイル</text>
  <text x="400" y="258" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">図にして描く</text>
  <line x1="525" y1="205" x2="567" y2="205" stroke="#1E5A48" stroke-width="4" marker-end="url(#gh-arrow)" />
  <rect x="575" y="120" width="205" height="170" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="677" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">読み解いた結果</text>
  <text x="677" y="208" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">命令の並び、</text>
  <text x="677" y="232" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">コードに近い形</text>
  <text x="400" y="342" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">画面で人が追う道と、自動で流す道の両方がある（拡張とスクリプトは Java と Python）</text>
  <text x="400" y="392" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">ひとりで抱えきれない規模の解析を、分担して進めるために作られている</text>
</svg>

キャプション: 押さえどころは真ん中の箱の中身ではなく、**ひとりで抱え込まずに済む形にしてある**こと。README が最初に挙げる開発の動機がそれにあたる。


## どんなときに使うか

### 手元の実行ファイルが何をしているのか確かめたいとき

出どころのはっきりしないファイル、仕様書の残っていない古いソフト、動きが説明と合わない実行ファイル。**元のコードが手に入らない相手**を調べるための入口になる。逆アセンブルから逆コンパイル、図示までが同じ土台にそろっていて、無償で使える。

### 同じ対象を複数人で分担して読み進めたいとき

README は、規模が大きく分担が必要な解析でつまずく問題を解くために作った、と書いている。ひとりで完結する読み解きよりも、**複数人で進める場面**を先に見ている作りだ、ということになる。


## 注意点

**特定の版に既知の脆弱性がある、と README 自身が警告している。** 「古いものだけ」とは書かれていない。使う前にリポジトリのセキュリティ勧告（Security Advisories）を読んで、自分が影響を受けるか確かめるように、と冒頭近くに書かれている。解析対象を読み込む道具なので、ここは飛ばさないほうがいい。

**配布物のダウンロードを間違えやすい。** 公式の配布ファイルは `ghidra_<バージョン>_<リリース>_<日付>.zip` という名前で、リリースページの「Assets」の中にある。**「Source Code」と書かれたファイルはこれではない**と README がわざわざ注意している。また、既にある導入先に上書きして展開してはいけないとも書かれている。

**動かすのに Java が要る。** 導入手順の1行目が「JDK 25 の64ビット版を入れる」になっている。自分でソースから組み立てる場合は、さらに Gradle（ネットにつながるなら同梱の wrapper で代えられる）・Python3・コンパイラ一式が要り、手順の重さが変わる。

**スクリプトを書く環境は、組み上がった導入先が前提。** Eclipse 向けの GhidraDev と Visual Studio Code の連携は、リリースページから落として組み上がったものに対してのみ対応する、と README に明記されている。ライセンスは Apache-2.0。
