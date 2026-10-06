---
updated: 2026-10-07
image:
image_alt:
---

<!-- ============================================================
  tester-army/e2e
  https://github.com/tester-army/e2e
  Next generation e2e testing framework for web and mobile apps.
  TypeScript / Apache-2.0 / スター 4,843
  topics: e2e, e2e-testing, end-to-end-testing, mobile, mobile-testing, playwright, web

============================================================ -->


## 見出しの一文

テストの手順を言葉で書き、AI が一度通した操作は次から記録で再生する


## どういうものか

ウェブアプリとスマホアプリの E2E テスト（利用者と同じように画面を操作して、最後まで通るかを確かめるテスト）を書くための、TypeScript の枠組みだ。ふつうの E2E テストは「このボタンを押す」「この欄に入力する」と操作を1つずつ書く。e2e では「ワークスペースを Pro プランに上げる」のような目的を文で書くと、AI エージェントがアプリを操作してそこまで進める。結果の確かめ方は2通りあり、AI に文で判定させることも、従来どおり画面の要素を指定して中身を照合することも、同じテストの中でできる。

ブラウザは Playwright を通して Chromium・Firefox・WebKit を動かし、スマホは iOS シミュレーターと Android エミュレーターを動かす。結果をプルリクエストにコメントで書き込む部品や、クラウド上のブラウザやシミュレーターを使う部品は、別のパッケージで用意されている。

AI を毎回呼ぶわけではない。エージェントが操作した手順は、そのあとの確認で正しさが確かめられると記録され、次の実行からはアプリが変わるまで、モデルを呼ばずに記録を再生する。ただし再生できるのは操作の手順だけで、AI に文で判定させる確認は毎回モデルを呼ぶ。エージェントの手順を含まないテストなら、モデルはまったく要らない。モデルは自分で用意する方式で、サブスクリプション、API キー、手元で動かすモデルのいずれかを使う。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI の操作は、確認が通ると記録され、次から再生される」とある図。左から「目的を言葉で書く（agent.act）」「AI エージェント（アプリを操作する）」「確認が通る（操作を記録する）」「次の実行（モデルを呼ばずに再生）」が矢印でつながる。下に「アプリが変わるまでは、記録した操作をそのまま使う」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="e2e-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">AI の操作は、確認が通ると<tspan fill="#1E5A48">記録</tspan>され、次から再生される</text>

  <rect x="28" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="109" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">目的を言葉で書く</text>
  <text x="109" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（agent.act）</text>

  <line x1="196" y1="225" x2="216" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#e2e-arrow)" />

  <rect x="222" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="303" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="303" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（アプリを操作する）</text>

  <line x1="390" y1="225" x2="410" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#e2e-arrow)" />

  <rect x="416" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="497" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">確認が通る</text>
  <text x="497" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（操作を記録する）</text>

  <line x1="584" y1="225" x2="604" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#e2e-arrow)" />

  <rect x="610" y="170" width="162" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="691" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">次の実行</text>
  <text x="691" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（モデルを呼ばずに再生）</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">アプリが変わるまでは、記録した操作をそのまま使う</text>
</svg>

キャプション: AI に操作させるのは、その手順を覚えるまで。ただし AI に判定させる確認は、毎回 AI を呼ぶ。


## どんなときに使うか

### テストを書きたいが、ボタンや入力欄を1つずつ指定するのが手間なとき

途中の操作は目的を文で書いて AI に任せ、最後に確かめたい表示だけを要素で厳密に照合する、という分け方ができる。

### ウェブ版とスマホ版を、同じ枠組みでテストしたいとき

ブラウザ用と iOS・Android 用のエンジンがあり、どちらも同じ e2e の中で扱える。


## 注意点

**まだ 1.0 の前。** マイナーリリースの間でも、API や設定が変わることがあると README に明記されている。

**記録は、そのままでは機械ごとに別になる。** 初期設定で記録の置き場が `.gitignore` に入るため、それぞれの機械が自分で記録を作る。CI では、設定を変えない限り記録を読むだけで新しく書き込まない。

**CLI は匿名の利用データを送る。** テストやアプリの中身、認証情報は送らないとしている。止めるには `npx e2e telemetry disable` を実行するか、環境変数 `E2E_TELEMETRY_DISABLED=1` を設定する。
