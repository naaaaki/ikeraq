---
updated: 2026-09-08
image:
image_alt:
---

<!-- ============================================================
  anomalyco/opencode
  https://github.com/anomalyco/opencode
  The open source coding agent.
  TypeScript / MIT / スター 205,809 / 既定ブランチ dev
============================================================ -->


## 見出しの一文

入口もモデルも後から替えられる、乗り換え前提のコーディングエージェント


## どういうものか

OpenCode は、コードを書く作業を任せられるエージェントを、**特定の会社のモデルに縛られない形で**用意したもの。主な入口はターミナルの画面とデスクトップアプリ（ベータ）で、ブラウザで開く使い方もある。VS Code や Cursor 向けの拡張は、エディタの中でターミナル版を開いて選択範囲を渡すためのもの。導入はインストール用のスクリプトのほか、npm・Homebrew・Scoop・Chocolatey・pacman・mise・Nix と、環境に合わせた経路が README に並んでいる。

特徴は**モデルの差し替えが前提**になっているところ。ドキュメントによると、AI SDK と Models.dev を通じて75以上の提供元に対応し、手元で動かすモデルも使える。鍵は `/connect` で登録して手元のファイルに保存され、提供元ごとに接続先のURLを差し替えることもできる。つまり「どのモデルを使うか」を後から変えられる作りで、値上げや品質の変化に対して乗り換えの余地を残している。

もうひとつは**権限を分けた2つのエージェント**。README は「組み込みのエージェントが2つ」という立て方をしている。`build` は編集も実行もできる既定のエージェント、`plan` は読むだけのエージェントで、ファイルの変更を既定で拒否し、コマンドを実行する前に許可を求める。この2つは Tab キーで切り替える。加えて `@general` で呼び出す、調べものや複数手順の作業用のサブエージェントが内蔵されている。中身は用途ごとに分かれた多数のパッケージ（ターミナル画面・デスクトップ・サーバー・SDK・プラグインなど）で構成されていて、ドキュメントの範囲も広く、言語サーバー（LSP）を使った診断の取り込み、外部ツールをつなぐ MCP、実行の許可設定、会話の共有、配色、GitHub や GitLab との連携までが並ぶ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「入口もモデルも、あとから替えられる」とある図。左に「入口」の箱があり、ターミナルの画面、デスクトップアプリ（ベータ）、エディタの拡張、（どれでも同じ本体）が並ぶ。矢印で中央の「OpenCode 本体」に進み、build … 編集も実行もする、plan … 読むだけ、（編集を拒否し、実行前に許可を求める）、Tab キーで行き来する、調べもの用のサブエージェントも内蔵 と書かれている。矢印で右の「モデル」に進み、75以上の提供元、手元で動かすモデル、接続先のURLも変更可、（鍵は手元に保存）が並ぶ。下に「乗り換えの余地を残すことが、この道具の設計の中心にある」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="oc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">入口も<tspan fill="#1E5A48">モデルも</tspan>、あとから替えられる</text>
  <rect x="20" y="130" width="176" height="172" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="108" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">入口</text>
  <text x="108" y="202" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">ターミナルの画面</text>
  <text x="108" y="228" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">デスクトップアプリ（ベータ）</text>
  <text x="108" y="254" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">エディタの拡張</text>
  <text x="108" y="282" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（どれでも同じ本体）</text>
  <line x1="196" y1="216" x2="238" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#oc-arrow)" />
  <rect x="246" y="118" width="256" height="196" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="374" y="154" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">OpenCode 本体</text>
  <text x="374" y="190" text-anchor="middle" font-size="13.5" font-weight="700" fill="#17160F">build … 編集も実行もする</text>
  <text x="374" y="220" text-anchor="middle" font-size="13.5" font-weight="700" fill="#17160F">plan … 読むだけ</text>
  <text x="374" y="244" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（編集を拒否し、実行前に許可を求める）</text>
  <text x="374" y="276" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">Tab キーで行き来する</text>
  <text x="374" y="300" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">調べもの用のサブエージェントも内蔵</text>
  <line x1="502" y1="216" x2="544" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#oc-arrow)" />
  <rect x="552" y="130" width="228" height="172" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="666" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">モデル</text>
  <text x="666" y="202" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">75以上の提供元</text>
  <text x="666" y="228" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">手元で動かすモデル</text>
  <text x="666" y="254" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.78">接続先のURLも変更可</text>
  <text x="666" y="282" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（鍵は手元に保存）</text>
  <text x="400" y="386" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">乗り換えの余地を残すことが、この道具の設計の中心にある</text>
</svg>

キャプション: 選べることの価値は、いま最良のモデルを使えることより、**最良でなくなったときに動けること**にある。


## どんなときに使うか

### 特定のサービスに寄りかからずにエージェントを使いたいとき

コーディングエージェントは、提供元の値段・制限・品質の変更をそのまま受ける。接続先を設定で替えられる作りなら、**乗り換えの判断を自分の側に残せる**。社内で使うモデルが決まっている場合にも合わせやすい。

### まず読ませて、書かせるのは後にしたいとき

知らないコードに手を入れる前に、まず全体を把握したい場面がある。`plan` は編集を拒否し、コマンドの実行にも許可を求めるので、**調べる時間と、変える時間を分けられる**。


## 注意点

**「読むだけ」は事故を減らすが、無くすものではない。** `plan` が拒否するのはファイルの編集で、コマンドの実行は許可を求める形になる。許可を出す人が中身を読まなければ、区別は意味を持たない。

**デスクトップアプリはベータと明記されている。** 常用するなら、まずターミナル版から入るほうが無難だ。ターミナルで使う場合、ドキュメントは WezTerm・Alacritty・Ghostty・Kitty といった現代的な端末を前提として挙げている。ドキュメントに挙がっていない端末での動作は書かれていない。

**名前が紛らわしい。** README は、名前に「opencode」を含む関連プロジェクトを作る場合、開発チームとは無関係である旨を明記するよう求めている。README がわざわざ注意を書くほどには、名前を借りたものがあるということだ。

**既定のブランチが `dev`。** 手元に落として読むときは、`main` を見ているつもりで違うものを見ないよう気をつける。ライセンスは MIT。日本語を含む20以上の言語の README が用意されている。
