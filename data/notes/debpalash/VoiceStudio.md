---
updated: 2026-09-06
image:
image_alt:
---

<!-- ============================================================
  debpalash/VoiceStudio
  https://github.com/debpalash/VoiceStudio
  VoiceStudio is the open-source, fully-local ElevenLabs alternative — voice cloning, voice design, video dubbing, dictation, transcription & audiobook creation in 646 languages.
  Python / AGPL-3.0 / スター 16,194
  topics: ai, audiobook, cuda, dubbing, elevenlabs-alternative, huggingface, local-first, mlx, omnivoice-studio, speech-to-text, tauri, text-to-speech, transcription, translate, tts, voice-ai, voice-cloning, voice-generation, voicestudio, workflow

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

声の合成も書き起こしも、手元の機械の中だけで終わらせる

## どういうものか

ElevenLabs のような音声サービスでやっていたことを、自分のパソコンの中で完結させるデスクトップアプリです。数秒から15秒ほどの見本を渡す声のクローン、年齢や訛りや高さを指定する声の設計、動画の吹き替え（書き起こし → 翻訳 → 合成を話者を保ったまま通す）、口述筆記、EPUB や PDF を読み込ませてのオーディオブック作成までが1つに入っています。

つくりは、Tauri v2（Rust）の殻の中に React の画面があり、その下で FastAPI のバックエンドが `localhost:3900` で動く形です。音声とテキストはこのバックエンドの中で処理されるので、遠隔のワーカーや外部のエンドポイントを自分で設定しない限り、機械の外に出ません。データは手元の SQLite に入ります。

肝は**エンジンを差し替えられる**ことです。読み上げ側16種・書き起こし側11種が登録済みで、既定は OmniVoice と WhisperX。画面からもコマンドからも切り替えられ、CUDA・Apple Silicon の MPS/MLX・ROCm・CPU を自動で見分けます。そのうえで OpenAI 互換の音声 API（`/v1/audio/speech` など）と MCP サーバーを備えているので、いま外部サービスを叩いているコードは、向き先を差し替えるだけで繋ぎ替えられる想定になっています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="緑の破線で囲まれた「あなたのパソコン」の枠の中に、見本の声と原稿、差し替えできるエンジン、出来上がった音声と字幕が左から右へ並び、外部サービスに出ていく矢印が無いことを示した図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="58" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      声も原稿も、<tspan style="fill: #1E5A48;">この機械の外に出さない</tspan>まま仕上がる
    </text>

    <!-- 境界 -->
    <rect x="48" y="100" width="704" height="252" rx="18" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="9 6"/>
    <text x="70" y="130" style="font-family: var(--jp); font-size: 16px; font-weight: 500; fill: #1E5A48;">あなたのパソコン（<tspan style="font-family: var(--mono);">localhost:3900</tspan>）</text>

    <!-- 入力 -->
    <rect x="80" y="196" width="176" height="88" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="168" y="232" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">見本の声と原稿</text>
    <text x="168" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（5〜15秒あれば足りる）</text>

    <path d="M270 240 H306" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M306 229 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- エンジン -->
    <rect x="332" y="188" width="180" height="104" rx="12" fill="#1E5A48"/>
    <text x="422" y="228" text-anchor="middle" style="font-family: var(--jp); font-size: 21px; font-weight: 700; fill: #FFFFFF;">エンジン</text>
    <text x="422" y="254" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #FFFFFF; opacity: .85;">（差し替えできる）</text>

    <path d="M520 240 H556" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M556 229 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 出力 -->
    <rect x="580" y="196" width="160" height="88" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <text x="660" y="232" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">音声・字幕</text>
    <text x="660" y="256" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（音声と字幕）</text>

    <text x="400" y="400" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 枠をまたぐ線が無い。APIキーも従量課金も出てこない 〜
    </text>
  </svg>
</figure>

キャプション:

見てほしいのは、破線の枠をまたぐ矢印が1本も無いことです。音声はそもそも個人が特定できる情報なので、「外に出さない」は機能ではなく前提として効いてきます。

## どんなときに使うか

### 社外に出せない音源を扱うとき

会議の録音、患者や顧客の声、公開前の原稿。クラウドの音声サービスに上げてよいか、という確認だけで話が止まる場面があります。機械の中で完結するなら、その確認が要らなくなります。

### 従量課金を気にせず、量を回したいとき

本1冊ぶんの読み上げ、動画をまとめて吹き替える、といった作業は文字数で効いてきます。電気代と時間だけになるなら、下書きを何度も作り直せます。

## 注意点

**アプリと、モデルの重みで、ライセンスが別です。ここが一番の落とし穴です。** アプリ本体は AGPL-3.0 で、改変版をネットワーク越しのサービスとして提供するならソースの公開義務が付きます（社内で普通に使うぶんには問題になりません）。それとは別に、ダウンロードされるモデルの重みは上流の条件のままで、既定の OmniVoice は CC-BY-NC——つまり非商用です。**生成した音声を売る計画があるなら、見るべきはアプリのライセンスではなくモデル側の条文です。** 商用ライセンスの用意はありますが、第三者のモデルまでは面倒を見てくれません。

**646言語は、16種のエンジンを合わせたカタログの数です。** 既定の OmniVoice 単体は600言語以上とされています。エンジンごとに扱える範囲は違い、実際に使いたい言語がどのエンジンで、どの品質で出るかは自分で確かめる話になります。「646言語対応」を1つのモデルの能力と読むと外れます。

**まだ active beta です。** Intel の Mac ではローカルのバックエンドが動かず、遠隔のバックエンドが要ります。推奨は VRAM 8GB 以上で、大きいエンジンはそれ以上要るとだけ書かれています。最低要件（RAM 8GB・VRAM 4GB）で動くことと、満足のいく品質と速さが出ることは別だと考えたほうがいいです。

**他人の声を複製できる道具です。** 本人の同意なしにクローンを作れば、法律の問題になりえます。既定で AudioSeal の電子透かしが入る作りになっていることは、頭に置いておいてよいと思います。合わない人、という以前に、使う側の責任が重い種類のソフトです。

