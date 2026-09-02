---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

選ぶ手間を手放す代わりに、初日から仕上がった Linux が手に入る

## どういうものか

DHH が作っている Linux ディストリビューションです。中身は Arch Linux が土台で、そこにタイル型ウィンドウマネージャの Hyprland と、デスクトップの部品を組み立てる Quickshell が載っています。その上に、Neovim、Chromium、Obsidian、LibreOffice、Kdenlive、OBS Studio といった道具が最初から入った状態で配られます。

作者はこれを、**おまかせ（omakase）のディストリビューション**と呼んでいます。Linux を自分で組む場合、ウィンドウマネージャは何にするか、バーは何を使うか、配色はどうするかを、一つずつ決めていくことになります。Omarchy はその判断を**全部済ませた状態**で渡してきます。マニュアルには「ここに無駄なものは一切ない。あるのは私が使うものだけだ」とあります。つまり、誰にでも合う最大公約数ではなく、**作者一人の好みが、そのまま完成品として固定されている**わけです。

導入は ISO です。USB メモリに書き込んで起動し、いくつか質問に答えると、インストール自体は5分もかかりません。ディスク全体を使う方式のほか、空き領域に入れて他の OS と共存させることもできます。ディスクの暗号化は既定で有効になっています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="ふつうのLinuxでは、土台・ウィンドウマネージャ・見た目・アプリの4つを利用者が一つずつ選ぶのに対し、Omarchyはその4つを決め打ちで積み上げてISO1枚として配る、という対比の図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="56" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      同じ4つを積む。<tspan style="fill: #1E5A48;">誰が選ぶか</tspan>だけが違う
    </text>

    <!-- 左：ふつうのLinux -->
    <text x="180" y="104" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #514D45;">ふつうに組む場合</text>

    <rect x="72" y="124" width="216" height="42" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2" stroke-dasharray="6 5"/>
    <text x="180" y="151" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; fill: #514D45;">アプリ … どれを入れる？</text>

    <rect x="72" y="176" width="216" height="42" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2" stroke-dasharray="6 5"/>
    <text x="180" y="203" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; fill: #514D45;">見た目 … 何で作る？</text>

    <rect x="72" y="228" width="216" height="42" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2" stroke-dasharray="6 5"/>
    <text x="180" y="255" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; fill: #514D45;">窓の管理 … 何を使う？</text>

    <rect x="72" y="280" width="216" height="42" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2" stroke-dasharray="6 5"/>
    <text x="180" y="307" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; fill: #514D45;">土台 … どのディストロ？</text>

    <text x="180" y="352" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（4回ぶんの判断が利用者に残る）</text>

    <!-- 矢印 -->
    <path d="M320 222 H372" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M372 211 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 右：Omarchy -->
    <text x="592" y="104" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #1E5A48;">Omarchy</text>

    <rect x="484" y="124" width="216" height="42" rx="8" fill="#1E5A48" opacity=".14"/>
    <text x="592" y="151" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; font-weight: 700; fill: #17160F;">Neovim・Obsidian ほか一式</text>

    <rect x="484" y="176" width="216" height="42" rx="8" fill="#1E5A48" opacity=".28"/>
    <text x="592" y="203" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; font-weight: 700; fill: #17160F;">Quickshell</text>

    <rect x="484" y="228" width="216" height="42" rx="8" fill="#1E5A48" opacity=".42"/>
    <text x="592" y="255" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; font-weight: 700; fill: #17160F;">Hyprland</text>

    <rect x="484" y="280" width="216" height="42" rx="8" fill="#1E5A48"/>
    <text x="592" y="307" text-anchor="middle" style="font-family: var(--jp); font-size: 16px; font-weight: 700; fill: #FFFFFF;">Arch Linux</text>

    <text x="592" y="352" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（4つとも作者が決めてある・ISO1枚）</text>

    <text x="400" y="404" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 減っているのは選択肢ではなく、選ぶ手間のほう 〜
    </text>
  </svg>
</figure>

キャプション:

積んでいるものは、自分で組む場合と大きくは変わりません。違うのは、4段ぶんの判断がすでに済んでいることです。その判断を他人に委ねられるかどうかが、そのまま向き不向きになります。

## どんなときに使うか

### 環境を整えること自体に時間を使いたくないとき

設定を詰めはじめると、本来やりたかった作業が後回しになります。ウィンドウマネージャの選定から配色の調整まで済んだ状態が5分で立ち上がるなら、その時間はまるごと省けます。あとから気に入らない部分を直せばよい、という順番にできます。

### Linux をきちんと使う気があるとき

マニュアルには、Windows や macOS とは違うものとして受け入れてほしい、端末を使い、設定ファイルを編集することになる、と書かれています。GUI だけで完結させたい人向けには作られていません。

## 注意点

**BIOS の設定変更が要ります。** マニュアルには「Secure Boot と TPM のどちらか、または両方を BIOS で切る必要がある」と書かれています。これらは Windows とその周辺のために用意された仕組みだ、という説明が添えられています。BIOS を触れない環境では、そもそも導入できません。

**キーボードの種類に制約があります。** ディスク暗号化が既定で有効なので、起動時にパスワードを入力する必要があります。マニュアルは「Bluetooth キーボードからは暗号化のパスワードを入力できない」と明記しています。有線か 2.4GHz の無線が要ります。

**ディスクの中身が消えます。** ディスク全体を使う方式では、選んだドライブが丸ごと消去されます。空き領域に入れて共存させる方式もありますが、マニュアル自身が「既存のものを使うなら、必ず先にバックアップを取ること」と書いています。

**合わないのは、自分で選びたい人です。** これは欠点ではなく、そういう設計だという話です。基準は作者一人の好みなので、自分の選択に強いこだわりがあるなら、土台だけ借りて自分で組むほうが早いはずです。

ライセンスは MIT で、商用利用の妨げになる条項はありません。
