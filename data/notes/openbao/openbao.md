---
updated: 2026-09-27
image:
image_alt:
---

<!-- ============================================================
  openbao/openbao
  https://github.com/openbao/openbao
  OpenBao is a software solution to manage, store, and distribute sensitive data including secrets, certificates, and keys.
  Go / MPL-2.0 / スター 7,997
  topics: go, secret-management, security
============================================================ -->


## 見出しの一文

パスワードやAPIキーを暗号化して預かり、一部の鍵は期限付きでその場で作る


## どういうものか

パスワード、APIキー、証明書、暗号鍵といった「秘密の情報」を預かり、必要なアプリに渡すためのサーバーだ。Go で書かれていて、ライセンスは MPL-2.0。公式サイトは、HashiCorp の Vault から分かれた（フォークした）オープンソースで、Linux Foundation の OpenSSF のもとで運営されていると説明している。コマンド名は `bao`。

預かった秘密は、保存先（ディスクや PostgreSQL など）に書き込む前に暗号化する。保存先を直接のぞかれても、それだけでは中身を読めない。

一部のシステムについては、秘密をしまっておくのではなく、頼まれたときにその場で作る。README の例では、アプリが AWS の保存領域（S3）を使いたいとき、OpenBao に頼むと、使える権限を持った AWS のキーをその場で発行し、期限が過ぎれば自動で取り消す。こうしてその場で作った秘密には必ず「貸出期限（リース）」が付き、延長したければそのための API で更新する（公式の資料によれば、しまっておくだけの秘密には貸出期限が付かない）。取り消しは1件ずつだけでなく「ある利用者が読んだ秘密すべて」「ある種類の秘密すべて」のようにまとめてもできる。データを保存せずに暗号化と復号だけを引き受ける使い方もある。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「鍵はその場で作って、期限で消す」とある図。左から「アプリ（S3を使いたい）」「OpenBao（その場で発行）」「AWSのキー（貸出期限つき）」「自動で取り消し（期限が過ぎたら）」が矢印でつながっている。下に「しまっておく秘密も、保存先に書く前に暗号化される」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ob-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">鍵は<tspan fill="#1E5A48">その場で作って</tspan>、期限で消す</text>

  <rect x="18" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="103" y="192" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">アプリ</text>
  <text x="103" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（S3を使いたい）</text>

  <line x1="194" y1="206" x2="218" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#ob-arrow)" />

  <rect x="224" y="150" width="170" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="309" y="192" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">OpenBao</text>
  <text x="309" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（その場で発行）</text>

  <line x1="400" y1="206" x2="424" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#ob-arrow)" />

  <rect x="430" y="150" width="170" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="515" y="192" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AWSのキー</text>
  <text x="515" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（貸出期限つき）</text>

  <line x1="606" y1="206" x2="630" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#ob-arrow)" />

  <rect x="636" y="150" width="150" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="711" y="192" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">自動で取り消し</text>
  <text x="711" y="220" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（期限が過ぎたら）</text>

  <text x="400" y="360" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">しまっておく秘密も、保存先に書く前に暗号化される</text>
</svg>

キャプション: AWS やデータベースなど一部の相手なら、秘密を配って終わりにせず、使う分だけその場で作り、期限が来たら回収するところまでを OpenBao が受け持つ。


## どんなときに使うか

### 設定ファイルや環境変数に、パスワードを直接書くのをやめたいとき

秘密を OpenBao に預け、アプリには OpenBao から受け取らせる形にできる。預けた秘密は保存先でも暗号化されている。

### 漏れたかもしれないときに、関係する鍵をまとめて止めたいとき

特定の利用者が読んだ秘密、特定の種類の秘密をまとめて取り消せる。README は、侵入を受けたときの締め出しや、鍵の入れ替えに役立つと書いている。


## 注意点

**README が案内しているのは、自分でビルドして起動する手順。** 秘密を配る中心に置くものなので、運用の形は先に決めておきたい。

**その場で作れる秘密は「一部のシステム」だけ。** README の例は AWS と SQL データベース。自分が使うサービスに対応しているかは、公式の資料で確かめる。

**Vault から移るなら、互換の範囲を先に確かめる。** 分かれた元が同じでも、どこまでそのまま移せるかは README には書かれていない。

**MPL-2.0 はファイル単位のコピーレフト。** OpenBao のファイルを書き換えて配る場合は、配った相手がそのファイルのソースを入手できるようにする必要がある。

**Go のライブラリとして本体を丸ごと取り込むのは想定外。** 取り込み用に公開されているのは `api/v2` と `sdk/v2` の2つで、本体の取り込みで起きた不具合は直さないと README が明言している。
