---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  paperless-ngx/paperless-ngx
  https://github.com/paperless-ngx/paperless-ngx
  A community-supported supercharged document management system: scan, index and archive all your documents
  Python / GPL-3.0 / スター 45,000台
============================================================ -->


## 見出しの一文

紙の書類を自宅のサーバーに取り込み、全文検索できる書庫に変える


## どういうものか

スキャンした書類を溜めておき、**中の文字まで検索できる状態にして保管する**ためのソフトだ。Python（Django）で書かれた本体と、Angular で書かれた画面からなる。名前のとおり「紙を減らす」ことが目的で、README は「探せるオンラインの書庫に変える」という言い方をしている。2022年に始まり、もとの Paperless・Paperless-ng を引き継ぐ後継として、特定の一人ではなく複数人のチームで支える形をとっている。

取り込んだ書類には **OCR がかかる**。文字起こしには Tesseract を使い、公式ドキュメントは100以上の言語に対応すると書いている。画像しか入っていないスキャンにも、選択・検索できる文字の層が足される。保存の形は、長期保管を想定した PDF/A と、**手を加えていない原本の両方**。ファイルは独自の入れ物ではなく**そのままディスク上に置かれ**、ファイル名とフォルダの付け方は設定で変えられる。扱える形式は PDF・画像・テキストのほか、Word や Excel などのオフィス文書もあるが、こちらは Apache Tika を別途動かしたときに使える追加機能という位置づけだ。

分類は手で付けるだけではない。**機械学習でタグ・相手先・書類の種類を自動で付ける**仕組みが入っている。さらに新しい機能として、大規模言語モデル（LLM）を使った候補の提示・書類との対話・似た書類の取り出しがあるが、こちらは**既定では切ってあり、自分で入れる選択をしたときだけ動く**。検索は全文検索で、入力中の補完、関連度順の並べ替え、一致した箇所の強調、「これに似た書類」の取り出しがある。ほかに、利用者ごとの権限（全体単位と書類単位の両方）、処理の流れを組む仕組み、複数コアを使った並列取り込み、書庫の健全性を点検する機能がある。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「紙の山を、探せる書庫に変える」とある図。左から「取り込み（スキャンやドラッグ&amp;ドロップ）」、矢印で「OCR（Tesseractで文字を起こす）」、矢印で「保存（PDF/Aと原本の両方）」、矢印で「書庫（全文検索・タグ・権限）」と並んでいる。OCRの下に矢印が伸び「機械学習がタグと相手先を推測する」とある。いちばん下に「原本はそのまま残り、探すための文字だけが足される」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">紙の山を、<tspan fill="#1E5A48">探せる書庫</tspan>に変える</text>

  <rect x="20" y="172" width="175" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="107" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">取り込み</text>
  <text x="107" y="240" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（スキャンや</text>
  <text x="107" y="258" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">ドラッグ&amp;ドロップ）</text>

  <line x1="197" y1="222" x2="213" y2="222" stroke="#1E5A48" stroke-width="4" marker-end="url(#pn-arrow)" />

  <rect x="215" y="172" width="175" height="100" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="302" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">OCR</text>
  <text x="302" y="234" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Tesseractで</text>
  <text x="302" y="252" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">文字を起こす）</text>

  <line x1="392" y1="222" x2="408" y2="222" stroke="#1E5A48" stroke-width="4" marker-end="url(#pn-arrow)" />

  <rect x="410" y="172" width="175" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="497" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">保存</text>
  <text x="497" y="234" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（PDF/Aと原本の</text>
  <text x="497" y="252" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">両方）</text>

  <line x1="587" y1="222" x2="603" y2="222" stroke="#1E5A48" stroke-width="4" marker-end="url(#pn-arrow)" />

  <rect x="605" y="172" width="175" height="100" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="692" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">書庫</text>
  <text x="692" y="234" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（全文検索・タグ・</text>
  <text x="692" y="252" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">権限）</text>

  <line x1="302" y1="278" x2="302" y2="318" stroke="#1E5A48" stroke-width="4" marker-end="url(#pn-arrow)" />
  <text x="302" y="342" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">機械学習がタグと相手先を推測する</text>

  <text x="400" y="406" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">原本はそのまま残り、探すための文字だけが足される</text>
</svg>

キャプション: 紙を**捨てるため**ではなく、**探せるようにするため**の道具。原本を置き換えない設計が、後から見返す安心につながっている。


## どんなときに使うか

### 契約書や請求書が引き出しに溜まり、必要なときに出てこないとき

取り込んだ時点で文字が起こされるので、書類の名前を覚えていなくても、中に書かれた言葉から探せる。タグや相手先は機械学習が推測して付けるため、全部に手で名前を付けていく作業から始めなくてよい。

### 書類を外部のサービスに預けたくないとき

置き場所は自分で立てたサーバーで、公式ドキュメントは「あなたが明示的に選ばない限り、データが外部に送られたり共有されたりすることはない」と書いている。LLM を使う機能も既定では切ってある。**手元に置いたまま整理したい**場合に向く。


## 注意点

**中身は暗号化されていない。** README は、スキャンする書類が社会保険番号・税の記録・請求書といった機微なものになりやすいことを挙げたうえで、**信頼できないホストの上で動かしてはならない**と書いている。情報は暗号化されずそのまま保存されるためで、いちばん安全な形として「自宅の中のローカルサーバーで、バックアップを用意して動かすこと」を挙げている。

**ライセンスが GPL-3.0。** 自分で立てて使うぶんには問題にならないが、改造したものを配布する場合はソースの開示が求められる形のライセンスだ。

**「使える」と書かれていても、追加で用意するものがある機能がある。** オフィス文書の取り込みとメールからの取り込みは、Apache Tika を別途動かしたときに使える追加機能だと公式ドキュメントが注記している。OCR を Azure AI 側に任せる選択肢も新しく入ったが、こちらは自分で入れる設定にしたときだけ動く。必要な機能がそのまま使えるのかは、入れる前に確かめたい。

**開いているものは少ない。** issue とプルリクエストを合わせて1桁にとどまっている。2022年から続いていて、更新は止まっていない。
