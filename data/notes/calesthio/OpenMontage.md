---
updated: 2026-09-14
image:
image_alt:
---

<!-- ============================================================
  calesthio/OpenMontage
  https://github.com/calesthio/OpenMontage
  Python / AGPL-3.0 / スター 58,000台
  topics: agentic-ai, video-generation, remotion, ffmpeg, text-to-video
============================================================ -->


## 見出しの一文

動画作りを工程に分けて、手元のコーディングAIに1本ぶん通させる


## どういうものか

OpenMontage は、Claude Code や Cursor のような**コーディング用の AI アシスタントを、動画制作の進行役として使う**ための一式です。特徴は、進行を管理するプログラムを持っていないところにあります。README は「コードのオーケストレーターは存在しない。あなたの AI アシスタントが**それ自体**オーケストレーターだ」と書いています。人は作りたいものを言葉で伝え、エージェントが調査から仕上げまでを順に進めます。

進み方は、どの種類の動画でも同じ並びです。**調査 → 提案 → 台本 → 場面の設計 → 素材づくり → 編集 → 合成。** 工程ごとに YAML の定義ファイル（どの道具を使い、何を満たせば次に進めるか）と、Markdown で書かれた「その工程のやり方」の指示書が置かれていて、エージェントはそれを読んでから Python の道具を呼びます。素材を作る業者（画像・動画・音声の生成 API）の選定は、課題との相性・品質・費用・速さなど7つの観点で点を付けて選び、選んだ理由が記録に残る作りです。

**無料の鍵がゼロでも作れる道が、はじめから用意されています。** ナレーションは手元で動く Piper TTS、映像は Archive.org・NASA・Wikimedia Commons などの公開アーカイブ、組み立ては Remotion（React）か HyperFrames（HTML と GSAP）、仕上げは FFmpeg。README はここを強調していて、「無料の AI 動画」の多くが実際には静止画を動かしているだけなのに対し、こちらは**実写の映像素材を検索して並べ、timeline として編集した動画**を作れる、と書いています。有料の生成 API（Veo、Kling ほか）は、鍵を足した分だけ選べる道が増える、という位置づけです。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「工程ごとに、止まる場所が決めてある」とある図。上段に工程が左から順に並ぶ。調査（ウェブを調べる）、提案（費用の見積もりも出す）、台本、場面の設計、素材づくり、編集、合成。提案・台本・場面の設計・素材づくりの4つから下に矢印が伸び、「人が承認するまで、次に進まない」と書かれた帯につながっている。帯の下に「提案／台本／場面の設計／生成した素材、そして公開」とある。下に「工程ごとに、やり方を書いた指示書がある」「止まるのは、生成にお金を使う前と、使ったあとの両方」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="om-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">工程ごとに、<tspan fill="#1E5A48">止まる場所</tspan>が決めてある</text>

  <rect x="24" y="120" width="104" height="86" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="76" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">調査</text>
  <text x="76" y="182" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（ウェブを調べる）</text>
  <line x1="130" y1="163" x2="152" y2="163" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="158" y="120" width="104" height="86" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="210" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">提案</text>
  <text x="210" y="182" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（費用の見積もりも出す）</text>
  <line x1="264" y1="163" x2="286" y2="163" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="292" y="120" width="104" height="86" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="344" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">台本</text>
  <line x1="398" y1="163" x2="420" y2="163" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="426" y="120" width="104" height="86" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="478" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">場面の設計</text>
  <line x1="532" y1="163" x2="554" y2="163" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="560" y="120" width="104" height="86" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="612" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">素材づくり</text>
  <line x1="666" y1="163" x2="688" y2="163" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="694" y="120" width="82" height="86" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="735" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">編集</text>
  <text x="735" y="182" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">合成</text>

  <line x1="210" y1="206" x2="210" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />
  <line x1="344" y1="206" x2="344" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />
  <line x1="478" y1="206" x2="478" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />
  <line x1="612" y1="206" x2="612" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />

  <rect x="158" y="250" width="506" height="50" rx="8" fill="#1E5A48" />
  <text x="411" y="281" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">人が承認するまで、次に進まない</text>
  <text x="411" y="324" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">提案 ／ 台本 ／ 場面の設計 ／ 生成した素材、そして公開</text>

  <text x="400" y="374" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">工程ごとに、やり方を書いた指示書がある</text>
  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">止まるのは、生成にお金を使う前と、使ったあとの両方</text>
</svg>

キャプション: 一言で全部やらせる作りではなく、**節目ごとに人の承認で止まる**。生成にお金を使う前だけでなく、出来上がった素材を見てから先に進むかどうかも、人が決める形になっている。


## どんなときに使うか

### 生成AIの動画が「静止画の紙芝居」になるのを避けたいとき

有料の動画生成 API を使わずに実写の映像を扱う道が用意されています。公開アーカイブや無料の素材サイトから映像を集めて検索できる形にし、そこから選んで並べる工程です。README はこれを「単に画像にケン・バーンズ効果（静止画を寄り引きする手法）を掛けただけのものではない」と書いています。

### 費用が読めないまま生成を回したくないとき

提案の工程で見積もりが出て、上限や承認の線を決めておけます。README には、60秒のアニメーション1本が 1.33 ドル、といった作例ごとの金額が並んでいます（作者が提示した数字です）。


## 注意点

**ライセンスが AGPL-3.0 です。** 手元で使う・社内で使う分には問題になりませんが、**これを組み込んだサービスを外部に提供する場合、組み込んだ側のソース公開が必要になることがあります。** 事業に載せる予定があるなら、ここは先に確認してください。当サイトがこのページに付けている「自社サービス組込み注意」の警告も、同じ理由によるものです。

**動かすのは手元のコーディング AI です。** README が見積もるのは素材の生成にかかる費用で（1つの操作が既定 0.50 ドルを超えると確認が入り、総額の上限は既定 10 ドル）、**進行役を務めるエージェント側の利用料は、そこに含まれていません。** 長い工程を何度も往復する作りなので、そちらも見ておいたほうがいいです。

**準備するものが多めです。** Python 3.10 以上、FFmpeg、Node.js 18 以上、そしてコーディング用の AI アシスタント。鍵がゼロでも、画像をもとにした動画、手元で作るキャラクターアニメ、公開アーカイブの実写を編集した動画、という道が用意されています。開かないのは、有料の動画生成モデルを使う道のほうです。

**当サイトでは実際には動かしていません。** 作例の動画も費用も、README に載っている作者の提示です。品質の評価はご自身で確かめてください。
