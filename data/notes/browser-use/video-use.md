---
updated: 2026-09-05
image:
image_alt:
---

<!-- ============================================================
  browser-use/video-use
  https://github.com/browser-use/video-use
  Edit videos with coding agents
  Python / MIT / スター 23,529
============================================================ -->


## 見出しの一文

映像を見ずに、文字起こしの上で動画編集を組み立てさせる


## どういうものか

撮ったままの動画を入れたフォルダで、Claude Code のようなコーディングエージェントに「これを紹介動画にして」と話しかけると、完成した mp4 が返ってくる。言い淀み（「えーと」「あの」）や撮り直しのあいだの無音を落とす、区間ごとに色を整える、切れ目に30ミリ秒のフェードを入れる、字幕を焼き込む——といった作業が、プリセットやメニューを触らずに進む。特定のジャンル向けの決め打ちは持っておらず、対談でも旅行でもチュートリアルでも同じ道具で扱う設計になっている。

面白いのは、**映像そのものをほとんど見ないで判断している**ところ。まず ElevenLabs Scribe で単語単位の文字起こしを作り、話者と物音の情報も含めて、全テイクをおよそ12KBのテキストにまとめる。LLM が読むのは基本これだけ。そのうえで、判断に迷う箇所でだけ、コマ送りの帯と波形と単語ラベルを1枚のPNGに合成して見せる。作者はこの設計の理由をはっきり数字で書いていて、素直に全フレームを渡すと「30,000フレーム × 1,500トークン = 4,500万トークンのノイズ」になるところを、「12KBのテキストと数枚のPNG」で済ませている、としている。

処理は「文字起こし → まとめる → LLM が考える → 編集指示（EDL）を出す → 書き出す → 自分で採点する」という一本の流れで進む。最後の採点で問題が見つかると前に戻ってやり直すが、**その往復は最大3回まで**と決まっている。書き出しは ffmpeg が担い、オンライン素材を取り込むなら yt-dlp も使う。文字起こしに ElevenLabs のAPIキーが要る。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="動画編集の処理の流れを示した図。左から順に「素材動画（撮ったままのファイル）」「文字起こし（約12KBのテキスト）」「LLMが判断（どこを切るか決める）」「完成MP4（ffmpegが書き出す）」の4つの箱が緑の矢印でつながっている。完成MP4からLLMが判断へ戻る矢印があり、自己採点による最大3回のやり直しを表している。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="vu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="62" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">映像ではなく<tspan fill="#1E5A48">文字起こし</tspan>の上で、編集を決める</text>

  <rect x="31" y="150" width="150" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="106" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">素材動画</text>
  <text x="106" y="218" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（撮ったまま）</text>

  <line x1="181" y1="200" x2="227" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#vu-arrow)" />

  <rect x="227" y="150" width="150" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="302" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">文字起こし</text>
  <text x="302" y="218" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（約12KBのテキスト）</text>

  <line x1="377" y1="200" x2="423" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#vu-arrow)" />

  <rect x="423" y="150" width="150" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="498" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">LLM が判断</text>
  <text x="498" y="218" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（どこを切るか）</text>

  <line x1="573" y1="200" x2="619" y2="200" stroke="#1E5A48" stroke-width="4" marker-end="url(#vu-arrow)" />

  <rect x="619" y="150" width="150" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="694" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">完成 MP4</text>
  <text x="694" y="218" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（ffmpeg が書き出す）</text>

  <path d="M694,250 L694,318 L498,318 L498,250" fill="none" stroke="#1E5A48" stroke-width="4" stroke-dasharray="9 7" marker-end="url(#vu-arrow)" />
  <text x="596" y="344" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.7">自分で採点して、直しが要れば戻る（最大3回）</text>

  <text x="400" y="404" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">迷った箇所だけ、コマ送りと波形を1枚のPNGにして見せる。全フレームは渡さない</text>
</svg>

キャプション: 動画を「見て」編集しているのではなく、**話した言葉の列を編集している**。この向きを取ったことで、長い素材でも扱う情報量が一定に保たれている。


## どんなときに使うか

### 撮った素材は多いのに、切り出す作業で止まっているとき

言い淀みと間を落とすだけの単純作業が、長い素材ほど重くなる。ここが自動で片づくと、残るのは「どの話を残すか」という判断だけになる。文字起こしを土台にしているので、**残す・削るを文章として指示できる**のが編集ソフトとの一番の違いになる。

### 決まった形の動画を、繰り返し作りたいとき

ジャンル別のプリセットを持たない代わりに、指示は毎回自然文で書く。同じ言い回しを使い回せば同じ調子の動画が出るので、社内向けの説明動画のように**形が決まっていて本数が多いもの**と相性がよさそうに見える。


## 注意点

**外部サービスへの依存がある。** 文字起こしは ElevenLabs のAPIに投げるため、キーの登録と、素材の音声を外に出すことの了解が要る。取材音声や社外に出せない打ち合わせの録画を通す場合は、ここが先に問題になる。

**「触らずに済む」の意味を取り違えないほうがいい。** メニューを触らないという話であって、判断が要らないわけではない。作者自身が「確認してから実行し、評価して残す」という進め方を設計の柱に挙げていて、**人が途中で見る前提**の作りになっている。放り込んで出てきたものをそのまま出す道具ではない。

**まだ新しい。** 2026年4月に公開されたばかりで、リリースのタグはまだ切られていない。参加している人も8名ほどで、未解決の issue は81件ある。ライセンスは MIT なので使うぶんの制約は緩いが、**仕様が動く前提で触るものだと思っておくほうがよい。**
