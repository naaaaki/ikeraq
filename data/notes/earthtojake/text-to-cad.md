---
updated: 2026-10-07
image:
image_alt:
---

<!-- ============================================================
  earthtojake/text-to-cad
  https://github.com/earthtojake/text-to-cad
  Give your agent CAD superpowers.
  Python / MIT / スター 17,437
  topics: agents, ai-agents, cad, mechanical-engineering, robotics, step, stl, stp, text-to-cad

============================================================ -->


## 見出しの一文

AI エージェントに、3D プリントや加工に出せる CAD データを作らせる


## どういうものか

Claude Code や Codex、Cursor、Gemini、Grok などのコーディングエージェントに、3D の CAD モデルを作る力を足すプラグインだ。作りたい部品を言葉や画像で頼むと、エージェントが build123d（Python で形を組み立てるライブラリ）のコードを書いて実行し、STEP ファイルを出す。STEP は機械設計の CAD どうしでやり取りに使う標準の形式で、STL・3MF・GLB にも書き出せる。形はコードとして残るので、寸法を変えたいときはそのコードを直して作り直す。

モデリングのほかにも、用途ごとのスキルがまとまっている。寸法入りの図面を PDF で出す、2D の DXF 図面を作る、ねじやベアリング、モーターといった既製部品の STEP を探す、3D プリントのしやすさ（壁の厚さ、オーバーハング、サポートの量）を測る、板金・切削・射出成形に向くかを点検する、OrcaSlicer で G-code に変換する、Bambu Lab のプリンターに送る、といったものだ。板金加工サービスの SendCutSend に上げる前のファイル点検や、ロボットの構造を書く URDF・SDF などのファイル作成も入っている。

形を作る処理は手元で動く。CAD の処理は cadgen という Python パッケージが担い、uv を通して実行される。形の計算には Open CASCADE が使われている。作ったモデルはビューアーで回して見られ、プラグインとして入れれば対応するアプリの会話の中に、そうでなければブラウザに表示される。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「言葉で頼むと、コードを経由して CAD データになる」とある図。左から「言葉・画像（形や寸法の依頼）」「AI エージェント（build123d のコードを書く）」「cadgen（手元で実行する）」「STEP ファイル（STL・3MF・GLB にも）」が矢印でつながる。下に「形はコードで残るので、寸法を直して作り直せる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ttc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">言葉で頼むと、<tspan fill="#1E5A48">コード</tspan>を経由して CAD データになる</text>

  <rect x="28" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="109" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">言葉・画像</text>
  <text x="109" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（形や寸法の依頼）</text>

  <line x1="196" y1="225" x2="216" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#ttc-arrow)" />

  <rect x="222" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="303" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="303" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（build123d のコードを書く）</text>

  <line x1="390" y1="225" x2="410" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#ttc-arrow)" />

  <rect x="416" y="170" width="162" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="497" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">cadgen</text>
  <text x="497" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（手元で実行する）</text>

  <line x1="584" y1="225" x2="604" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#ttc-arrow)" />

  <rect x="610" y="170" width="162" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="691" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">STEP ファイル</text>
  <text x="691" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（STL・3MF・GLB にも）</text>

  <text x="400" y="390" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">形はコードで残るので、寸法を直して作り直せる</text>
</svg>

キャプション: エージェントが直接形を描くのではなく、形を作るコードを書く。だから作ったあとも数字で直せる。


## どんなときに使うか

### CAD に慣れていないが、3D プリントする部品を作りたいとき

形と寸法を言葉で伝えて STEP にし、プリントのしやすさの点検や、（OrcaSlicer を入れておけば）G-code への変換まで、同じエージェントとの会話で進められる。

### 部品の寸法を何度も変えながら詰めていきたいとき

形がコードとして残るので、数字を変えて作り直せる。


## 注意点

**Windows 11 では、スマートアプリコントロールに止められることがある。** 形を計算する部品に署名が無く、スマートアプリコントロールが有効だと CAD の処理がすべて失敗する。新しく入れた Windows では既定で有効になっている。アプリごとの例外は設定できないため、無効にするか WSL の中で動かすことになる。

**利用状況の送信は、許可するまでオフ。** 最初に一度だけ聞かれる。これとは別に、自分で入れた場合は、新しい版が出ていないかの確認が1日1回まで匿名で行われる（`CADGEN_UPDATE_CHECK=0` で止まる）。
