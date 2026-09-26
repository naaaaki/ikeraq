---
updated: 2026-09-18
image:
image_alt:
---

<!-- ============================================================
  addyosmani/agent-skills
  https://github.com/addyosmani/agent-skills
  Production-grade engineering skills for AI coding agents.
  JavaScript / MIT / スター 96,000台
============================================================ -->


## 見出しの一文

AIに守らせたい開発の手順を、25本の手順書にして渡す


## どういうものか

AI にコードを書かせるとき、進め方の指示は毎回こちらが言い直すことになる。このリポジトリは、その指示をあらかじめ**手順書の束**にしたもの。仕様を決める、分解する、実装する、テストする、レビューする、出す、という開発の各段階に対応する**25本**が入っている（24本が各段階のもの、残る1本は「どれを使うか選ぶ」ためのもの）。ライセンスは MIT。

中身は**ふつうの Markdown** のファイルで、1本ごとに書式が決まっている。何をするものか、どんなときに使うか、手順、**言い訳と、それへの反論**、危険な兆候、そして**終わりの条件としての証拠**。README はこの設計を「読み物ではなく、たどる手順」と説明し、「良さそうに見える」で終わらせず、テストの結果やビルドの出力といった証拠を求めることを共通の決まりにしていると書いている。必要になったときだけ補助の資料を読み込む構成なので、最初から全部を読ませるわけではない。

入れ方は2通り。共通のコマンドで一括して入れる方法（README は対応する道具を70種類以上としている）と、使っている道具ごとの入れ方だ。9個のスラッシュコマンドが段階の入り口になっていて、たとえば API を設計し始めれば設計用の手順書が、画面を作り始めれば画面用の手順書が自動で立ち上がる。ほかに、レビュー専門・テスト専門・セキュリティ専門・Web性能専門の**4つの役柄**と、7本の確認用チェックリストが付いている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「進め方を、毎回言い直さずに渡しておく」とある図。左は「いまやっていること」で、仕様を決める、画面を作る、レビュー前 が並ぶ。中央は「合う手順書が開く」で、25本から選ばれる と書かれている。右は「手順書の中身」で、手順、言い訳への反論、終わりの条件は証拠 が並ぶ。下に「9つの入り口（コマンド）と、レビュー・テスト・セキュリティ・Web性能の4つの役柄が付く」とある。いちばん下に「守らせたい進め方を、人の記憶ではなくAIの側に置いておく」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="as-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">進め方を、<tspan fill="#1E5A48">毎回言い直さず</tspan>に渡しておく</text>

  <rect x="20" y="118" width="210" height="136" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="125" y="154" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">いまやっていること</text>
  <text x="125" y="188" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">仕様を決める</text>
  <text x="125" y="214" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">画面を作る</text>
  <text x="125" y="240" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">レビュー前</text>

  <line x1="236" y1="186" x2="272" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#as-arrow)" />

  <rect x="280" y="118" width="210" height="136" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="385" y="176" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">合う手順書が開く</text>
  <text x="385" y="210" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">25本から選ばれる</text>

  <line x1="496" y1="186" x2="532" y2="186" stroke="#1E5A48" stroke-width="4" marker-end="url(#as-arrow)" />

  <rect x="540" y="118" width="240" height="136" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="660" y="154" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">手順書の中身</text>
  <text x="660" y="188" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">手順</text>
  <text x="660" y="214" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">言い訳への反論</text>
  <text x="660" y="240" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">終わりの条件は証拠</text>

  <text x="400" y="320" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.78">9つの入り口（コマンド）と、レビュー・テスト・セキュリティ・Web性能の4つの役柄が付く</text>
  <text x="400" y="384" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">守らせたい進め方を、人の記憶ではなくAIの側に置いておく</text>
</svg>

キャプション: 面白いのは、**言い訳への反論**が手順書に入っていること。「テストはあとで足す」のような省略の言い分に、あらかじめ返しを用意してある。


## どんなときに使うか

### 同じ注意を毎回しているとき

「先に仕様を書いて」「テストを通してから言って」といった指示を毎回打っているなら、それは手順書にできる部分だ。25本のうち必要なものだけを入れることもできる。

### 進め方を人に説明しづらいとき

各手順書は、段階・手順・終わりの条件の形で書かれている。**AI に読ませる文書であると同時に、人が読める進め方の説明**にもなっている。新しく入った人に渡すものが無いときの土台にできる。


## 注意点

**1本だけ入れると、付属の資料が付いてこない。** README 自身が但し書きしていて、1本単位で入れた場合、リポジトリ側にある共通のチェックリストは複写されない。手順書自体は動くが、資料への参照が切れる。まとめて入れるか、必要な資料を手で置くことになる。

**道具ごとに入れ方も落とし穴も違う。** 一括で入れるコマンドのほかに、Claude Code、Cursor、Codex、Gemini CLI など個別の手順が並んでいる。README には、特定の道具でコマンドの呼び出しがうまく見つからない場合の回避方法や、SSH の設定に起因する失敗への対処も書かれている。**入れる前に、自分の道具の節を読む前提**のものだ。

**Web 寄りの前提が混じっている。** テストの書き方の資料は JavaScript / TypeScript のもので、性能の目標にはブラウザ側の指標が入っている。分野が違えば、その部分は読み替えることになる。

**厳しさが合わないことがある。** 証拠を出すまで終わりにしない、省略の言い分に反論する、という作りなので、短く試したいだけのときは重い。手早く動くものを作りたい場面と、外に出すものを作る場面で、入れる手順書を分けるほうが現実的だ。
