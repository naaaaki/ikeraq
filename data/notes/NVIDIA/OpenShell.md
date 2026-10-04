---
updated: 2026-10-05
image:
image_alt:
---

<!-- ============================================================
  NVIDIA/OpenShell
  https://github.com/NVIDIA/OpenShell
  OpenShell is the safe, private runtime for autonomous AI agents.
  Rust / Apache-2.0 / スター 14,663
  

============================================================ -->


## 見出しの一文

AI エージェントに、決めた範囲のものだけを触らせて動かす


## どういうものか

NVIDIA が作っている、AI エージェントを安全に動かすための実行環境だ。エージェントは、ファイルを読み、パッケージを入れ、API を呼び、認証情報を使えるほど役に立つが、そのぶん危ない。OpenShell では、エージェントごとに何に触ってよいかを「ポリシー」に書き、それを守らせる。

エージェントは1体ずつ隔離されたサンドボックスで動く。OS のカーネルの段階で、触れるファイルと使えるシステムコールを絞り、外への通信はすべてポリシーの確認を通ってから出ていく。認証情報はエージェントに見せない。許可された宛先へ向かう通信にだけ、OpenShell が後から付け足す。

ポリシーを変えるときは、形式検証（数学的に調べる手法）で、その変更が新たに何を許すかを調べる。認証情報を持って新しいホストへ出る、新しい API の操作を呼ぶ、といった危ない広がりが見つかれば、人が確かめるまで止めておく。動かせるのは Linux、Apple Silicon の macOS、WSL 2 の Windows（試験的）で、Docker、Podman、仮想化のいずれかが要る。Kubernetes の上にも置ける。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「エージェントの操作は、すべてポリシーを通る」とある図。左から「エージェント（隔離されたサンドボックス）」「ポリシーの確認（ファイル・システムコール・通信）」「許可した宛先（ここへ向かう通信にだけ認証情報が付く）」が矢印でつながる。下に「危ない広がりを生む変更は、形式検証で見つけて人の確認を待たせる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="osh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">エージェントの操作は、すべて<tspan fill="#1E5A48">ポリシー</tspan>を通る</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">エージェント</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（隔離されたサンドボックス）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#osh-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ポリシーの確認</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ファイル・システムコール・通信）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#osh-arrow)" />

  <rect x="560" y="170" width="220" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">許可した宛先</text>
  <text x="670" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ここへ向かう通信にだけ認証情報が付く）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">危ない広がりを生む変更は、形式検証で見つけて人の確認を待たせる</text>
</svg>

キャプション: エージェントは本物の鍵を持たないまま仕事をし、許した宛先へ出るときだけ鍵が付く。


## どんなときに使うか

### コーディングエージェントに作業を任せたいが、手元の秘密情報や社内のネットワークには触らせたくないとき

何を読めて、どこへ通信できるかをポリシーで先に決めてから動かせる。

### チームで複数のエージェントを、同じ規則のもとで動かしたいとき

サンドボックス、ポリシー、アクセスを管理する「ゲートウェイ」を1か所に置き、Kubernetes の上でも運用できる。


## 注意点

**既定のサンドボックスに、エージェントは入っていない。** 既定のイメージは最小構成の Ubuntu だ。動かすときは、エージェント入りのイメージを指定してサンドボックスを作る。公式の手順書は、OpenCode のイメージと OpenRouter の無料モデルを例にしている。

**匿名の利用統計を送る。** 送るのは動作の種類や件数に限るとしている。止めるには、ゲートウェイで `OPENSHELL_TELEMETRY_ENABLED=false` を設定する。

**Kubernetes に置くなら、ネットワークの設定に条件がある。** 使っている CNI が `NetworkPolicy` を強制できる必要がある。
