---
updated: 2026-08-30
image:
image_alt:
---

## 見出しの一文

機能を足さないことで速さを取った、GPUで文字を描くターミナル

## どういうものか

ターミナルエミュレータです。他と違うのは、文字の描画を OpenGL に投げてGPUにやらせているところです。ターミナルの体感速度は、大量の出力が流れたときと、キーを打ってから文字が出るまでの間にいちばん出ます。そこを描画側から詰めた作りになっています。

もうひとつの特徴は、**持っていない機能がはっきりしている**ことです。画面分割がありません。タブも、macOS のネイティブタブを除けば持っていません。README には、他のアプリケーションの機能を作り直すのではなく、それらと連携することで高い性能を保っている、と書かれています。分割やセッション管理は tmux に、ウィンドウの並べ方はウィンドウマネージャに任せる、という前提です。

設定画面はなく、設定は TOML のテキストファイル1枚です（以前は YAML でした）。フォント、配色、キーバインドをそこに書きます。Rust で書かれていて、Linux・macOS・Windows・BSD で動きます。完成度としてはまだベータ相当だと README に書かれています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="「ターミナルの仕事を外に分ける」と題した図。Alacritty から右へ2本の矢印が伸び、tmux（画面の分割・セッション）とウィンドウマネージャ（ウィンドウの配置）につながっている。Alacritty 自身には「文字を描く（GPUで描画する）」とだけ書かれている。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="62" text-anchor="middle"
          style="font-family: var(--jp); font-size: 31px; font-weight: 700; fill: #17160F;">
      ターミナルの仕事を<tspan style="fill: #1E5A48;">外に分ける</tspan>
    </text>

    <!-- Alacritty -->
    <rect x="76" y="168" width="176" height="116" rx="12" fill="#1E5A48"/>
    <text x="164" y="234" text-anchor="middle"
          style="font-family: var(--mono); font-size: 23px; font-weight: 500; fill: #FFFFFF;">Alacritty</text>

    <text x="164" y="318" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">文字を描く</text>
    <text x="164" y="340" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（GPUで描画する）</text>

    <!-- 矢印 -->
    <path d="M268 200 C 330 200, 338 168, 398 168" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M398 157 l18 11 -18 11 z" fill="#1E5A48"/>
    <path d="M268 252 C 330 252, 338 288, 398 288" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M398 277 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 渡す先 -->
    <rect x="424" y="136" width="306" height="64" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="446" y="166" style="font-family: var(--mono); font-size: 19px; font-weight: 500; fill: #17160F;">tmux</text>
    <text x="446" y="188" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（画面の分割・セッション）</text>

    <rect x="424" y="256" width="306" height="64" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="446" y="286" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">ウィンドウマネージャ</text>
    <text x="446" y="308" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（ウィンドウの配置）</text>

    <text x="400" y="404" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 作らない機能を決めることが、速さの取り方になっている 〜
    </text>
  </svg>
</figure>

キャプション:

画面の分割やセッション管理が「まだ無い」のではなく、**外に出してある**という図です。ターミナル1本で完結させたい人には向かず、tmux を併用している人には無駄がない、という分かれ方をします。

## どんなときに使うか

### ログやビルド出力が滝のように流れるのが日常のとき

出力が詰まって描画が追いつかなくなる場面は、ターミナルを何に使っているかで頻度がまるで違います。テストやビルドのログを毎日大量に流している人ほど、描画の速さが効いてきます。

### 設定を1枚のファイルで持ち歩きたいとき

GUI の設定画面がない代わり、設定はテキストファイルだけで完結します。dotfiles に入れて複数のマシンで同じ環境にする、という使い方と相性がいいです。

## 注意点

**ターミナル単体で完結させたい人には向きません。** 分割やセッションの管理を外部にまかせる気がないなら、機能が足りないと感じるはずです。この線引きは方針として意図的なものなので、将来入る見込みも薄いと考えたほうがいいです。

**描画に GPU を使います。** OpenGL が使える前提の作りなので、仮想マシンやリモートデスクトップなど、描画まわりに制約のある環境では動作要件を先に確認したほうがいいです。速さを取りに行った設計の裏返しです。

ライセンスは Apache-2.0 です。特許条項を含みますが、商用利用の妨げになるものではありません。
