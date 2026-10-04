---
updated: 2026-10-05
image:
image_alt:
---

<!-- ============================================================
  odysseus-dev/odysseus
  https://github.com/odysseus-dev/odysseus
  Self-hosted AI workspace. 
  Python / AGPL-3.0 / スター 89,129
  

============================================================ -->


## 見出しの一文

チャットもメールも予定も、自分のサーバーで動く AI の画面にまとめる


## どういうものか

自分のパソコンやサーバーで動かす、AI を中心にした作業場だ。ブラウザで開く1つの画面に、AI とのチャットとエージェント、複数の手順でウェブを調べて報告書にまとめる調べもの機能、文書の編集、メール、メモ・タスク・カレンダーが入っている。Docker で起動すると、本体と一緒に ChromaDB（ベクトルデータベース）、SearXNG（検索エンジン）、ntfy（通知）も立ち上がる。

使う AI モデルは、API で呼ぶものと手元で動かすもののどちらでもよい。「Cookbook」という機能は、手元のハードウェアに合わせてモデルを勧め、ダウンロードと起動までを受け持つ。すでに Ollama や vLLM など OpenAI 互換の窓口を動かしていれば、そこにつなぐこともできる。複数のモデルの答えを、名前を伏せたまま並べて比べる機能もある。

エージェントには、シェル、ファイル、MCP、スキル、記憶といった道具を持たせられる。メールは IMAP/SMTP でつなぎ、仕分けや要約、返信の下書きを AI が手伝う。カレンダーは CalDAV で同期でき、エージェントに決まった時間の仕事を任せることもできる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI の作業を、自分のサーバーの1画面にまとめる」とある図。左から「あなた（ブラウザで開く）」「Odysseus（チャット・文書・メール・予定）」「AI モデル（API か、手元で動かすもの）」が矢印でつながる。下に「保存するデータは自分のサーバーに置き、モデルは API か手元かを選ぶ」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="od-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">AI の作業を、<tspan fill="#1E5A48">自分のサーバー</tspan>の1画面にまとめる</text>

  <rect x="40" y="170" width="180" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="130" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">あなた</text>
  <text x="130" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ブラウザで開く）</text>

  <line x1="226" y1="225" x2="274" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#od-arrow)" />

  <rect x="280" y="170" width="240" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Odysseus</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（チャット・文書・メール・予定）</text>

  <line x1="526" y1="225" x2="574" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#od-arrow)" />

  <rect x="580" y="170" width="180" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI モデル</text>
  <text x="670" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（API か、手元で動かすもの）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">保存するデータは自分のサーバーに置き、モデルは API か手元かを選ぶ</text>
</svg>

キャプション: ためたデータの置き場所は自分のサーバーにし、裏で答えるモデルだけを選んで差し替える。


## どんなときに使うか

### ChatGPT のような使い心地を、自分が管理する機械の上で持ちたいとき

チャットだけでなく、調べもの、文書、メール、予定までを1か所で扱える。メールや予定は、いま使っているアカウントをつないで同じ画面に出す。

### 手元の GPU でモデルを動かしたいが、入れ方を毎回調べたくないとき

Cookbook が手元の機械に合うモデルを勧め、ダウンロードと起動までを画面から進められる。Docker で使う場合は、GPU をコンテナに渡す設定を先に済ませておく必要がある。


## 注意点

**ライセンスは AGPL-3.0-or-later。** 改変したものをネットワーク越しに他人に使わせる場合は、その利用者にソースコードを提供する義務が生じる。社内のサービスに組み込むなら、先に確かめたい。

**シェルやファイル操作を持つ管理画面として扱う。** セットアップガイドは、ネットワークから届く場所に置くなら認証を有効のままにし、HTTPS と信頼できるリバースプロキシなどを挟まずにインターネットへ直接さらさないよう求めている。

**既定のブランチは `dev`。** 新しい変更が先に入るブランチで、落ち着いた版がほしい場合は `main` を使うよう README が案内している。

**Apple Silicon の Mac では、Docker からは GPU を使えない。** その場合 Cookbook のモデルは CPU で動く。GPU を使うには、Docker を使わない入れ方にする。
