---
updated: 2026-10-01
image:
image_alt:
---

<!-- ============================================================
  robbietilton/Compositor
  https://github.com/robbietilton/Compositor
  The Photoshop alternative for Mac
  Swift / MIT / スター 6,490
============================================================ -->


## 見出しの一文

Photoshop に近い手順で合成と仕上げができる、Mac 用の無料の画像編集アプリ


## どういうものか

Mac 用の画像編集アプリで、無料・オープンソース（MIT）で公開されている。作者は、Photoshop は高すぎ、GIMP は手になじまず作業に集中できないので自分で作った、と書いている。作者がもともと Photoshop でやっていた合成と仕上げの作業を軸に作られていて、Xcode のプロジェクトごと公開されているので、機能を足したり削ったりもできる。

主な機能は、レイヤーとフォルダ、Photoshop と同じ順に並んだ描画モード、レイヤーマスクとクリッピングマスク、調整レイヤー、あとから直せるレイヤー効果（ドロップシャドウなど）。選択範囲には自動選択や被写体の選択、コンテンツに応じた塗りつぶしがあり、修復用のスポット修復ブラシや、Camera Raw フィルターもある。Photoshop の PSD・PSB も開け、フォルダやマスク、描画モードは編集できる形で残る。キーボードの近道は Photoshop 風の割り当てで、自分で変えることもできる。

もう1つの特徴は、AI エージェントからも作品を組み立てられること。Compositor のプロジェクト（`.comp`）は、レイヤーごとの PNG 画像と `manifest.json` が入ったフォルダにすぎない。ファイルを書けるものなら何でも中身を作れて、開いているキャンバスは書き換えに合わせて読み直される。説明書きには、たいてい0.5秒以内とある。プラグインや API は使わない。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「AI が書いたファイルが、そのままキャンバスになる」とある図。左から「AI エージェント（ファイルを書く）」「.comp フォルダ（PNG＋manifest.json）」「Compositor（開いたまま読み直す）」が矢印でつながる。下に「プラグインも API も要らない。ただし決まりに反したファイルは、何も言わずに無視される」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="cp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">AI が書いた<tspan fill="#1E5A48">ファイル</tspan>が、そのままキャンバスになる</text>

  <rect x="30" y="165" width="200" height="120" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="130" y="217" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">AI エージェント</text>
  <text x="130" y="243" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（ファイルを書く）</text>

  <line x1="236" y1="225" x2="292" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cp-arrow)" />

  <rect x="300" y="165" width="200" height="120" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="217" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">.comp フォルダ</text>
  <text x="400" y="243" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（PNG＋manifest.json）</text>

  <line x1="506" y1="225" x2="562" y2="225" stroke="#1E5A48" stroke-width="4" marker-end="url(#cp-arrow)" />

  <rect x="570" y="165" width="200" height="120" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="670" y="217" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Compositor</text>
  <text x="670" y="243" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（開いたまま読み直す）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">プラグインも API も要らない。ただし決まりに反したファイルは、何も言わずに無視される</text>
</svg>

キャプション: プロジェクトがただのファイルの集まりなので、AI に下ごしらえを書かせ、仕上げは同じ画面で人が続けられる。


## どんなときに使うか

### Photoshop の契約はやめたいが、慣れた操作はなるべく残したいとき

キーボードの近道が Photoshop 風で、描画モードも Photoshop と同じ順に並んでいる。8 ビット RGB の PSD なら、手元のファイルも開ける。

### AI に下ごしらえを任せて、仕上げは自分の手でやりたいとき

エージェントが書いたレイヤーは、ふつうのレイヤーとして開く。そのあと不透明度や描画モードを変えたり、マスクを塗ったりして人が仕上げられる。


## 注意点

**Apple シリコンの Mac で、macOS 26 以降だけ。** Windows や Intel の Mac では動かない。

**PSD は完全には再現されない。** 読み込めるのは 8 ビットの RGB だけで、CMYK は開けない。塗りの四角・楕円と単純な横書きの文字は編集できる形で残るが、それ以外のベクターと縦書きの文字は画像に変わる。適用する前に変換の報告が出る。

**README に書かれた書き出し形式は JPEG だけ。** PSD で書き出せるとは書かれていない。Photoshop を使う人とファイルをやりとりするなら、先に確かめておく。

**AI 向けのファイルは決まりを外すと黙って無視される。** 説明書きによれば、ファイル名の付け方などの決まりを1つでも破ると、エラーも出ずにキャンバスが元のままになる。

**できて間もない。** リポジトリは2026年9月に作られた。
