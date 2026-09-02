---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

資料を放り込むと、複数のAIが役割を分けて授業をしてくれる

## どういうものか

題材を一言書くか、手元の資料を投げ込むと、**授業まるごとを組み立てて再生する**ソフトです。清華大学の研究グループが公開しています。受け取れるのは PDF、Word、PowerPoint のほか、音声・動画・画像・テキストまで。中身を読んで目次を立て、その一項目ずつを「場面」に変えていきます。

場面には4つの種類があります。スライド、小テスト、対話型のシミュレーション、そして課題に取り組む形式です。再生を始めると、複数の AI が**それぞれ別の役割**で動きます。スライドを読み上げながらレーザーポインタで指し示す、複数体で討論する、その場でホワイトボードに図や数式を描く、小テストを採点してその場で講評する、といった具合です。教室で起きることを28種類以上の動作に分解してあり、LangGraph で組んだ「進行役」がその順番を捌いています。

出てきたものは持ち出せます。編集できる PowerPoint、単体で開ける HTML、授業まるごとの書き出しに対応しています。上位モードの Pro workbench では、生成の途中で AI と会話しながら「このページを直して」と指示を出せます。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="資料や題材を投げ込むと目次が立ち、各項目がスライド・小テスト・シミュレーション・課題の4種類の場面に変わり、複数のAIが役割を分けて教室として再生する、という流れの図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="54" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      資料1つが、<tspan style="fill: #1E5A48;">場面の並び</tspan>に変わって再生される
    </text>

    <!-- 1. 資料 -->
    <rect x="54" y="150" width="86" height="104" rx="8" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="72" y="172" width="50" height="7" rx="3.5" fill="#17160F" opacity=".2"/>
    <rect x="72" y="188" width="38" height="7" rx="3.5" fill="#17160F" opacity=".2"/>
    <rect x="72" y="206" width="50" height="30" rx="3" fill="#17160F" opacity=".12"/>

    <path d="M154 202 H186" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M186 191 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 2. 目次 -->
    <rect x="220" y="150" width="104" height="104" rx="8" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="7 5"/>
    <circle cx="242" cy="176" r="4" fill="#1E5A48"/><rect x="254" y="172" width="52" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>
    <circle cx="242" cy="198" r="4" fill="#1E5A48"/><rect x="254" y="194" width="44" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>
    <circle cx="242" cy="220" r="4" fill="#1E5A48"/><rect x="254" y="216" width="52" height="7" rx="3.5" fill="#1E5A48" opacity=".5"/>

    <path d="M338 202 H370" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M370 191 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 3. 4種類の場面 -->
    <rect x="404" y="140" width="58" height="50" rx="7" fill="#1E5A48" opacity=".16"/>
    <rect x="470" y="140" width="58" height="50" rx="7" fill="#1E5A48" opacity=".3"/>
    <rect x="404" y="200" width="58" height="50" rx="7" fill="#1E5A48" opacity=".44"/>
    <rect x="470" y="200" width="58" height="50" rx="7" fill="#1E5A48" opacity=".6"/>

    <path d="M544 202 H576" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M576 191 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 4. 教室 -->
    <rect x="610" y="140" width="136" height="110" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="628" y="156" width="100" height="46" rx="5" fill="#17160F" opacity=".12"/>
    <circle cx="648" cy="228" r="11" fill="#1E5A48"/>
    <circle cx="678" cy="228" r="11" fill="#1E5A48" opacity=".55"/>
    <circle cx="708" cy="228" r="11" fill="#1E5A48" opacity=".3"/>

    <!-- ラベル -->
    <text x="97" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">題材・資料</text>
    <text x="97" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">（PDF・動画も可）</text>

    <text x="272" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">目次</text>
    <text x="272" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">（読んで組み立てる）</text>

    <text x="466" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">4種類の場面</text>
    <text x="466" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">（4つの形に分かれる）</text>

    <text x="678" y="288" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">教室として再生</text>
    <text x="678" y="310" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #6E6A5F;">（複数のAIが役割を分ける）</text>

    <text x="400" y="384" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 出力は資料ではなく、時間の流れを持った授業 〜
    </text>
  </svg>
</figure>

キャプション:

いちばん右で、丸が3つに分かれているのが要点です。1体が全部やるのではなく、講師役・討論役といった具合に持ち場が分かれていて、その順番を進行役が捌いています。

## どんなときに使うか

### 分厚い資料を、読む以外の形で頭に入れたいとき

長い PDF を前にして進まない、というときに、講義と小テストの形に組み替えてもらう使い方ができます。読み上げてもらいながら、途中で質問を挟める形になります。

### 教材のたたき台を短時間で用意したいとき

編集できる PowerPoint として書き出せるので、生成物をそのまま使うのではなく、下地として受け取って手で直す、という進め方ができます。ゼロから構成を考える手間だけを省く形です。

## 注意点

**同梱物のライセンスが一様ではありません。** 本体は MIT ですが、README は同梱パッケージのうち `packages/mathml2omml` が **LGPL-3.0-or-later** だと明記しています。リポジトリごと再配布する場合は、この部分に別の条件がかかります。本体が MIT だからと一括で扱うと、そこだけ条件が違うことになります。

**モデルの用意が要ります。** 最低1つは LLM が必要です。外部の事業者を使うなら API キーが要ります。音声合成、音声認識、画像生成も、それぞれ事業者を選んで設定することになります。Lemonade や FunASR を使えば手元で完結させられる、とも書かれていますが、いずれにせよ設定の量は多めです。上位モードの Pro workbench には PostgreSQL も要ります。

**出来のばらつきはモデル側に出ます。** README は、3D やシミュレーション、ゲーム、コードを含む「深い対話モード」の生成はモデルの能力に依存し、性能の低いモデルでは仕上がりが落ちる、としています。

**新しいプロジェクトです。** v1.0.0 の公開は 2026年8月27日。動く範囲が広いぶん、設定の作法が変わる可能性はあります。
