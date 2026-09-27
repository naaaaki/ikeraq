---
updated: 2026-09-27
image:
image_alt:
---

<!-- ============================================================
  sapientinc/PRAXIST
  https://github.com/sapientinc/PRAXIST
  Autonomous research system for measurable, computer-executable research.
  Python / NOASSERTION（README では Fair Source License 1.0） / スター 4,931
============================================================ -->


## 見出しの一文

すでに動く研究プロジェクトの改良を、AIの研究チームに世代単位で回させる


## どういうものか

コンピューターで実行でき、結果を数字で測れる研究を、AIに自動で進めさせる仕組みだ。前提は2つあり、すでに動いているプロジェクトと、良し悪しを分ける指標があること。そのうえで、次に何を試せば良くなるかが分かっていない場面を受け持つ。Python 3.11 以上で動き、Sapient Intelligence が公開している。

進め方は「世代」の繰り返しだ。各世代で、複数の研究エージェントが並行して改良案を作る。評価器が結果を測って証拠の形に整え、計画役がその証拠をまとめて次の世代の方針を決める。これを、結果が収束するか予算が尽きるまで続ける。README によれば、決められた範囲でパラメーターを探す AutoML と違い、エージェントは手法や構成、戦略そのものを変えられる。

結果を信用できるように、指標・評価手順・比較の基準・合格ラインは走らせる前に決めておく。すべての候補は同じ評価器で測り、無効な結果や疑わしい結果は外す。元のプロジェクトは書き換えず、実行の成果物は別の場所に残す。操作の窓口は Codex を勧めていて、Codex の中でスキル `$praxist-takeover` を呼ぶと、準備の確認を行い、確認に通れば実行の開始までを引き受ける。Claude Code からも使える。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「証拠を積んで、世代ごとに進める」とある図。左から「研究エージェント（並行して改良案を作る）」「評価器（同じ物差しで測る）」「計画役（証拠から次の方針）」が矢印でつながり、計画役から研究エージェントへ「次の世代へ」と戻る矢印がある。下に「指標と合格ラインは、走らせる前に決めておく」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="px-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">証拠を積んで、<tspan fill="#1E5A48">世代ごとに</tspan>進める</text>

  <rect x="60" y="130" width="190" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="155" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">研究エージェント</text>
  <text x="155" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（並行して</text>
  <text x="155" y="216" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">改良案を作る）</text>

  <line x1="256" y1="186" x2="298" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#px-arrow)" />

  <rect x="305" y="130" width="190" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">評価器</text>
  <text x="400" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（同じ物差しで測る）</text>

  <line x1="501" y1="186" x2="543" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#px-arrow)" />

  <rect x="550" y="130" width="190" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="645" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">計画役</text>
  <text x="645" y="200" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（証拠から次の方針）</text>

  <polyline points="645,248 645,300 155,300 155,256" fill="none" stroke="#1E5A48" stroke-width="4" marker-end="url(#px-arrow)" />
  <text x="400" y="324" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">次の世代へ</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">指標と合格ラインは、走らせる前に決めておく</text>
</svg>

キャプション: 案を出す役・測る役・方針を決める役を分け、測った証拠をもとに次の世代の方針を決める。


## どんなときに使うか

### 指標はあるのに、次に何を試せば伸びるか分からないとき

ベースラインが動いていて、数字で良し悪しが言える研究なら、複数の方向を並行して試させ、効いたものを次の世代で掘り下げさせられる。

### 手で回している試行錯誤のループを、まるごと任せたいとき

README は、研究者がすでに手で繰り返している改良の作業を、そのループごと引き受けるものだと説明している。うまくいかなかった場合も、試した方向を否定する証拠と監査レポートが残る。


## 注意点

**オープンソースではない。** ライセンスは Fair Source License 1.0 で、ソースは読めて改変もできるが、使えるのは自組織の中まで。改変版を単体の製品やサービスとして第三者に配るには、書面の同意が要る。年間売上（関連会社を含む）が100万米ドル以上の組織は、商用ライセンスの交渉も要る。大学や公的研究機関が自ら行う教育・学術研究は、この売上の条件の対象外だ。生成したものを外部に公開するときは「Praxist by Sapient Intelligence」の表記を残す必要がある。

**まだ動かないプロジェクトには使えない。** 前提が欠けていれば、Praxist は止まって何が足りないかを伝える。データセットを勝手に取ってきたり、シミュレーターを作ったりはしない、と README は書いている。

**改善は保証されない。** README 自身がそう書いている。選ばれた案が何を変えたかは、自分の環境で確かめ直すよう勧めている。

**費用は並列数と世代数で膨らむ。** Codex の契約を使うモードなら API キーは要らないが、API を使う場合の費用は並列数・世代数・評価にかかる時間で変わる。README も小さく試してから広げるよう勧めている。

**継続的に動作確認されているのは Linux だけ。** Python 3.11 と 3.12 の Linux が対象で、macOS などは互換対象の扱い。研究を始める前に `praxist doctor` で確かめるよう書かれている。
