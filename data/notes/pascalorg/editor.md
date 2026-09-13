---
updated: 2026-09-13
image:
image_alt:
---

<!-- ============================================================
  pascalorg/editor
  https://github.com/pascalorg/editor
  TypeScript / MIT / スター 23,572
  topics: 3d, agent-skills, ai-agents, architecture, bim, cad, editor, floorplan, local-first, mcp, mcp-server, nextjs, parametric-design, react-three-fiber, threejs
============================================================ -->


## 見出しの一文

AIにシーンのJSONを書かせず、部屋やドアという単位で間取りを組ませる


## どういうものか

Pascal Editor は、ブラウザで動く建築向けの3Dエディタ。React Three Fiber と WebGPU で描画し、手元で完結する（ローカルファースト）。ブラウザでも CLI でも動き、MCP サーバ経由で AI を繋げる。目を引くのは、その **AI の入口の作り方**だ。生のシーンデータを渡して好きに組み替えさせるのではなく、**エディタの画面が使うのと同じ変更操作**を、そのまま MCP の道具として開けている（壁を作る、什器を置く、開口を空ける、取り消す、など）。

同梱スキルは冒頭で「**Pascal をシーンの正とみなす**。手書きのシーン JSON や見た目の当て推量より、Pascal の道具と検証結果を優先する」と指示している。作るときに使うのは `create_room`、`add_door`、`place_item` のような**名前の付いた操作**で、位置は引数として渡す（部屋なら多角形、什器なら座標、ドアなら壁のどのあたりか）。単位はメートルで、床の平面が X と Z、高さが Y。一方、ノードを直に書き換える `apply_patch` については、同梱スキルが「名前の付いた道具でその編集を表せず、かつ対象のスキーマか同じ種類の既存ノードを先に見たときだけ」と後ろに回している。ID も当てずっぽうに指さず、`find_nodes` などで**対象を特定してから**渡す決まりだ。編集のあとは `validate_scene` と `verify_scene` を通し、保存して、Pascal が返した URL を渡すところまで手順に含まれている。配置が重なっていないかは `check_collisions` という別の照会で確かめる。スキル側は「HTTP が成功しても、エラーなしの応答が返っても、それだけでは頼んだ結果ができた証拠にはならない」と念を押している。

その下のデータは、見かけ上「敷地 → 建物 → 階 → 壁・床・天井・ゾーンなど」の階層だが、実体は入れ子の木ではなく**平らな辞書**になっている。各ノードは `wall_abc123` のように種類が分かる ID を持ち、つながりは `parentId` と `children` で表す。描画は、変わったところだけ作り直す方式。ストアが書き換わるとそのノードに印が付き、壁・床・什器といった種類ごとの処理が毎フレーム、印の付いたノードだけ形を作り直す。什器は壁・天井・床（床の高さを見て）に取り付く。状態は3つのストアに分かれ（シーンの中身、見え方、道具の状態）、取り消しとやり直しも入っている。シーンは IndexedDB に保存され、CLI で動かした場合はプロジェクトが手元の `~/.pascal/data/pascal.db` に置かれる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「JSONを直に書かせない。名前の付いた操作で頼む」とある図。左に「AIが呼ぶ道具（名前の付いた操作）」の箱があり、create_room、add_door、place_item が並び、※ 位置は引数で渡す（メートル） と添えてある。中央に「Pascal 側の道具（呼ぶのは AI）」の箱があり、ノードを組み立てる、検証してから保存する、重なりは check_collisions で調べる が並び、※ 成功応答は結果の証拠にならない と添えてある。右に「返ってくるもの（編集できるシーン）」の箱があり、wall_abc123 など、変わったノードのID、editorUrl が並んでいる。下に「ノードを直に書くのは、名前の付いた操作で表せないときだけ」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="24" font-weight="700" fill="#17160F">JSONを直に書かせない。<tspan fill="#1E5A48">名前の付いた操作</tspan>で頼む</text>

  <rect x="20" y="110" width="228" height="230" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="134" y="148" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">AIが呼ぶ道具</text>
  <text x="134" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（名前の付いた操作）</text>
  <text x="134" y="212" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">create_room</text>
  <text x="134" y="238" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">add_door</text>
  <text x="134" y="264" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">place_item</text>
  <text x="134" y="308" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.6">※ 位置は引数で渡す（メートル）</text>

  <line x1="248" y1="225" x2="284" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#pe-arrow)" />

  <rect x="286" y="110" width="228" height="230" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="148" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">Pascal 側の道具</text>
  <text x="400" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（呼ぶのは AI）</text>
  <text x="400" y="212" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1E5A48">ノードを組み立てる</text>
  <text x="400" y="238" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1E5A48">検証してから保存する</text>
  <text x="400" y="264" text-anchor="middle" font-size="12" fill="#1E5A48">重なりは check_collisions で調べる</text>
  <text x="400" y="308" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.6">※ 成功応答は結果の証拠にならない</text>

  <line x1="514" y1="225" x2="550" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#pe-arrow)" />

  <rect x="552" y="110" width="228" height="230" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="666" y="148" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">返ってくるもの</text>
  <text x="666" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（編集できるシーン）</text>
  <text x="666" y="212" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">wall_abc123 など</text>
  <text x="666" y="238" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">変わったノードのID</text>
  <text x="666" y="264" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">editorUrl</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">ノードを直に書くのは、名前の付いた操作で表せないときだけ</text>
</svg>

キャプション: AIが渡すのは「部屋」「ドア」という**単位**のほう。生のノードを組み替えるのは、それで表せないときの逃げ道として後ろに置かれている。


## どんなときに使うか

### 頼んだ間取りが、本当にその形になったのか確かめたいとき

編集して、検証を通して、保存して、返ってきた記録を渡す。ここまでが手順として決まっている。スキル自身が「応答が成功しただけでは、頼んだ結果ができた証拠にならない」と書いているので、**できたと言われたものを、保存の記録で確かめる**流れに乗せられる。必要なら、重なりを調べる照会も別にかけられる。

### 図面を外に上げずに、AIと一緒に触りたいとき

繋ぎ先は手元とホスト版の2つ。手元のコネクタは、README によればアカウントも APIキーも要らず、プロジェクトが自動でアップロードされることもない（ホスト版は Pascal のアカウントに置いたプロジェクトを触る入口で、キーを空にすれば手元だけで動く）。顧客の物件のように**外部サービスに置きたくない図面**を扱う場合に、選択肢になる。


## 注意点

**MCP 経由だけでは、形が作られない部分がある。** 壁の取り合い、床の三角形分割、開口の抜き、屋根や階段の生成といった処理はエディタ側（React の描画ループ）で動くため、ブラウザを持たない MCP サーバ単体では作り直されない。MCP パッケージの README は「ノードのデータはすべて操作できる」としつつ、描画された形が必要なら閲覧用パッケージをブラウザで動かすよう案内している。GLB の書き出しも、この理由で未実装のまま返る。

**単体の HTTP ランタイムは、同時に繋いだ相手とシーンを共有する。** README は、手元の CLI サービスに繋ぐエージェントは1つにするよう求めていて、独立した作業を並行させるなら `PASCAL_HOME` とプロセスを分けるよう書いている。

**リポジトリにある機能が、入れた版にあるとは限らない。** スキルは使う前に MCP の道具の定義を確かめてから動く設計で、README も「このリポジトリにある機能が、古い導入版やホスト版には無いことがある」と断っている。手元の版で何が使えるかは、繋いでから確かめることになる。

**動かす前に環境を確かめたほうがいい。** README が挙げているのは Node.js 22.13 以上まで。描画に WebGPU を使う以上ブラウザ側にも条件が付くはずだが、対応環境の一覧は書かれていない。

同梱スキルは2つ。`pascal-3d` が上に書いた編集の手順で、`furniture-fit` は家具の占有面積が収まるかを根拠つきで見るもの。後者については、高さ・扉の開閉・搬入経路までは判断したと言わない、と README が断っている。

ライセンスは MIT。
