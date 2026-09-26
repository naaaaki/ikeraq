---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  browser-use/jev-ultrafast
  https://github.com/browser-use/jev-ultrafast
  Fastest and cheapest web agent
  Python / MIT / スター 20,000台
============================================================ -->


## 見出しの一文

ブラウザ操作を「選ぶ」判断に置き換え、1手ごとの待ち時間を削る


## どういうものか

目的を1つ渡すと、Chrome を操作してやり遂げるブラウザエージェントだ。ブラウザ自動化の Browser Use が、判断用の API「Jev」を提供する TypeSafe と組んで作った。ライセンスは MIT。動かすには TypeSafe の APIキーと、文字を書かせる LLM の APIキー（例の設定では OpenRouter）の2つが要る。

画面にあるボタンや入力欄を読み取って番号つきの一覧にし、次の一手を LLM に文章で書かせるのではなく、Jev に「どの操作を、どの番号に」を**確率つきで選ばせる**。操作はクリック・文字入力・選択・上へスクロール・下へスクロール・待つ・完了・行き詰まりの8種類で、その画面で使えるものだけが候補に出る。操作を選ぶ問いと、操作ごとの対象を選ぶ問いを先回りしてまとめて送るので、判断は1回の問い合わせで決まる。小さな LLM が呼ばれるのは、入力欄に打つ文字を作るときだけだ。

速さのために、画面の撮影は既定では使わず、画面の読み取りはブラウザへの呼び出し1回で済ませ、画面外の本文は送らない。README は、Google Flights でチューリッヒ発ロンドン行きの便を検索し終えるまでを7.1秒としている（最初に画面を読んでから、読み込み待ちも含めた時間）。また、モデルの出力をそのままクリック位置やコードとして実行せず、必ず一覧にある要素に置き換えてから、隠れていないかなどを確かめて操作する。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「書かせずに、選ばせる」とある図。左に「ページ（開いている画面）」、次に「番号つきの一覧（ボタン・入力欄を読み取る）」、次に「Jev（操作と対象を1回で選ぶ）」があり、そこから「ブラウザ（クリック・選択・スクロール）」へ矢印が伸びる。文字入力のときだけ「小さなLLM（打つ文字だけ書く）」を通ってブラウザへ進む。下に「モデルの出力を、そのままクリック位置やコードとして実行しない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ju-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">書かせずに、<tspan fill="#1E5A48">選ばせる</tspan></text>

  <rect x="18" y="120" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ページ</text>
  <text x="98" y="186" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（開いている画面）</text>

  <line x1="184" y1="172" x2="208" y2="172" stroke="#1E5A48" stroke-width="4" marker-end="url(#ju-arrow)" />

  <rect x="214" y="120" width="170" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="299" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">番号つきの一覧</text>
  <text x="299" y="186" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ボタン・入力欄を</text>
  <text x="299" y="202" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">読み取る）</text>

  <line x1="390" y1="172" x2="414" y2="172" stroke="#1E5A48" stroke-width="4" marker-end="url(#ju-arrow)" />

  <rect x="420" y="120" width="170" height="104" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="505" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Jev</text>
  <text x="505" y="186" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（操作と対象を</text>
  <text x="505" y="202" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">1回で選ぶ）</text>

  <line x1="596" y1="172" x2="620" y2="172" stroke="#1E5A48" stroke-width="4" marker-end="url(#ju-arrow)" />

  <rect x="626" y="120" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="706" y="160" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ブラウザ</text>
  <text x="706" y="186" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（クリック・選択・</text>
  <text x="706" y="202" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">スクロール）</text>

  <path d="M505 230 L505 262" stroke="#1E5A48" stroke-width="4" fill="none" marker-end="url(#ju-arrow)" />
  <text x="515" y="252" font-size="11" fill="#17160F" fill-opacity="0.72">文字入力のときだけ</text>

  <rect x="420" y="268" width="170" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="505" y="302" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">小さなLLM</text>
  <text x="505" y="326" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（打つ文字だけ書く）</text>

  <path d="M596 308 L706 308 L706 236" stroke="#1E5A48" stroke-width="4" fill="none" marker-end="url(#ju-arrow)" />

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">モデルの出力を、そのままクリック位置やコードとして実行しない</text>
</svg>

キャプション: 次の一手を文章で書かせず、画面にある候補から確率つきで選ばせる。判断の問い合わせは1手1回で、文字を打つときだけ別に小さな LLM を呼ぶ。


## どんなときに使うか

### ブラウザ操作の自動化で、1手ごとの待ち時間が気になっているとき

画面の撮影を送らず、判断も1手1回の問い合わせで済ませる作りになっている。手元で動かす画面では、要素の番号・各操作の確率・実行した操作が見え、1手ずつ止めて確かめることもできる。

### ブラウザエージェントの中身を、読んで理解したいとき

処理の本体は数個のファイルに分かれていて、README に役割の対応表がある。画面の読み取り、判断、実行がどこで行われるかを追いやすい。


## 注意点

**試作の段階で、扱えない要素がある。** README は、Shadow DOM・フレーム・canvas・ファイルのアップロード・ポップアップで開くタブ・入れ子のスクロールなどを「この MVP の範囲外」としている。

**速さの数字は、少ない試行の結果。** README は計測について、1つのブラウザ環境で1つの作業を3回くり返しただけで、一般的な信頼性の評価ではないと断っている。

**「完了」の判断をうのみにしない。** エージェントが完了を選んでも、結果は別に確かめる必要があると README に書かれている。

**いつもの Chrome のプロフィールをそのまま使う。** エージェントが開くタブは、既存の Chrome のプロフィールを共有すると README にある。ログイン状態も共有されるとみられるので、動かすプロフィールは選んだほうがよい。

**実際に動かすと有料の API を呼ぶ。** README によれば、テストは API を呼ばずに動くが、実際の操作例は有料の API 呼び出しになる。

**公開から日が浅い。** リポジトリが作られたのは2026年9月16日。
