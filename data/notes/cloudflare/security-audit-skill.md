---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  cloudflare/security-audit-skill
  https://github.com/cloudflare/security-audit-skill
  A coding-agent skill for multi-phase security audits with independently verified, machine-readable findings
  JavaScript / MIT / スター 18,000台
============================================================ -->


## 見出しの一文

見つけた本人には検証させない形で、AIにコードの脆弱性を探させる


## どういうものか

コーディング支援AI（エージェント）に読み込ませる**スキル**で、README はこれを「エージェントをセキュリティ監査担当に変えるもの」と説明している。中身のほとんどは**手順書**で、`SKILL.md` に全体の進め方と原則、そのほかのファイルに攻撃の種類ごとの調べ方が書かれている。メモリ安全性、プロンプトインジェクション、HTTP まわり、供給網、クラウド設定、テナント分離など、対象の性格に応じて読むファイルが分かれている。言語は JavaScript、ライセンスは MIT。

進め方は6段階に決まっている。まず全体の見取り図（構造・信頼の境界・入力の入り口）を作り、`coverage-ledger.json` にどこを見たかの台帳を作る。次にその台帳の単位ごとに**別々のエージェント**を割り当てて探させる。見つかった候補は、**見つけたのとは別の新しいエージェント**に渡され、その担当は「それは成り立たない」と崩しにかかる。結果は `confirmed`（裏付けがそろったもの）、`needs_validation`（確かめきれない事実がはっきり残っているもの）、`rejected`（崩されたもの）の3つに分けて `findings.json` に書かれ、同梱のスクリプトが形式を検査する。検査スクリプトは Node.js で動き、外部の依存が無い。

もとは Cloudflare が社内で使っている脆弱性発見の仕組みの**出発点**にあたるもので、そちらは多段・全社規模に育ったが、これはリポジトリ1つぶんの版だと README は書いている。同じリポジトリに対して繰り返し走らせることが前提で、前回の台帳と結果を読んで、見ていないところを狙う作りになっている。README は自社の試験運用について「1回の実行で見つかるのは、繰り返し実行して見つかった総数のおよそ半分だった」と書いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「探す係と、確かめる係を分ける」とある図。左から順に、見取り図を作る（どこに何があるか台帳にする）、分担して探す（台帳の単位ごとに別のエージェント）、崩しにかかる（見つけた本人ではない担当）、3つに仕分ける（confirmed / needs_validation / rejected）が矢印でつながっている。下に「同じリポジトリに何度も走らせる。前回の台帳を読んで、見ていないところを狙う」とある。いちばん下に「崩せなかった疑いは、確定にも却下にもせず残す」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">探す係と、<tspan fill="#1E5A48">確かめる係</tspan>を分ける</text>

  <rect x="18" y="130" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="98" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">見取り図を作る</text>
  <text x="98" y="196" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（どこに何があるか</text>
  <text x="98" y="212" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">台帳にする）</text>

  <line x1="184" y1="182" x2="208" y2="182" stroke="#1E5A48" stroke-width="4" marker-end="url(#sa-arrow)" />

  <rect x="214" y="130" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="294" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">分担して探す</text>
  <text x="294" y="196" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（台帳の単位ごとに</text>
  <text x="294" y="212" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">別のエージェント）</text>

  <line x1="380" y1="182" x2="404" y2="182" stroke="#1E5A48" stroke-width="4" marker-end="url(#sa-arrow)" />

  <rect x="410" y="130" width="160" height="104" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="490" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">崩しにかかる</text>
  <text x="490" y="196" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（見つけた本人では</text>
  <text x="490" y="212" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">ない担当）</text>

  <line x1="576" y1="182" x2="600" y2="182" stroke="#1E5A48" stroke-width="4" marker-end="url(#sa-arrow)" />

  <rect x="606" y="130" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="686" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">3つに仕分ける</text>
  <text x="686" y="196" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（confirmed /</text>
  <text x="686" y="212" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">needs_validation / rejected）</text>

  <text x="400" y="300" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">同じリポジトリに何度も走らせる。前回の台帳を読んで、見ていないところを狙う</text>
  <text x="400" y="372" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">崩せなかった疑いは、確定にも却下にもせず残す</text>
</svg>

キャプション: 効いてくるのは**仕分けの粒度**。「たぶん危ない」をそのまま危険として出さず、確かめきれない事実が何かを書いて別枠に置く。


## どんなときに使うか

### AIの「脆弱性を見つけました」を、そのまま信じたくないとき

エージェントに調べさせると、それらしい指摘がいくらでも出てくる。このスキルは、見つけた担当とは別の担当に反証を試みさせ、崩せたものは `rejected` として記録に残す。**確定・保留・却下のどれなのかが、最初から分かれて出てくる。**

### 自分のコードのどこを見ていないかを知りたいとき

台帳（`coverage-ledger.json`）に「どの単位を、どう調べたか」が残る。調べた結果だけでなく、**調べた範囲そのものが成果物**になる。


## 注意点

**サンドボックスが無いと、確かめきれないまま残る。** README は、対象のコードを実際に動かす作業（ビルド・テスト・ブラウザ・ファジング）には OS が強制する隔離環境を要求している。外部通信を切り、環境変数を絞り、資源の上限を決め、書き込みを割り当てた場所だけに限る、という条件が並ぶ。これが無い場合、その手がかりは実行されずに `needs_validation` のまま置かれる。

**1回で終わる想定ではない。** 設計方針にも「複数回実行するほどカバー範囲が広がる」と書かれていて、根拠として社内の試験運用で1回あたりおよそ半分という数字が挙がっている。1回のなかで何体ものエージェントを動かす作りなので、外部のモデルを使う場合は費用の出方を先に見ておきたい。

**深層防御の穴は、脆弱性として報告されない。** 「A の層で攻撃が防げているなら、B の層が無いことは脆弱性ではなく改善点」という方針が明記されている。多層で固めたい立場からすると、出てくる指摘は想像より少なく見えるかもしれない。

**動かす側の条件もある。** ツール利用と並列のサブエージェントに対応したモデルが要り、検査スクリプトを動かすのに Node.js が要る。ライセンスは MIT。
