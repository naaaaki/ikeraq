---
updated: 2026-09-05
image:
image_alt:
---

<!-- ============================================================
  averygan/reclip
  https://github.com/averygan/reclip
  Download videos from almost any website. Lightweight, self-hosted media downloader with a clean web UI.
  HTML / MIT / スター 8,104
============================================================ -->


## 見出しの一文

yt-dlp に画面を1枚かぶせて、家族にも渡せる形にする


## どういうものか

自分のマシンで動かす動画・音声のダウンローダ。ブラウザで開いた画面にURLを貼ると、MP4（映像）か MP3（音声だけ）で落ちてくる。複数のURLをまとめて貼れて、重複したものは自動でまとめられる。画質を選ぶ欄もある。対応サイトが「1000以上」と広いのは、**中で yt-dlp を呼んでいる**から。変換と画質の切り替えは ffmpeg が担う。

中身は驚くほど薄い。サーバー側は Flask のPythonが約150行。画面側はフレームワークもビルド手順も無い、HTML・CSS・JavaScript が1ファイル。直接の依存は Flask と yt-dlp の2つだけと書かれている。**つまりこのリポジトリが足しているのは、ダウンロード機能そのものではなく「画面」と「受付」の部分。** 中核の仕事は、すでに定評のある2つの道具に任せきっている。

動かし方も軽い。Homebrew や apt で必要なものを入れて `./reclip.sh` を叩くと、localhost の 8899 番で待ち受ける。Docker でも動く。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="ReClip の構成を示した図。左に「ブラウザの画面（URLを貼る）」があり、緑の矢印で「ReClip（約150行の受付。localhost:8899）」につながる。そこから点線の枠で囲まれた「既にある道具」の領域に矢印が伸び、その中に「yt-dlp（1000以上のサイトから取る）」と「ffmpeg（形式と画質を変える）」が並んでいる。さらに右へ矢印が伸び、「MP4 / MP3（手元のファイル）」に至る。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="rc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">足しているのは、<tspan fill="#1E5A48">画面と受付だけ</tspan></text>

  <rect x="24" y="186" width="150" height="92" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="99" y="224" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ブラウザの画面</text>
  <text x="99" y="246" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（URLを貼る）</text>

  <line x1="174" y1="232" x2="216" y2="232" stroke="#1E5A48" stroke-width="4" marker-end="url(#rc-arrow)" />

  <rect x="224" y="186" width="150" height="92" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="299" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ReClip</text>
  <text x="299" y="241" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（約150行の受付）</text>
  <text x="299" y="259" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">localhost:8899</text>

  <line x1="374" y1="232" x2="416" y2="232" stroke="#1E5A48" stroke-width="4" marker-end="url(#rc-arrow)" />

  <rect x="424" y="146" width="180" height="172" rx="10" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="7 6" />
  <text x="514" y="170" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">すでにある道具</text>
  <rect x="444" y="184" width="140" height="56" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="514" y="206" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">yt-dlp</text>
  <text x="514" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（1000以上のサイト）</text>
  <rect x="444" y="252" width="140" height="56" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="514" y="274" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">ffmpeg</text>
  <text x="514" y="294" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（形式と画質）</text>

  <line x1="604" y1="232" x2="646" y2="232" stroke="#1E5A48" stroke-width="4" marker-end="url(#rc-arrow)" />

  <rect x="654" y="186" width="126" height="92" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="717" y="224" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">MP4 / MP3</text>
  <text x="717" y="246" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（手元のファイル）</text>

  <text x="400" y="386" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">薄い部分だけを自分で持つので、対応サイトの追随は yt-dlp の更新にそのまま乗る</text>
</svg>

キャプション: 新しく作られているのは真ん中の一箱だけ。**やっていないことの多さ**が、このリポジトリの読みどころになっている。


## どんなときに使うか

### コマンドを覚えていない人にも渡したいとき

yt-dlp はそれ自体で完成した道具だが、使うにはターミナルと引数の知識が要る。ここに画面が付くと、URLを貼るだけの操作になる。**自分は困っていないが、家族や同僚が困っている**という場面がいちばん当てはまりそうに見える。

### 広告や余計な導線を通したくないとき

同じことをするウェブサービスは多いが、素性の分からない広告や余計なボタンが付いて回る。手元で動かす形にすると、そこを切り離せる。中身が数百行しかないので、**入れる前に自分で読み通せる**のも小さくない。


## 注意点

**使ってよいかは、落とす先の規約と著作権しだい。** 作者も「個人的な利用を想定している。落とす先のサイトの規約と著作権を尊重してほしい」と明記し、誤った使い方の責任は負わないとしている。技術的に落とせることと、落としてよいことは別の話になる。

**手元で動かす前提の作りに見える。** README にある起動方法は localhost の 8899 番で、認証やアクセス制限の話は出てこない。**共有のサーバーや外から届く場所に置くつもりなら、前に何か挟む必要がある**と考えておいたほうがよい。

**規模と体制は小さい。** 参加している人は4名ほどで、リリースのタグはまだ無く、未解決の issue は51件。薄い作りなので壊れても追いやすいが、**長く面倒を見てもらえる前提では置かないほうがよい。** ライセンスは MIT。

**GitHub の言語判定は HTML になっている。** 画面が1ファイルにまとまっているためで、実際に読む中身は Python とその中の JavaScript になる。
