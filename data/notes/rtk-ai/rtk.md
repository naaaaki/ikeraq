---
updated: 2026-09-07
image:
image_alt:
---

<!-- ============================================================
  rtk-ai/rtk
  https://github.com/rtk-ai/rtk
  CLI proxy that reduces LLM token consumption by 60-90% on common dev commands. Single Rust binary, zero dependencies
  Rust / Apache-2.0 / スター 78,907
  topics: agentic-coding, ai-coding, anthropic, claude-code, cli, command-line-tool, cost-reduction, developer-tools, llm, open-source, productivity, rust, token-optimization
============================================================ -->


## 見出しの一文

コマンドの出力を削ってからエージェントに渡し、読ませる量を減らす


## どういうものか

AIのコーディングエージェントは、`git status` や `npm test` を自分で実行して、その出力を読んで次を決める。このとき出力は丸ごと文脈に積まれる。テストが1000件通ったログも、`ls` が返した数百行も、そのまま入る。rtk はコマンドとエージェントのあいだに入って、**出力を削ってから渡す**道具。本体は Rust の実行ファイル1つで、ランタイムの類は要らない。

削り方は、コマンドの種類ごとに4つの方針が使い分けられる。README の言葉では、雑音（コメント・空白・定型文）を落とす Smart Filtering、似たものをまとめる Grouping（ファイルはディレクトリごと、エラーは種類ごと）、関連する文脈は残したまま重複を切る Truncation、同じログ行を件数に畳む Deduplication。テストなら「失敗だけを残し、通ったものは件数に畳む」、ファイルを読むときは「本文の全部ではなく、構造と宣言部分を優先する」といった具合になる。対応するコマンドは100種類以上あり、git・GitHub CLI・テストランナー・ビルドやリント・パッケージマネージャ・AWS・コンテナまで表で並んでいる。

呼び出し方が少し変わっている。使う側がコマンドを打ち替えるのではなく、**フックがエージェントの Bash コマンドを実行前に書き換える**。README の説明では `git status` が `rtk git status` に置き換わる。初回に一度だけ設定を入れる必要はあるが、そのあとは打ち方を変えないまま、通り道だけが差し替わることになる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="コマンドの出力が rtk を通り、削られてからエージェントに渡る流れ図。rtk の中では「雑音を落とす」「似たものをまとめる」「重複を切る」「同じ行を件数に畳む」の4つが行われる。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="rtk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">エージェントに<tspan fill="#1E5A48">読ませる前に</tspan>、削る</text>
  <rect x="20" y="168" width="164" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="102" y="208" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">コマンドの出力</text>
  <text x="102" y="232" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（テスト・git・ビルド）</text>
  <line x1="184" y1="218" x2="226" y2="218" stroke="#1E5A48" stroke-width="4" marker-end="url(#rtk-arrow)" />
  <rect x="234" y="126" width="264" height="184" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="366" y="162" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">rtk が4つの方針で削る</text>
  <text x="366" y="196" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.8">1. 雑音を落とす</text>
  <text x="366" y="222" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.8">2. 似たものをまとめる</text>
  <text x="366" y="248" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.8">3. 重複を切る（文脈は残す）</text>
  <text x="366" y="274" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.8">4. 同じ行を件数に畳む</text>
  <text x="366" y="298" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（コマンドの種類ごとに使い分ける）</text>
  <line x1="498" y1="218" x2="540" y2="218" stroke="#1E5A48" stroke-width="4" marker-end="url(#rtk-arrow)" />
  <rect x="548" y="168" width="232" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="664" y="208" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">エージェントが読む</text>
  <text x="664" y="232" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（失敗と構造だけが残る）</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">打ち方は変えない。フックが実行前にコマンドを書き換えるので、通り道だけが差し替わる</text>
</svg>

キャプション: 減らしているのは「エージェントが読む量」であって、コマンドの実行結果そのものではない。削られた情報は戻ってこない、という前提で使う道具でもある。


## どんなときに使うか

### テストやビルドのログで会話が埋まるとき

失敗が1件でも、ログは数百行出る。エージェントはその全部を読み、次の質問のときも文脈として抱えたままになる。rtk は通ったテストを件数に畳むので、残るのは失敗のところだけになる。**長い作業を1つの会話で続けたい**ときほど効いてくる。

### 大きなリポジトリで、状況確認だけで文脈が埋まるとき

ファイル数の多いリポジトリでは、`git status` や `ls` を1回打つだけで数百行が返る。エージェントは作業のたびにこれを読む。ディレクトリごとにまとめてから渡せば、**同じことを確認しても、残る量が変わる**。


## 注意点

**「最大90%」は、Bash の出力に対しての数字。** README は "up to 90% of the bash output" と書いており、請求額が9割減るという意味ではない。同じ README に、削減は「各段階で薄まる（The reduction dilutes at every step）」と明記されている。加えて、rtk が表示するトークン数は**バイト数を4で割った推定値**だとも書かれている。数字は目安として読む。

**削るということは、情報が落ちるということ。** 通ったテストは件数になり、ファイルは本文より構造が優先される。ふだんは邪魔なものが減って助かるが、**落ちたところに答えがある場面では、素通ししてしまう**。全文が要ると分かっている作業では、切って使うほうがよい。

**フックの外側は書き換わらない。** README は、Claude Code の組み込みツールである `Read`・`Grep`・`Glob` は Bash のフックを通らないため自動では書き換わらない、としている。エージェントがファイルを読む経路がそちらに寄っているほど、効果は小さくなる。また一部のフィルタは ripgrep（`rg`）を呼ぶので、入っていないと警告が出る。

**ライセンスは Apache-2.0。** 手元で実行するぶんにも、製品に組み込むぶんにも扱いやすい部類になる。日本語の README も用意されている。
