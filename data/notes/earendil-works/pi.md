---
updated: 2026-09-16
image:
image_alt:
---

<!-- ============================================================
  earendil-works/pi
  https://github.com/earendil-works/pi
  AI agent toolkit: unified LLM API, agent loop, TUI, coding agent CLI
  TypeScript / MIT / スター 105,671
============================================================ -->


## 見出しの一文

エージェントの部品を層ごとに切り出して配り、その上にコーディング用の CLI を載せる


## どういうものか

AI エージェントを作るための部品を、**層ごとに分けて配っている**リポジトリ。README は全体を「Pi agent harness」と呼び、その上に載る形で、自分で自分を拡張できるコーディングエージェントも同じ置き場所に入っていると説明している。ひとつの完成品を配るというより、**どの層から使い始めてもいい**並べ方になっているのが特徴だ。

配られている部品は6つ。対話しながら使う `pi-coding-agent`（ターミナルのコーディングエージェント）が、道具の呼び出しとやりとりの状態を持つ `pi-agent-core` を呼び、その `pi-agent-core` が、OpenAI・Anthropic・Google などのモデルを**同じ呼び方に揃える** `pi-ai` を呼ぶ。この上下は README が書いているものではなく、各パッケージの依存関係から辿れるものだ。残る3つは、それ自体はほかの部品に頼らずに動く。画面の差分だけ描き替えるターミナル用の表示部品 `pi-tui`、提供元を問わない記録の取り決めを定めた `pi-telemetry`、サービスの組み立て・複製された状態・RPC・プラグインを扱う `chord`。Slack やチャットからの自動化は別のリポジトリに分けられている。

もうひとつ目につくのが、**取り込む部品（npm の依存）の扱いを、コードの変更と同じ厳しさで見る**という方針だ。README は箇条書きでその中身を並べている。外部の依存はバージョンを1つに固定する、当日に公開されたばかりの版は拾わないよう待ち時間を設けている、ロックファイルを正とし、うっかりのコミットは事前に止める、配布する CLI には依存の固定表を同梱する、CI では導入時のスクリプトを走らせない、定期的に監査をかける、といった項目が続く。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「まとめて1つではなく、層ごとに配る」とある図。下から順に、pi-ai（各社のモデルを同じ呼び方に）、pi-agent-core（道具の呼び出しと状態）、pi-coding-agent（対話して使う CLI）と積み上がる。右に「他に依存しない部品」として pi-tui（画面の描き替え）、pi-telemetry（記録の取り決め）、chord（サービスの組み立て）がある。下に「まるごと使ってもいいし、下の層だけ取り出してもいい」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="50" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">まとめて1つではなく、<tspan fill="#1E5A48">層ごとに</tspan>配る</text>
  <rect x="40" y="106" width="420" height="72" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="250" y="138" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">pi-coding-agent</text>
  <text x="250" y="162" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（対話して使う CLI）</text>
  <rect x="40" y="188" width="420" height="72" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="250" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">pi-agent-core</text>
  <text x="250" y="244" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（道具の呼び出しと状態）</text>
  <rect x="40" y="270" width="420" height="72" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="250" y="302" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">pi-ai</text>
  <text x="250" y="326" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（各社のモデルを同じ呼び方に）</text>
  <rect x="500" y="106" width="260" height="236" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="630" y="140" text-anchor="middle" font-size="14" font-weight="700" fill="#1E5A48">他に依存しない部品</text>
  <text x="630" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="#17160F">pi-tui</text>
  <text x="630" y="202" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（画面の描き替え）</text>
  <text x="630" y="238" text-anchor="middle" font-size="13" font-weight="700" fill="#17160F">pi-telemetry</text>
  <text x="630" y="260" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（記録の取り決め）</text>
  <text x="630" y="296" text-anchor="middle" font-size="13" font-weight="700" fill="#17160F">chord</text>
  <text x="630" y="318" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（サービスの組み立て）</text>
  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">まるごと使ってもいいし、下の層だけ取り出してもいい</text>
</svg>

キャプション: 入口は CLI だが、**中の層が単体で配られている**ことのほうが、この置き場所の性格をよく表している。


## どんなときに使うか

### 複数社のモデルを1つの呼び方に揃えたいとき

`pi-ai` はその層だけで配られていて、OpenAI・Anthropic・Google などをまとめて扱う。エージェント全体を借りずに、この部分だけ取り出せる。


### 自分のエージェントに、ターミナルの画面を付けたいとき

`pi-tui` は差分だけを描き替える表示部品として独立している。コーディングエージェントを使わなくても、この層だけ使える並べ方になっている。


## 注意点

**★ 権限の制限は入っていない。** README が明記している。ファイル・プロセス・ネットワーク・資格情報への出入りを縛る仕組みは**含まれておらず**、初期状態では**起動した利用者とプロセスと同じ権限で動く**。境界が要るなら自分で囲う前提で、README は3通りの隔離のしかた（Linux の小さな仮想機械へ回す拡張、Docker の中でまるごと動かす、方針で制御する砂場の中で動かす）を案内している。

**初めての人が出した issue とプルリクエストは、いったん自動で閉じられる。** README の冒頭に断りがあり、初めて関わる人からのものは既定で自動的に閉じられる、自動で閉じられた issue は管理者が毎日見ている、と書かれている。無視されたわけではないが、**そういう運び方だと知らないと驚く**ところだ。

**ライセンスは MIT。**
