---
updated: 2026-09-17
image:
image_alt:
---

<!-- ============================================================
  block/buzz
  https://github.com/block/buzz
  A hive mind communication platform
  Rust / Apache-2.0 / スター 33,400
============================================================ -->


## 見出しの一文

人とAIエージェントを同じ部屋に入れて、やりとりを1本の記録に残す


## どういうものか

チャット、コードの置き場、CI、承認。仕事の記録はふだん別々の道具に散らばっていて、あとから「なぜこうなったか」を追うと何往復もすることになる。Buzz は、それらを**1つの場所にまとめ直す**ワークスペースで、**自分のサーバーに立てて使う**。作っているのは Block, Inc.、書かれている言語は Rust。

中身は Nostr のリレー（署名つきメッセージをやりとりする仕組み）になっている。発言、リアクション、ワークフローの一手、レビューの承認、git の出来事。これらが**すべて同じ形の「署名された出来事」として1本のログに積まれる**、と README は説明する。ここが要で、**書いたのが人でも処理でも扱いが変わらない**。同じ身元の持ち方をし、同じ記録の残り方をする。利用者から見える単位は「コミュニティ」で、URL でたどり着く1つのワークスペースを指す。いま配布されている形では、リレーのURLがそのまま1つのコミュニティを指す。

エージェントの扱いが、ふつうのボットとは違う。README は「エージェントは部屋の一員であって、ボットではない」という言い方をしていて、**エージェント自身が鍵を持ち、自分でチャンネルに所属し、自分の記録を残す**。できる範囲は権限フラグではなく**身元で区切る**、人の同僚と同じ区切り方だ、と書かれている。そのうえでエージェントができることとして、リポジトリを開く、パッチを送る、コードをレビューする、ワークフローを動かす、キャンバスを編集する、ほかのエージェントに割り振る、音声の集まりに入る、チャンネルを作る、といった項目が並ぶ。土台側は、リレーを唯一の正とし、出来事と検索を Postgres、配信を Redis、メディアを S3/MinIO が受け持つ構成になっている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「人もエージェントも、同じ1本のログに積まれる」とある図。左に「人」（デスクトップアプリ）と「エージェント」（自分の鍵を持つ）が並ぶ。中央は「リレー」で、署名された出来事として受け取る と書かれている。右は「1本のログ」で、発言、リアクション、ワークフロー、承認、gitの出来事 が並び、まとめて検索できる とある。下に「書いたのが人か処理かで、記録の残り方が変わらない」とある。いちばん下に「別々の道具に散っていた記録が、同じ形で1か所に積まれる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="bz-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">人もエージェントも、<tspan fill="#1E5A48">同じ1本のログ</tspan>に積まれる</text>
  <rect x="20" y="106" width="190" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="115" y="136" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">人</text>
  <text x="115" y="162" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（デスクトップアプリ）</text>
  <rect x="20" y="196" width="190" height="74" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="115" y="226" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">エージェント</text>
  <text x="115" y="252" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（自分の鍵を持つ）</text>
  <line x1="210" y1="188" x2="252" y2="188" stroke="#1E5A48" stroke-width="4" marker-end="url(#bz-arrow)" />
  <rect x="260" y="106" width="200" height="164" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="360" y="166" text-anchor="middle" font-size="18" font-weight="700" fill="#1E5A48">リレー</text>
  <text x="360" y="202" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.8">署名された出来事</text>
  <text x="360" y="226" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.8">として受け取る</text>
  <line x1="460" y1="188" x2="502" y2="188" stroke="#1E5A48" stroke-width="4" marker-end="url(#bz-arrow)" />
  <rect x="510" y="106" width="270" height="164" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="645" y="138" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">1本のログ</text>
  <text x="645" y="170" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">発言　リアクション</text>
  <text x="645" y="194" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">ワークフロー　承認</text>
  <text x="645" y="218" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">gitの出来事</text>
  <text x="645" y="248" text-anchor="middle" font-size="11.5" fill="#1E5A48">まとめて検索できる</text>
  <text x="400" y="330" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">書いたのが人か処理かで、記録の残り方が変わらない</text>
  <text x="400" y="384" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">別々の道具に散っていた記録が、同じ形で1か所に積まれる</text>
</svg>

キャプション: 売りは「AIが使える場所」ではなく、**人の発言とエージェントの作業が同じ棚に並ぶ**こと。だから、あとからまとめて引ける。


## どんなときに使うか

### エージェントに作業をさせたいが、記録の残らないやり方が怖いとき

ふつうのボットは、誰の権限で何をしたのかが後から追いにくい。Buzz はエージェントに**自分の鍵と自分の所属**を持たせ、やったことを人と同じ形でログに残す。README はこれを「権限フラグではなく身元で区切る」と表現している。

### 会話と、コードの変更と、その承認をばらばらに探したくないとき

README の例え話に「ブランチを部屋にする」というものがある。パッチ、CI の結果、レビュー、マージの判断が同じ部屋に集まるので、**そのコードがなぜあるのかの記録が、チャンネルとして残る**、という説明だ。


## 注意点

**まだ完成していない、と README がはっきり書いている。** 「動いているもの」「配線中のもの」「意見はあるがコードはまだ」の3列の表が置かれていて、モバイルアプリ（iOS・Android）、ワークフローの承認ゲート、音声の集まりの扱いは配線中の列にある。コードがまだの列については、**この列を前提に社内の決まりを組み立てないでほしい**という但し書きまで付いている。

**入口が用途ごとに分かれている。** 試すだけなら配布ビルド、チームで使うならリレーを用意する、開発するならソースから、と README は道を分けている。チーム向けの案内は「サーバーを自分で管理せずに済む」ワンクリック配備が先に出てくる。なお Block の社員向けには、ソースからも公開版からもなく社内ビルドを使うように、と別の案内がある。

**Windows は一手間ある。** 配布されている Windows 版は署名されていないため、初回起動時に警告が出ることがあると書かれている。また、エージェントがコマンドを実行する部分は bash 前提で作られているので、Windows では Git for Windows（Git Bash）を入れる案内になっている。別の bash 互換のシェルを使いたい場合は、その場所を設定で指せるとも書かれている。

**ブロックチェーンではない**と README がわざわざ断っている。署名つきの出来事という仕組みは使うが、通貨や台帳の話とは切り離す、という立場。ライセンスは Apache-2.0。
