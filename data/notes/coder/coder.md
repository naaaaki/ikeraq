---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  coder/coder
  https://github.com/coder/coder
  Secure environments for developers and their agents
  Go / AGPL-3.0 / スター 16,000台
============================================================ -->


## 見出しの一文

開発環境を自社の設備側に置き、AIエージェントも同じ中で走らせる


## どういうものか

開発する場所そのものをサーバー側に置き、手元の機械は**つなぎに行く端末として使う**ための基盤だ。自社で立てて運用する前提で作られていて、言語は Go、ライセンスは AGPL-3.0。作業環境ひとつぶんを README は「ワークスペース」と呼ぶ。

ワークスペースの形は **Terraform で書く**。EC2 の仮想マシン、Kubernetes の Pod、Docker のコンテナなど、どの上に立てるかは書き方しだいで変えられる。立ったワークスペースへは WireGuard のトンネルを通してつながり、VS Code の拡張や JetBrains Toolbox のプラグインから開ける。使っていないワークスペースは自動で止まる仕組みが入っていて、README はこれを費用を抑えるための性質として挙げている。

もうひとつの柱が **AIエージェントの置き場所**だ。README によれば、エージェントの繰り返し処理は自社インフラ上の管理側（control plane）で動き、**ワークスペースの中に API キーを置かない**。モデルは Anthropic・OpenAI・Google・Bedrock・自前のものから選べる。README は特徴として、どの操作も利用者に紐づくことと、モデルの管理・利用料の把握・監査の記録を一箇所に集めることを挙げている。ただし、このうち監査の記録と利用料の把握は、有料の Premium に含まれる機能だ。試すだけなら付属のデータベースで起動できるが、本番向けには PostgreSQL と外部からのアクセス用 URL を指定する形になる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「作業場をサーバー側に置く」とある図。左に「テンプレート（Terraformで形を書く）」があり、矢印で中央の「ワークスペース（自社の設備の上に立つ）」につながる。ワークスペースからは下に「使わなければ自動で止まる」と伸び、右に「手元のエディタ（VS Code・JetBrains）」へ矢印がつながっている。ワークスペースの上に「AIエージェント（繰り返し処理は管理側で動く）」があり、その横に「APIキーはワークスペースに置かない」とある。いちばん下に「人の作業場も、AIの動く先も、自分たちの設備の中にそろう」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">作業場を<tspan fill="#1E5A48">サーバー側</tspan>に置く</text>

  <rect x="20" y="196" width="168" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="104" y="234" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">テンプレート</text>
  <text x="104" y="260" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Terraformで形を書く）</text>

  <line x1="194" y1="244" x2="222" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#cd-arrow)" />

  <rect x="228" y="196" width="180" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="318" y="234" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ワークスペース</text>
  <text x="318" y="260" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（自社の設備の上に立つ）</text>

  <line x1="318" y1="298" x2="318" y2="324" stroke="#1E5A48" stroke-width="4" marker-end="url(#cd-arrow)" />
  <text x="318" y="346" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">使わなければ自動で止まる</text>

  <line x1="414" y1="244" x2="442" y2="244" stroke="#1E5A48" stroke-width="4" marker-end="url(#cd-arrow)" />

  <rect x="448" y="196" width="180" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="538" y="234" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">手元のエディタ</text>
  <text x="538" y="260" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（VS Code・JetBrains）</text>

  <rect x="228" y="96" width="180" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="318" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">AIエージェント</text>
  <text x="318" y="152" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（繰り返し処理は管理側で動く）</text>
  <line x1="318" y1="178" x2="318" y2="190" stroke="#1E5A48" stroke-width="4" marker-end="url(#cd-arrow)" />
  <text x="430" y="140" font-size="12" fill="#17160F" fill-opacity="0.72">APIキーはワークスペースに置かない</text>

  <text x="400" y="404" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">人の作業場も、AIの動く先も、自分たちの設備の中にそろう</text>
</svg>

キャプション: 人とエージェントを**同じ枠組みに入れている**のがこの設計の特徴。環境を配る仕組みが、そのまま鍵を預かる仕組みにもなる。


## どんなときに使うか

### 新しく入った人の環境構築に、毎回何日もかかっているとき

環境の形が Terraform のテンプレートとして書かれているので、同じものを人数ぶん立てられる。README は導入にかかる時間について「何日もではなく何秒で」という言い方をしている。

### AIエージェントに作業させたいが、鍵を配りたくないとき

エージェントの処理は管理側で動き、ワークスペースの中にモデルの鍵を置かない設計になっている。**鍵を人数ぶん配って回収できなくなる状態を避けたい**場合に、検討の対象になる。


## 注意点

**ライセンスが AGPL-3.0。ただし全部ではない。** 手元で使うぶんには問題にならないが、改造したものをネットワーク越しにサービスとして提供する場合、ソースの開示が求められる形のライセンスだ。さらに `enterprise` フォルダの中身だけは別のライセンス（`LICENSE.enterprise`）になっていて、ライセンスキーの仕組みを迂回したり無効にしたりすることを禁じている。自社製品に組み込むことを考えているなら、両方を先に確認しておきたい。

**本番運用には用意するものがある。** README は、本番の構成として PostgreSQL（13 以上）と外部からのアクセス URL の指定を挙げ、規模の見積もりについては別途の設計資料を参照するよう書いている。指定しない場合は内蔵のデータベースと評価用の URL が使われる、つまり**試用の構成のまま運用に入る形ではない。**

**無料で使える範囲と、有料の範囲がある。** README には Premium という有料の区分があり、大規模なチーム向けの機能と専任のサポートがそこに含まれると書かれている。公式の文書で確かめられる線引きを挙げると、**監査の記録は Premium 限定**、**AI の利用料の把握と操作の紐づけ（AI Gateway）も Premium 側**で、**無料の範囲で同時に動かせるエージェントは5つまで**（超えた分は順番待ちになる）。必要な機能が無料側にあるかは、事前に確かめたい。

**開いているものは多い。** issue とプルリクエストを合わせて1,000件台が開いている。2021年から続いているリポジトリで、動きは止まっていない。
