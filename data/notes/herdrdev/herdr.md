---
updated: 2026-09-09
image:
image_alt:
---

<!-- ============================================================
  herdrdev/herdr
  https://github.com/herdrdev/herdr
  the runtime your coding agents live on
  Rust / Apache-2.0 / スター 36,704
============================================================ -->


## 見出しの一文

端末を閉じてもエージェントを止めず、どれが手を止めているかが一目で分かる


## どういうものか

コーディングエージェントを何本も同時に走らせると、二つのことで困る。端末の窓を閉じたりSSHが切れたりすると作業が死ぬこと、そして今どれが人の返事を待って止まっているのか分からなくなることだ。herdr はこの二つを引き受ける、エージェント専用の端末の土台。作りは**サーバーと画面の分離**で、端末のプロセスを実際に抱えているのは裏で動き続けるサーバーのほうであり、手元に見えている窓はそこに繋いでいるだけの表示係にすぎない。だから窓を閉じても、繋ぎ直せば続きが出てくる。ノートPCの蓋を閉じる、家のマシンに ssh で入り直す、といった使い方が前提に置かれている。

置き場所は3段になっている。案件ごとの**ワークスペース**、その中の用途別の**タブ**（エージェント用・ログ用など）、そして実際の端末である**ペイン**。ここに herdr の中心的な仕掛けが乗る。ペインごとに状態が付き、**working（動いている）／blocked（返事を待って止まっている）／done（終わったがまだ見ていない）／idle（終わって確認済み）／unknown（判別できない）** に分けて表示される。ワークスペースの一覧にはその集計が出るので、10本走らせていても「返事を待っているのはこれ」がすぐ分かる。見たかどうかは繋いでいる窓ごとに別々に記録されるので、複数の端末から覗いても表示が混ざらない。

もう一つの特徴は、**エージェント自身が herdr を操作する側に回れる**こと。コマンドラインとソケット経由のAPIが用意されていて、エージェントが新しいペインを立てる、ほかのエージェントに指示を出す、相手が本当に止まるまで待つ、といったことができる。herdr は Claude Code・Codex・Cursor・OpenCode・Grok などを包み込んだり置き換えたりはせず、**それらの端末を預かるだけ**という立ち位置。Rust の単体バイナリで、Electron のような重い土台は使わず、いま使っている端末の中で動く。tmux 風のプレフィックスキーと、クリックやドラッグでの分割の両方が使える。


## 図

<svg viewBox="0 0 800 420" role="img" aria-label="herdr の仕組みの図。左に手元の端末（表示するだけ）があり、閉じても切れてもよいと書かれている。中央に裏で動き続けるサーバーがあり、ワークスペース・タブ・ペインの3段と、working・blocked・idle の状態表示を抱えている。右にコーディングエージェント本体が並び、動き続けると書かれている。矢印は端末からサーバー、サーバーからエージェントへ向かい、下に「止まっているのはどれか、が常に見えている」と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="hd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="420" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">端末は<tspan fill="#1E5A48">見るだけ</tspan>、抱えているのは裏のサーバー</text>

  <rect x="20" y="120" width="180" height="190" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="110" y="158" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">手元の端末</text>
  <text x="110" y="182" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（表示するだけ）</text>
  <text x="110" y="222" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">閉じてよい</text>
  <text x="110" y="246" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">SSHが切れてよい</text>
  <text x="110" y="278" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">別の端末から繋ぎ直す</text>

  <line x1="200" y1="215" x2="248" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#hd-arrow)" />

  <rect x="256" y="120" width="270" height="190" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="391" y="152" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">裏で動き続けるサーバー</text>
  <text x="391" y="182" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">ワークスペース → タブ → ペイン</text>
  <rect x="278" y="200" width="72" height="30" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="314" y="220" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">working</text>
  <rect x="356" y="200" width="72" height="30" rx="4" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="392" y="220" text-anchor="middle" font-size="12" font-weight="700" fill="#1E5A48">blocked</text>
  <rect x="434" y="200" width="72" height="30" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="470" y="220" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">idle</text>
  <text x="391" y="258" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.72">ペインごとに状態を持つ</text>
  <text x="391" y="284" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.72">エージェント側からも操作できる</text>

  <line x1="526" y1="215" x2="574" y2="215" stroke="#1E5A48" stroke-width="4" marker-end="url(#hd-arrow)" />

  <rect x="582" y="120" width="198" height="190" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="681" y="158" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">エージェント本体</text>
  <text x="681" y="182" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（そのまま動かす）</text>
  <text x="681" y="220" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">Claude Code / Codex</text>
  <text x="681" y="244" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">Cursor / OpenCode ほか</text>
  <text x="681" y="278" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">走り続ける</text>

  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">置き換えではなく「端末を預かる」設計なので、いま使っているエージェントをそのまま乗せられる</text>
</svg>

キャプション: 守っているのは**作業の続き**ではなく、作業を抱えている場所そのもの。手元の窓は使い捨てにしてよい、という考え方になっている。


## どんなときに使うか

### エージェントを何本も並べて、返事待ちを取りこぼしたくないとき

3本4本と同時に走らせると、「終わっているのに気づかず放置していた」「聞かれていたのに見ていなかった」が起きる。状態がペインごとに出て、案件の一覧にも集計されるので、**巡回して確認する手間がなくなる**。

### 会社と自宅、ノートとデスクトップを行き来しながら進めたいとき

サーバーが裏で持っている前提なので、蓋を閉じて移動し、別の端末から繋ぎ直せる。SSHで登録したマシンも同じ一覧に並ぶので、**どのマシンで走らせたかを覚えていなくてよい**。


## 注意点

**「落ちても平気」ではない。** README に明記されているが、マシンやサーバーを再起動した場合、herdr が戻すのは**保存しておいた配置**であり、対応しているエージェントのセッションは再開できるものの、**元のプロセスそのものは生き残らない**。守られるのは「窓を閉じた・回線が切れた」までで、電源が落ちる話とは別と考えたほうがいい。

**tmux の代わりに全部やる、という道具ではない。** 狙いがコーディングエージェントの管理に寄っているので、ふつうの端末多重化としての機能や作法を求めると、覚え直しのぶんが割に合わない可能性がある。エージェントを1本しか走らせないなら、得られるものは薄い。

**確信をもって判別できない場合がある。** 状態には unknown（判別できない）という区分がそもそも用意されている。対応しているエージェントかどうかで見え方が変わる点は、導入前に確かめておきたい。

ライセンスは Apache-2.0。
