---
updated: 2026-09-12
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

間取りの3Dモデルを、AIが1要素ずつ指して直せるデータにする


## どういうものか

Pascal Editor は、ブラウザで動く建築向けの3Dエディタ。React Three Fiber と WebGPU で描画し、手元で完結する（ローカルファースト）。ただ、このリポジトリで目を引くのは描画のほうではなく、**エージェントが編集者として入ってこられる**ように、データの持ち方が組まれている点だ。MCP サーバが付いていて、AI が形を読み取り、置き換え、確かめられる。

鍵は**シーンの持ち方**にある。見かけ上は「敷地 → 建物 → 階 → 壁・床・天井・ゾーン → 什器」という階層だが、実体は入れ子の木ではなく、**平らな辞書**になっている。各ノードは `wall_abc123` のように種類が分かる ID を持ち、親を `parentId` で指すだけ。この形だと、深い木をたどらずに「この壁」だけを名指しして差し替えられる。人が画面上でドラッグして動かす操作と、エージェントが ID を指定して書き換える操作が、同じ入り口に揃う。

描画側は、変わったところだけ作り直す。ストアが書き換わるとそのノードに印が付き、壁・床・什器といった種類ごとの処理が、**印の付いたノードだけ**形を作り直す。状態は3つのストアに分かれ（シーンの中身、見え方、道具の状態）、保存はブラウザ内の IndexedDB、取り消しとやり直しも入っている。エージェントの繋ぎ方は2通りで、`pascal mcp connect` で手元に繋ぐ場合はどこにもアップロードされない。ホスト版の入口も用意されている。`pascal-3d`（安全に編集する手順）や `furniture-fit`（置いた家具が収まるか根拠つきで確かめる）といったスキルが同梱され、独自のノード種類や道具はプラグインとして足す作りになっている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="Pascal Editor のデータの持ち方の図。左に「人が見ている形」の箱があり、敷地・建物・階・壁・什器が入れ子の階層として並んでいる。中央に「実体は平らな一覧」の箱があり、wall_abc123 や item_9f2 といった ID のノードが横に並び、それぞれが parentId で親を指していると書かれている。右に「AIが触るとき」の箱があり、MCP 経由で ID を名指しして読み書きし、印の付いたノードだけ描き直すと書かれている。下に、人のドラッグ操作と AI の書き換えが同じ入り口に揃う、と添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">木をたどらせない。<tspan fill="#1E5A48">名指しで</tspan>1要素を直す</text>

  <rect x="20" y="118" width="212" height="218" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="126" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">人が見ている形</text>
  <text x="126" y="180" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（入れ子の階層）</text>
  <text x="52" y="216" font-size="13" fill="#17160F" fill-opacity="0.85">敷地</text>
  <text x="70" y="240" font-size="13" fill="#17160F" fill-opacity="0.85">└ 建物</text>
  <text x="88" y="264" font-size="13" fill="#17160F" fill-opacity="0.85">└ 階</text>
  <text x="106" y="288" font-size="13" fill="#17160F" fill-opacity="0.85">└ 壁・床</text>
  <text x="124" y="312" font-size="13" fill="#17160F" fill-opacity="0.85">└ 什器</text>

  <line x1="232" y1="227" x2="268" y2="227" stroke="#1E5A48" stroke-width="4" marker-end="url(#pe-arrow)" />

  <rect x="275" y="118" width="250" height="218" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">実体は平らな一覧</text>
  <text x="400" y="180" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（親は parentId で指すだけ）</text>
  <rect x="291" y="198" width="218" height="30" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="400" y="218" text-anchor="middle" font-size="12.5" fill="#17160F">level_01</text>
  <rect x="291" y="234" width="218" height="30" rx="4" fill="none" stroke="#1E5A48" stroke-width="1.8" />
  <text x="400" y="254" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1E5A48">wall_abc123</text>
  <rect x="291" y="270" width="218" height="30" rx="4" fill="none" stroke="#17160F" stroke-opacity="0.3" />
  <text x="400" y="290" text-anchor="middle" font-size="12.5" fill="#17160F">item_9f2</text>
  <text x="400" y="322" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">深さに関係なく、1行で届く</text>

  <line x1="525" y1="227" x2="561" y2="227" stroke="#1E5A48" stroke-width="4" marker-end="url(#pe-arrow)" />

  <rect x="568" y="118" width="212" height="218" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="674" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">AIが触るとき</text>
  <text x="674" y="180" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（MCP 経由）</text>
  <text x="674" y="220" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">ID を名指しして</text>
  <text x="674" y="242" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">読む・書き換える</text>
  <text x="674" y="278" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">印の付いたノードだけ</text>
  <text x="674" y="300" text-anchor="middle" font-size="12.5" fill="#1E5A48" font-weight="700">描き直す</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">人のドラッグも AI の書き換えも、同じ一覧の同じ1行を直す操作になる</text>
</svg>

キャプション: エージェントを後付けしたのではなく、**AI が触れる形からデータを決めている**。3Dツールに AI を足す試みの中では、そこが分かれ目になる。


## どんなときに使うか

### 「この階の間仕切りを全部30cm動かして」のような、数の多い直しを頼みたいとき

1つずつ掴んで動かす代わりに、条件に合うノードをまとめて書き換えられる。**手数が多くて判断が少ない作業**ほど、頼む側に回す価値が出る。

### 図面を外に上げずに、AIと一緒に触りたいとき

手元に繋ぐ方式ならアップロードが発生しない。顧客の物件のように**外部サービスに置きたくない図面**を扱う場合に、選択肢になる。


## 注意点

**同時に複数から触ると、同じシーンを共有してしまう。** 単体で動かす HTTP ランタイムは、繋いだ相手の間でシーンの状態を共有する作りになっている。README は、独立した作業を並行させるなら `PASCAL_HOME` とプロセスを分けるよう求めている。

**リポジトリにある機能が、入れた版にあるとは限らない。** スキルは使う前に MCP の道具の定義を確かめてから動く設計で、README も「このリポジトリにある機能が、古い導入版やホスト版には無いことがある」と断っている。手元の版で何が使えるかは、繋いでから確かめることになる。

**ブラウザ側の要件がある。** WebGPU で描くため、動く環境は限られる。

ライセンスは MIT。
