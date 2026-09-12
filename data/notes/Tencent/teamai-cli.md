---
updated: 2026-09-12
image:
image_alt:
---

<!-- ============================================================
  Tencent/teamai-cli
  https://github.com/Tencent/teamai-cli
  TypeScript / MIT / スター 4,162
============================================================ -->


## 見出しの一文

AIへの指示を各自の手元に散らさず、チームで1か所に集める


## どういうものか

teamai-cli は、チームで使う AI エージェントの**設定をまとめて配る**コマンド。スキル、守らせたいルール、参照させたい文書、環境変数などを git リポジトリ1つに集め、そこから各自の手元へ配る。配り先は Claude Code、Cursor、CodeBuddy など11種類以上で、同じ資産を別々のツールに届けられる。

配り方はシンプルだ。管理者がリポジトリを1つ用意して `teamai init` を走らせ、メンバーも自分のプロジェクトで同じコマンドを実行する。以後は**AI のセッションが始まるたびに、最新のスキルとルールが自動で取り込まれる**。手元のファイルを配り直したり、更新に気づかせたりする必要がない。追加や変更は、push してレビューを通してマージする、という普通のコードと同じ流れに乗る。役割ごとに配る対象を絞ることもできる。

ベータとして、もうひとつ別の層が付いている。**うまくいかなかった場面を拾って、チームの記録に変える**仕組みだ。AI を訂正した、ツールの実行を拒否した、といった「引っかかり」を各セッションで点数化し、値打ちのある問題は書き留めるよう促す。溜まった記録は、作業を始める前に `teamai-recall` という担当が検索して持ってくる。その際、TypeScript・Python・Go のコードを構文解析して作った依存の地図で、今いる場所に近い記録を優先する。さらに、週ごとの利用状況（成功、プロンプト、稼働時間、推定コスト、キャッシュ、訂正の傾向）をまとめたダイジェストとダッシュボードも用意されている。


## 図

<svg viewBox="0 0 800 470" role="img" aria-label="teamai-cli の仕組みの図。左に「共有リポジトリ」の箱があり、スキル・ルール・文書・環境変数が入っている。そこから右に矢印が伸び、メンバーそれぞれのエージェント（Claude Code、Cursor、その他）に届く。矢印にはセッション開始時に自動で取り込むと書かれている。右下から左へ戻る矢印があり、訂正した・実行を拒否したといった引っかかりを点数化して記録に残し、共有リポジトリへ戻すという循環が描かれている。下に、配って終わりではなく、使った結果が戻ってくる形になっていると添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="470" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">配って終わりにせず、<tspan fill="#1E5A48">引っかかりを戻す</tspan></text>

  <rect x="20" y="112" width="228" height="196" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="134" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">共有リポジトリ</text>
  <text x="134" y="174" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（git ひとつ）</text>
  <text x="134" y="212" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">スキル ／ ルール</text>
  <text x="134" y="238" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">参照させる文書</text>
  <text x="134" y="264" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">環境変数</text>
  <text x="134" y="292" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">push → レビュー → マージ</text>

  <line x1="248" y1="176" x2="300" y2="176" stroke="#1E5A48" stroke-width="4" marker-end="url(#ta-arrow)" />
  <text x="274" y="162" text-anchor="middle" font-size="11.5" fill="#1E5A48" font-weight="700">配る</text>

  <rect x="307" y="112" width="473" height="196" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="543" y="146" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">メンバーそれぞれのエージェント</text>
  <text x="543" y="168" text-anchor="middle" font-size="11.5" fill="#1E5A48" font-weight="700">セッションが始まるたび、最新を自動で取り込む</text>

  <rect x="325" y="190" width="132" height="66" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="391" y="220" text-anchor="middle" font-size="13.5" font-weight="700" fill="#17160F">Claude Code</text>
  <text x="391" y="240" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（人ごとの手元）</text>
  <rect x="477" y="190" width="132" height="66" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="543" y="220" text-anchor="middle" font-size="13.5" font-weight="700" fill="#17160F">Cursor</text>
  <text x="543" y="240" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（人ごとの手元）</text>
  <rect x="629" y="190" width="132" height="66" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" stroke-dasharray="5 4" />
  <text x="695" y="220" text-anchor="middle" font-size="13.5" font-weight="700" fill="#17160F">ほか11種類以上</text>
  <text x="695" y="240" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（同じ資産が届く）</text>

  <text x="543" y="288" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">役割ごとに、配る対象を絞れる</text>

  <path d="M 700 308 L 700 356 L 134 356 L 134 310" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#ta-arrow)" />
  <rect x="256" y="336" width="290" height="40" rx="6" fill="#FFFFFF" />
  <text x="401" y="352" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1E5A48">訂正した・実行を拒否した場面を点数化</text>
  <text x="401" y="370" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.8">→ 記録に残し、次の人の作業前に引き当てる</text>

  <text x="400" y="428" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">同じ失敗を各自が別々に踏み直す状態を、記録の側で潰しにいく</text>
</svg>

キャプション: 目新しいのは配布より**戻し方**のほう。「AIを直した回数」という、普段は流れて消えるものを材料として扱っている。


## どんなときに使うか

### 人によって AI の出力の質がばらつくのを、そろえたいとき

コツを掴んだ人の書いた指示が、その人の手元で止まりがちになる。1か所に集めて自動で配る形にすると、**新しく入った人が初日から同じ条件で始められる**。

### 使っているエージェントが人によって違うとき

Claude Code の人と Cursor の人が混ざっていても、配る資産は共通のまま扱える。ツールを統一させずに、**指示のほうを統一する**やり方になる。


## 注意点

**自動で取り込むということは、間違ったルールも同じ速さで広がる。** 各自が意識して更新しないぶん、入った内容がそのまま全員のセッションに効く。push してレビューを通す運用を崩さないことが、そのまま安全装置になる。

**利用状況の集計が入る。** 週次のダイジェストは、成功、プロンプト、稼働時間、推定コスト、訂正の傾向をまとめる。誰の何を集めて誰が見るのかは、入れる前にメンバーに説明しておいたほうがいい。導入の判断と、働き方の記録が見られることへの納得は別の話になる。

**引っかかりを拾う層はベータ。** チームの記録づくりと分析の部分はベータ表記なので、配布の部分だけ先に使う、という入り方もできる。

**構文解析が動かない環境では、引き当ての精度が落ちる。** コードの地図作りは WASM の解析器を使っていて、失敗した場合は簡易な抽出に切り替わる（動かなくなるわけではない）。

ライセンスは MIT。
