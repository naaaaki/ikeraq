---
updated: 2026-09-26
image:
image_alt:
---

<!-- ============================================================
  paperclipai/paperclip
  https://github.com/paperclipai/paperclip
  The open-source app everyone uses to manage agents at work
  TypeScript / MIT / スター 84,000台
============================================================ -->


## 見出しの一文

AIエージェントを「会社」として組織し、目標と予算で動かす


## どういうものか

複数のAIエージェントをひとつのチームとして束ね、仕事を回すためのアプリだ。自分のサーバーやパソコンに立てて使う。Node.js のサーバーと React の画面でできていて、ライセンスは MIT。README の言い方では「OpenClaw が社員なら、Paperclip は会社」。**エージェントそのものは作らない。** Claude Code・Codex・Cursor・OpenClaw、コマンドや HTTP で呼べるものなど、手持ちのエージェントを連れてきて組み込む。

見た目はタスク管理だが、中身は組織図・予算・承認・目標だ。まず会社の目標を決め、エージェントを「雇って」CEO やエンジニアといった役割と、上司との関係を決める。方針と予算を承認して動かすと、エージェントは**ハートビート**と呼ばれる仕組みで、決まった時刻やタスクの割り当て・メンションをきっかけに起こされ、仕事を確認して動く。タスクには会社の目標までさかのぼれるつながりが付いていて、エージェントは何のための作業かを知ったうえで取りかかる。

暴走を止める仕組みが厚い。エージェントごとに月の予算を決められ、上限に届くと止まる。タスクの取得も予算の確認も、途中で割り込まれない処理として行われ、README は二重取りや使いすぎを防げるとしている。承認の関門、設定変更の履歴と巻き戻し、変更操作の記録もある。1つの設置で複数の会社を、データを分けたまま運用できる。手元で動かすときは Node.js のプロセス1つが、組み込みの PostgreSQL を使って動く。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「エージェントを会社として動かす」とある図。左に「目標（会社の使命から個々のタスクまで）」、次に「組織図（役割・上司・月の予算）」、次に「ハートビート（決まった時に起き、仕事を確認して動く）」、右に「人の承認（承認・一時停止・作業の確認）」が矢印でつながっている。下に「エージェントは Claude Code・Codex・Cursor などを連れてくる」とある。いちばん下に「月の予算に届いたエージェントは、そこで止まる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">エージェントを<tspan fill="#1E5A48">会社</tspan>として動かす</text>

  <rect x="18" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">目標</text>
  <text x="98" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（会社の使命から</text>
  <text x="98" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">個々のタスクまで）</text>

  <line x1="184" y1="186" x2="208" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#pc-arrow)" />

  <rect x="214" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="294" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">組織図</text>
  <text x="294" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（役割・上司・</text>
  <text x="294" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">月の予算）</text>

  <line x1="380" y1="186" x2="404" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#pc-arrow)" />

  <rect x="410" y="130" width="160" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="490" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ハートビート</text>
  <text x="490" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（決まった時に起き、</text>
  <text x="490" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">仕事を確認して動く）</text>

  <line x1="576" y1="186" x2="600" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#pc-arrow)" />

  <rect x="606" y="130" width="160" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="686" y="168" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">人の承認</text>
  <text x="686" y="194" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（承認・一時停止・</text>
  <text x="686" y="210" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">作業の確認）</text>

  <text x="400" y="308" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">エージェントは Claude Code・Codex・Cursor などを連れてくる</text>
  <text x="400" y="376" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">月の予算に届いたエージェントは、そこで止まる</text>
</svg>

キャプション: 足しているのはエージェントの賢さではなく、**誰が何のために、いくらまで**動くかという組織の枠組み。


## どんなときに使うか

### Claude Code の画面を何枚も開いて、どれが何をしているか分からなくなったとき

README が真っ先に挙げている状況だ。作業はチケットになり、やり取りはスレッドにまとまり、作業の続きは再起動しても残る。

### 定期的な仕事をエージェントに任せたいが、使う金額には上限を付けたいとき

問い合わせ対応やレポート作りのような繰り返しの仕事を、時刻や webhook をきっかけに起動できる。予算の上限に届けば止まるので、ループでお金を使い続ける心配を減らせる。


## 注意点

**エージェントが1体なら要らない。** README 自身が「エージェントが1体ならたぶん不要、20体なら必ず要る」と書いている。チームで動かす前提の道具だ。

**エージェントとモデルは自分で用意する。** README は「プロンプト・モデル・実行環境はエージェントが持ち込み、Paperclip は働く組織を管理する」と書いている。

**利用状況の送信が最初からオンになっている。** 匿名の利用データを送る設定が既定で有効だ。README は、個人情報・タスクの中身・プロンプト・ファイルの場所・秘密の値は送らず、非公開リポジトリへの参照はハッシュ化してから送るとしている。止めるには、環境変数 `PAPERCLIP_TELEMETRY_DISABLED=1` か `DO_NOT_TRACK=1` を設定するか、設定ファイルで `telemetry.enabled: false` にする。

**動かすには Node.js 24.11 以上が要る。** issue とプルリクエストは合わせて5,000件台が開いている。
