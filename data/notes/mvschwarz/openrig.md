---
updated: 2026-10-01
image:
image_alt:
---

<!-- ============================================================
  mvschwarz/openrig
  https://github.com/mvschwarz/openrig
  Multi-agent harness that runs Claude Code and Codex together as one system
  TypeScript / Apache-2.0 / スター 2,860
============================================================ -->


## 見出しの一文

Claude Code と Codex を、YAML で組んだ1つのチームとして動かす


## どういうものか

AI のコーディングエージェントを何体も並べて使うときに、その「チーム」をまとめて管理する道具だ。README の言い方では、モデルを包むのが Claude Code や Codex のようなハーネスで、そのハーネスたちを包むのが rig（リグ）。誰がどの役を受け持ち、誰と誰がやりとりするかを YAML（RigSpec）に書いておき、`rig up` の1回で全員を起動する。各エージェントは tmux のセッションとして立ち上がるので、あとから直接入って様子を見たり、手で打ち込んだりもできる。

中身は、手元で動く常駐プログラムと、コマンド、ターミナル上の画面、MCP サーバーの組み合わせ。役ごとに「席」（seat）があり、`dev-owner@first-project` のような宛先が付く。中の会話が入れ替わっても、席の名前と与えた文脈は残る。エージェント同士は `rig send` や `rig chatroom` でやりとりする。`rig down --snapshot` で構成を保存し、名前を指定して `rig up` すれば戻せる。すでに tmux で動いている Claude Code や Codex のセッションを見つけて、管理下に取り込むこともできる。

最初の一歩として用意されているのは2人組だ。実装する担当（owner）と、確かめる確認役（checker）で、Claude 同士、Codex 同士、Claude が担当で Codex が確認役、の3通りから選ぶ。まとめ役・実装・QA・デザイン・レビュー役をそろえた大きめの構成も付いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「YAML に書いたチームを、rig up 一回で起こす」とある図。左に「RigSpec（YAML：役割とつながり）」があり、「rig up」と書かれた矢印が右の「tmux（1体ずつ別のセッション）」の枠に向かう。枠の中に「dev-owner（担当：実装する）」と「dev-check（確認役：確かめる）」があり、「確認を頼む」と書かれた矢印でつながる。下に「席の名前は残る。中の会話が入れ替わっても、同じ宛先に仕事を送れる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="or-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">YAML に書いた<tspan fill="#1E5A48">チーム</tspan>を、rig up 一回で起こす</text>

  <rect x="20" y="170" width="170" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="105" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">RigSpec</text>
  <text x="105" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（YAML：役割とつながり）</text>

  <text x="237" y="210" text-anchor="middle" font-size="13" font-weight="700" fill="#1E5A48">rig up</text>
  <line x1="196" y1="225" x2="274" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#or-arrow)" />

  <rect x="282" y="120" width="498" height="210" rx="10" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="6 5" />
  <text x="300" y="146" font-size="12" fill="#17160F" fill-opacity="0.72">tmux（1体ずつ別のセッション）</text>

  <rect x="304" y="170" width="180" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="394" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">dev-owner</text>
  <text x="394" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（担当：実装する）</text>

  <text x="530" y="210" text-anchor="middle" font-size="13" font-weight="700" fill="#1E5A48">確認を頼む</text>
  <line x1="492" y1="225" x2="570" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#or-arrow)" />

  <rect x="578" y="170" width="180" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="668" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">dev-check</text>
  <text x="668" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（確認役：確かめる）</text>

  <text x="400" y="385" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">席の名前は残る。中の会話が入れ替わっても、同じ宛先に仕事を送れる</text>
</svg>

キャプション: エージェントを1体ずつ手で立ち上げる代わりに、役割とつながりを書いた設計図からチームごと起動する。


## どんなときに使うか

### 実装とレビューを、別々のエージェントに分けたいとき

最初の2人組は、担当が変更を作り、確認役にその変更そのものを確かめさせて、結果と試し方を記録する流れになっている。書くのは Claude、確かめるのは Codex、という組み方も選べる。

### ターミナルに散らばったエージェントを、再起動のあとも同じ形で戻したいとき

構成を保存しておけば、リグの名前を指定して、最後に保存した状態から起こし直せる。戻したときは、席ごとに「続きから再開・新しく開始・失敗」のどれになったかが報告される。


## 注意点

**macOS と Linux だけ。** Node.js 22 か 24 と tmux が要る。Windows にはまだ対応しておらず、WSL2 は試されていない。Apple シリコンの Mac では Node.js 22 を使うよう書かれている。

**手元の設定ファイルを書き換える。** Claude Code や Codex の設定に、作業フォルダを信頼する設定や、実行されるフック（決まった時に動く処理）を書き込む。管理下で起動した Claude Code は、既定ではファイル編集を自動で許可するモード（acceptEdits）で動く。README は、使う前に関係するファイルのバックアップを取るよう求め、完全に元へ戻せる保証はないと書いている。

**モデルの利用料は別にかかる。** OpenRig 自体はオープンソースで自分の環境で動かすが、使う Claude Code や Codex の利用料はかかる。両方を契約する必要はない。

**変化が速い。** 2026年4月にできたリポジトリで、README 自身が、リポジトリの説明が npm で配られている版より先に進んでいる場合があると断っている。
