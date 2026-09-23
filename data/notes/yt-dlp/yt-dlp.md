---
updated: 2026-09-23
image:
image_alt:
---

<!-- ============================================================
  yt-dlp/yt-dlp
  https://github.com/yt-dlp/yt-dlp
  A feature-rich command-line audio/video downloader
  Python / Unlicense / スター 192,959
  topics: cli, downloader, python, sponsorblock, youtube-dl, youtube-downloader, yt-dlp

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

数千のサイトの動画と音声を、画質を選んでコマンド1行で保存する


## どういうものか

URL を渡すと、そのページの動画や音声をファイルとして保存するコマンドラインのツールだ。README によれば対応サイトは数千にのぼり、一覧は別のファイルにまとめられている。言語は Python。youtube-dl の派生で、いまは開発が止まった youtube-dlc を土台に分かれてきた。

中身の核は、サイトごとに用意された**抽出器**だ。URL に合う抽出器が、そのページで取れる形式（解像度・コーデック・音声だけ、など）を洗い出す。何も指定しなければ、いちばん良い映像といちばん良い音声を選び、別々に配信されていれば ffmpeg で1つにまとめる。形式は条件式で細かく選べ、保存先のファイル名もテンプレートで組み立てられる。字幕やサムネイルの保存、SponsorBlock の情報を使った YouTube 動画のスポンサー区間の章分け・削除といった後処理も入っている。

コマンドとして使うだけでなく、**ほかのプログラムから呼ぶ**ことも想定されている。README は、出力をそのまま読み取らずに JSON 出力などの決まった形を使うよう勧めており、Python からは部品として組み込める。自分で抽出器や後処理を足すプラグインの仕組みもある。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="URLを渡すと、サイトごとの抽出器が形式を洗い出す。URL（保存したいページ）。抽出器（サイトごとに用意）。形式の選択（既定はいちばん良い画質）。ffmpeg（映像と音声を1つに）。ファイル（名前はテンプレートで決める）。ffmpegが無いと、別々に配信された映像と音声をまとめられない" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="yt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">URLを渡すと、<tspan fill="#1E5A48">サイトごとの抽出器</tspan>が形式を洗い出す</text>

  <rect x="16" y="180" width="128" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="80" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">URL</text>
  <text x="80" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（保存したいページ）</text>

  <line x1="148" y1="228" x2="172" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#yt-arrow)" />

  <rect x="176" y="180" width="140" height="96" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="246" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">抽出器</text>
  <text x="246" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（サイトごとに用意）</text>

  <line x1="320" y1="228" x2="344" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#yt-arrow)" />

  <rect x="348" y="180" width="156" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="426" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">形式の選択</text>
  <text x="426" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（既定はいちばん良い画質）</text>

  <line x1="508" y1="228" x2="532" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#yt-arrow)" />

  <rect x="536" y="180" width="120" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="596" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ffmpeg</text>
  <text x="596" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（映像と音声を1つに）</text>

  <line x1="660" y1="228" x2="684" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#yt-arrow)" />

  <rect x="688" y="180" width="100" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="738" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ファイル</text>
  <text x="738" y="242" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">（名前はテンプレート</text>
  <text x="738" y="258" text-anchor="middle" font-size="10" fill="#17160F" fill-opacity="0.72">で決める）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">ffmpegが無いと、別々に配信された映像と音声をまとめられない</text>
</svg>

キャプション: 数千のサイトに対応し、ページの読み取りは**サイトごとの抽出器**が受け持つ。ffmpeg が無くても動くが、映像と音声を1つにまとめるには要り、README は強く推奨している。


## どんなときに使うか

### 自分に見る権利のある動画や講義を、手元に残しておきたいとき

画質や音声だけの保存を条件で選べ、ファイル名と置き場所もテンプレートで決められる。再生リストのように本数が多いものを、決まった並びで保存したい場合に向く。**何を保存してよいかはサイトの規約と権利者しだいで、ツールが判断してくれるわけではない。**

### 自分のプログラムに、動画の情報取得や保存を組み込みたいとき

JSON で情報を出力する方法や、Python から部品として呼ぶ方法が用意されている。サイトごとの読み取り処理を自前で書かずに済む。


## 注意点

**配布の形によってライセンスが変わる。** README によれば、本体は Unlicense だが、配布される実行ファイルの多くにはほかのプロジェクトのコードが入っている。PyInstaller でまとめた実行ファイルは、全体としては GPLv3 以上の扱いになる。組み込んで再配布するなら、どの形で入手したものかを先に確かめたい。

**YouTube を十分に使うには追加の準備が要る。** README は、YouTube に十分対応するには `yt-dlp-ejs` と、それを動かす JavaScript の実行環境（deno を推奨、ほかに node.js・bun・QuickJS）が必要だとしている。ffmpeg も強く推奨されていて、入れるのは**同じ名前の Python パッケージではなく ffmpeg 本体**だと念を押している。

**プラグインは中身を確かめずに読み込まれる。** README によれば、プラグインは使わなくてもすべて読み込まれ、コードの検査も行われない。抽出器のプラグインは組み込みのものより優先される。信頼できるものだけ入れる前提の仕組みだ。
