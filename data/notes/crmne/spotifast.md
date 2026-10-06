---
updated: 2026-10-07
image:
image_alt:
---

<!-- ============================================================
  crmne/spotifast
  https://github.com/crmne/spotifast
  Spotify, native and fast. One lightweight Rust app for your whole library, local playback, and Spotify Connect on Linux, macOS, and Windows.
  Rust / MIT / スター 5,483
  topics: audio, cross-platform, desktop-app, egui, gui, librespot, linux, macos, mpris, music, music-player, rust, spotify, spotify-client, spotify-connect, windows

============================================================ -->


## 見出しの一文

Spotify を、ブラウザの部品を積まない軽いアプリで聴く


## どういうものか

Spotify を聴くためのデスクトップアプリで、Rust と egui で書かれている。Spotify とは関係のない、独立したプロジェクトの非公式アプリだ。中にブラウザの部品を持たない作りで、README によるとメモリの使用量はふつう 100〜250MB、起動は1秒を大きく下回る。Linux、macOS、Windows で動く。

音を鳴らす部分には、Spotify 公式アプリと同じ通信方式で Spotify につなぐオープンソースの librespot を使い、プレイリストやライブラリ、検索といったデータの多くは Spotify が公開している Web API から取ってくる（他人のプレイリストやプレイリストのフォルダなど、一部は librespot 経由で読む）。起動中のパソコンは Spotify Connect の再生先の1つとして見えるので、スマホの Spotify アプリから再生先に選ぶこともできる。逆に Spotifast から、スピーカーやスマホなど別の機器に再生を移して操作することもできる。

プレイリストの作成・編集・並べ替え、お気に入りの曲や保存したアルバム、ポッドキャストの一覧、検索といった、ふだん使う機能はそろっている。ウィンドウを閉じてもタスクトレイで鳴り続け、キーボードのメディアキーで操作できる。配色は明るい・暗い・自分で決めた色から選べる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「再生は librespot、データは主に Web API から」とある図。左の「Spotify（Premium のアカウント）」から、「librespot（音と一部のデータ）」と「Web API（プレイリスト・検索）」の2つに矢印が伸び、どちらも右の「Spotifast（1つの画面にまとめる）」につながる。下に「音が出せるのは Premium だけ。無料アカウントは一覧と検索まで」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="spf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">再生は <tspan fill="#1E5A48">librespot</tspan>、データは主に <tspan fill="#1E5A48">Web API</tspan> から</text>

  <rect x="40" y="170" width="190" height="110" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="135" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Spotify</text>
  <text x="135" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（Premium のアカウント）</text>

  <line x1="236" y1="205" x2="294" y2="160" stroke="#1E5A48" stroke-width="4" marker-end="url(#spf-arrow)" />
  <line x1="236" y1="245" x2="294" y2="290" stroke="#1E5A48" stroke-width="4" marker-end="url(#spf-arrow)" />

  <rect x="300" y="110" width="200" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="145" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">librespot</text>
  <text x="400" y="170" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（音と一部のデータ）</text>

  <rect x="300" y="260" width="200" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="295" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">Web API</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（プレイリスト・検索）</text>

  <line x1="506" y1="160" x2="564" y2="205" stroke="#1E5A48" stroke-width="4" marker-end="url(#spf-arrow)" />
  <line x1="506" y1="290" x2="564" y2="245" stroke="#1E5A48" stroke-width="4" marker-end="url(#spf-arrow)" />

  <rect x="570" y="170" width="190" height="110" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="665" y="218" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">Spotifast</text>
  <text x="665" y="244" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（1つの画面にまとめる）</text>

  <text x="400" y="400" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">音が出せるのは Premium だけ。無料アカウントは一覧と検索まで</text>
</svg>

キャプション: 公式の部品と、公式アプリと同じ方式でつなぐ部品を組み合わせている。公式サイトによると、どちらにも無い機能は、基本的に Spotifast にも足せない。


## どんなときに使うか

### Spotify を流しっぱなしにしながら、ほかの重い作業をしたいとき

メモリの使用量が少なめで、ウィンドウを閉じてもタスクトレイで鳴り続ける。

### マウスに手を伸ばさずに、音楽を操作したいとき

キーボードのショートカットとメディアキーのほか、コマンドラインからも操作できる。


## 注意点

**再生には Spotify Premium が必要。** 無料アカウントでも一覧と検索はできるが、このパソコンでの再生も、別の機器での再生の操作もできない。広告を消したり、無料アカウントで Premium の機能を使えるようにしたりするものではない。

**非公式のアプリである。** 作者は「Spotifast や同じ librespot を使うアプリでの通常の Premium 再生で、アカウント停止が確認された例は把握していない」としつつ、Spotify の今後の判断は保証できないと書いている。Spotify 側の変更で、アプリが更新されるまで再生が止まることもある。

**ロスレス（Spotify Lossless）は聴けない。** 音質は最高 320kbps まで。ビデオポッドキャストにも対応していない。
