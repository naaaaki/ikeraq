---
updated: 2026-10-02
image:
image_alt:
---

<!-- ============================================================
  corsairdev/corsair
  https://github.com/corsairdev/corsair
  Corsair: Connect your users to their apps
  TypeScript / Apache-2.0（GitHub 上の表示は NOASSERTION、LICENSE ファイルは Apache 2.0） / スター 13,353
  README が短いため、仕組みは docs/introduction.mdx・docs/quick-start.mdx・docs/hub/overview.mdx も参照した
============================================================ -->


## 見出しの一文

GitHub も Slack も同じ書き方で呼び、連携ごとの配線を書かずに済ませる


## どういうものか

自分のアプリや AI エージェントを、外部のサービスにつなぐための TypeScript のライブラリだ。ドキュメントによれば GitHub、Slack、Gmail など200以上のサービスに対応し、OAuth のログイン、トークンの更新、Webhook、利用回数の制限への対応を引き受ける。サービスごとに部品（プラグイン）が分かれていて、使うものだけを入れる。

README が理由として挙げるのは3点。1つは、どのサービスも同じ書き方で呼べること。つなぐ先が増えるほど増えていく「つなぎのコード」を書かずに済み、サービスごとの部品は Corsair 側が保守する。2つ目は、MCP 専用ではなく REST API の上に作られていること。そのため同じ仕組みを、エージェントにも、裏側の処理にも、利用者が自分のアカウントをつなぐ管理画面にも使える。3つ目は、オープンソースで、データが自分の手元に残ることだ。

ライブラリは自分のアプリの中で動き、利用者の認証情報は暗号化して自分のデータベースに保存する。外から届く URL が必要な部分（OAuth の戻り先、接続用のページ、操作の承認画面など）は、Hub に任せられる。Hub は通常 Corsair が運営するものを使う（自前の Hub を指定する設定項目もある）。ドキュメントによれば、Hub は利用者のトークンを保存しない。Hub を使わずに全部を自分で用意することもできる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「どのサービスも同じ書き方で呼ぶ」とある図。左から「自分のアプリ（エージェント・管理画面）」「Corsair（認証・更新・Webhook）」「外部サービス（GitHub・Slack・Gmail…）」が矢印でつながる。下に「利用者のトークンは、暗号化して自分のデータベースに置く」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">どのサービスも<tspan fill="#1E5A48">同じ書き方</tspan>で呼ぶ</text>

  <rect x="40" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="140" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">自分のアプリ</text>
  <text x="140" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（エージェント・管理画面）</text>

  <line x1="246" y1="225" x2="294" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cs-arrow)" />

  <rect x="300" y="170" width="200" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Corsair</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（認証・更新・Webhook）</text>

  <line x1="506" y1="225" x2="554" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cs-arrow)" />

  <rect x="560" y="170" width="200" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">外部サービス</text>
  <text x="660" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（GitHub・Slack・Gmail…）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">利用者のトークンは、暗号化して自分のデータベースに置く</text>
</svg>

キャプション: サービスごとの違いは Corsair が吸収するので、アプリの側はつなぐ先が増えても書き方が変わらない。


## どんなときに使うか

### 自分のサービスの利用者に、各自の Slack や GitHub をつないでもらいたいとき

利用者ごとに別々のアカウントをつなぐ仕組み（マルチテナント）を、ゼロから組まずに済む。OAuth の戻り先や接続ページを自分で作りたくなければ Hub に任せられる。

### エージェントに触らせるサービスが増えてきて、つなぎのコードが膨らんでいるとき

サービスが増えても呼び方は同じなので、新しい連携を足すたびに配線を書き直さなくてよい。


## 注意点

**README は短く、仕組みの説明はドキュメント（docs.corsair.dev。リポジトリの docs/ フォルダにも同じ文書がある）側にある。** 導入前にはそちらを読む必要がある。

**暗号化の鍵をなくすと、保存した認証情報がすべて使えなくなる。** ドキュメントは、この鍵（KEK）を管理者パスワードと同じように扱うよう警告している。

**Corsair が運営する Hub を使う場合は、そのサービスにプロジェクトを作る。** 運営側のサービスに頼りたくない場合は、Hub を使わない構成や、自前の Hub を指定する設定がある。

**ライセンスは Apache 2.0。**
