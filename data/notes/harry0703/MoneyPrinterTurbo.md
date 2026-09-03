---
updated: 2026-09-04
image:
image_alt:
---

## 見出しの一文

テーマを一言入れると、台本から音声まで揃った短い動画が出てくる

## どういうものか

短い縦型動画を、**工程をまるごと自動で通して**作るソフトです。入力はテーマやキーワードで、出てくるのは字幕と読み上げと BGM が入った完成品です。画面付きの WebUI のほか、API とコマンドラインからも動かせます。

中では、台本を書く、素材の映像を集める、読み上げる、字幕を作る、音楽を敷く、書き出す、という工程が順に走ります。**それぞれの担当を差し替えられる**のがこのソフトの性格で、台本は OpenAI・Claude・Gemini・DeepSeek のほか Ollama で手元のモデルも選べます。映像は Pexels や Pixabay の無料素材、有料の Coverr、あるいは生成モデルに作らせるかを選べます。読み上げは無料の Edge TTS から ElevenLabs まで、字幕は読み上げ側のタイムスタンプを使うか Whisper で書き起こすかです。

出力は縦（1080×1920）・横（1920×1080）・正方形の3種類で、TikTok・Instagram・YouTube ショートに合わせてあります。動かすには Python 3.11 以降が要り、Windows 向けのワンクリック版、Docker、Colab のノートブックも用意されています。README に載っている目安は、最小で4コア・メモリ4GB。**GPU は必須ではありません**が、手元で書き起こしを速く回したい場合には勧められています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="ひとつのキーワードが、台本、素材、読み上げと字幕、音楽と書き出しという4つのまとまりを順に通って、縦横正方形の3種類の動画になる流れの図。前の3つは担当を差し替えられることを点線で示している。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="54" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      テーマ1つを、<tspan style="fill: #1E5A48;">工程を全部通して</tspan>動画にする
    </text>

    <!-- 入力 -->
    <rect x="30" y="176" width="96" height="60" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="50" y="200" width="56" height="12" rx="6" fill="#17160F" opacity=".25"/>

    <path d="M138 206 H166" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M166 195 l16 11 -16 11 z" fill="#1E5A48"/>

    <!-- 6工程 -->
    <rect x="190" y="170" width="72" height="72" rx="10" fill="#1E5A48" opacity=".92"/>
    <text x="226" y="212" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">台本</text>

    <path d="M270 206 H288" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M288 195 l16 11 -16 11 z" fill="#1E5A48"/>

    <rect x="312" y="170" width="72" height="72" rx="10" fill="#1E5A48" opacity=".78"/>
    <text x="348" y="212" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">素材</text>

    <path d="M392 206 H410" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M410 195 l16 11 -16 11 z" fill="#1E5A48"/>

    <rect x="434" y="170" width="72" height="72" rx="10" fill="#1E5A48" opacity=".64"/>
    <text x="470" y="205" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">読み上げ</text>
    <text x="470" y="225" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">字幕</text>

    <path d="M514 206 H532" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M532 195 l16 11 -16 11 z" fill="#1E5A48"/>

    <rect x="556" y="170" width="72" height="72" rx="10" fill="#1E5A48" opacity=".5"/>
    <text x="592" y="205" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">音楽</text>
    <text x="592" y="225" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; font-weight: 700; fill: #FFFFFF;">書き出し</text>

    <path d="M636 206 H656" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M656 195 l16 11 -16 11 z" fill="#1E5A48"/>

    <!-- 出力：3つの比率 -->
    <rect x="682" y="156" width="26" height="46" rx="3" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="716" y="166" width="46" height="26" rx="3" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="694" y="212" width="32" height="32" rx="3" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>

    <!-- 差し替えの矢印 -->
    <path d="M226 262 V286" stroke="#6E6A5F" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M348 262 V286" stroke="#6E6A5F" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M470 262 V286" stroke="#6E6A5F" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="352" y="308" text-anchor="middle" style="font-family: var(--jp); font-size: 13px; fill: #6E6A5F;">この3つは担当を差し替えられる（無料のものから有料のものまで）</text>

    <!-- ラベル -->
    <text x="78" y="270" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">テーマ</text>
    <text x="78" y="292" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（一言）</text>

    <text x="722" y="270" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">3つの比率</text>
    <text x="722" y="292" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（縦・横・正方形）</text>

    <text x="400" y="400" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 手が止まるのは編集ではなく、工程の間の受け渡しだった 〜
    </text>
  </svg>
</figure>

キャプション:

工程を1つずつ速くする道具ではありません。**工程と工程の間を人が繋いでいた**のをやめて、テーマから完成品までを一本の線にしています。

## どんなときに使うか

### 動画の形式は決まっていて、本数だけ必要なとき

構成が毎回同じで、テーマだけが変わる——という作り方に向いています。台本も素材も読み上げも、選び直すのは最初の一度で済みます。

### 有料のサービスを使う前に、形を確かめたいとき

台本を手元のモデル（Ollama）で、読み上げを無料の Edge TTS で回せば、費用をかけずに一周できます。**出来上がりを見てから、どの工程に金を払うかを決められます。** 逆に言えば、質を上げようとした時点で各社との契約が要ります。

## 注意点

**素材の権利は、使う側の責任で確かめることになります。** 無料のストック素材にもそれぞれ利用条件があり、生成モデルで作った映像にも提供元の規約があります。ソフトが集めてきたからといって、公開してよいことにはなりません。

**投稿先の規約も別にあります。** TikTok・YouTube ショートなどは、量産された内容や AI 生成物の扱いについて、それぞれ規定を持っています。**作れることと、投稿してよいことは別です。**

ライセンスは MIT です。ソフトそのものは商用利用に制限がありませんが、上に書いた素材と投稿先の話は、ライセンスとは別の問題として残ります。
