---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  Crosstalk-Solutions/project-nomad
  https://github.com/Crosstalk-Solutions/project-nomad
  Project NOMAD is an offline-first knowledge and education server.
  TypeScript / Apache-2.0 / スター 38,000台
============================================================ -->


## 見出しの一文

Wikipediaも授業も地図もAIも、回線が切れた家の中だけで動かす


## どういうものか

インターネットが無い場所でも使える**知識と教育のサーバー**を、自分の機械の上に丸ごと立てるための仕組みだ。Apache-2.0。入れられるのは Debian 系の OS で、README は Ubuntu 26.04 LTS を勧めつつ、24.04 LTS と Debian 12 にも対応すると書いている（Windows 向けには WSL2 を使う手順もあるが、こちらは利用者が支える扱いだと注記されている）。導入は端末の操作だけで完結し、**中身はすべてブラウザから使う**ので、デスクトップ環境を入れずにサーバーとして置き、別の端末からつなぐ形でもよい。

中心にあるのは「**コマンドセンター**」と呼ばれる管理画面と API で、これ自体が何かの資料を持っているわけではない。**Docker のコンテナとして配られている道具や資料を集めてきて、並べて面倒を見る**のが仕事だ。入れる・設定する・更新するところまで引き受ける。だから NOMAD 本体は軽く、重くなるかどうかは何を積むかで決まる。

積めるものは README に一覧がある。オフライン版の Wikipedia や医療の参考資料、電子書籍は Kiwix、Khan Academy の講座と進み具合の記録は Kolibri、地域ごとに落としておける地図は ProtoMaps、暗号化や符号化などのデータ処理は CyberChef、メモは FlatNotes が担う。AI との対話は Ollama で手元のモデルを動かすか、LM Studio や llama.cpp のような OpenAI 互換の口を持つものを指定する形で、**手元の文書を読み込ませて意味で探す仕組み**（Qdrant による RAG）も付く。ほかに、ハードウェアの点数を測って共有の順位表に載せる機能、ワンクリックで足せるアプリの目録（PDF の道具、ファイル閲覧、パスワード管理など）、自前の Docker コンテナを動かす口、そして**自分で有効にすれば、時間帯を決めて動かせる自動更新**がある（既定では動かない）。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「回線の外側に、まるごと積んでおく」とある図。左に「コマンドセンター（入れる・設定する・更新するを引き受ける）」があり、矢印で右の4つの箱につながっている。箱は「資料（Wikipedia・医療・書籍）」「授業（講座と進み具合）」「地図（地域ごとに落とす）」「AI（手元のモデルと文書検索）」。コマンドセンターの下に「中身はDockerのコンテナとして入る」とある。いちばん下に「つながるのは、入れるときと資料を足すときだけ」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="nm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">回線の外側に、<tspan fill="#1E5A48">まるごと積んでおく</tspan></text>

  <rect x="24" y="168" width="212" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="130" y="206" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">コマンドセンター</text>
  <text x="130" y="232" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（入れる・設定する・</text>
  <text x="130" y="250" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">更新するを引き受ける）</text>

  <line x1="240" y1="224" x2="292" y2="224" stroke="#1E5A48" stroke-width="4" marker-end="url(#nm-arrow)" />

  <rect x="300" y="122" width="230" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="415" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">資料</text>
  <text x="415" y="176" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（Wikipedia・医療・書籍）</text>

  <rect x="550" y="122" width="230" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="665" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">授業</text>
  <text x="665" y="176" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（講座と進み具合）</text>

  <rect x="300" y="216" width="230" height="76" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="415" y="246" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">地図</text>
  <text x="415" y="270" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（地域ごとに落とす）</text>

  <rect x="550" y="216" width="230" height="76" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="665" y="246" text-anchor="middle" font-size="14" font-weight="700" fill="#1E5A48">AI</text>
  <text x="665" y="270" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（手元のモデルと文書検索）</text>

  <line x1="130" y1="286" x2="130" y2="320" stroke="#1E5A48" stroke-width="4" marker-end="url(#nm-arrow)" />
  <text x="130" y="344" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">中身はDockerのコンテナとして入る</text>

  <text x="400" y="412" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">つながるのは、入れるときと資料を足すときだけ</text>
</svg>

キャプション: 資料を配るのではなく、**資料を配る側の設備を一式そろえる**という作り。何を積むかで、必要な機械の大きさも変わる。


## どんなときに使うか

### 回線が落ちても、手元に調べられるものを残しておきたいとき

Wikipedia や医療の参考資料、書籍を落としておけば、つながらなくても読める。README は、インターネットが要るのは最初に入れるときと、あとから資料や道具を足すと決めたときだけで、**それ以外では不要**だと書いている。

### 家庭や教室で、子どもの学習環境をネットから切り離したいとき

Khan Academy の講座を進み具合の記録つきで動かせて、複数人で使える。外のネットワークから切り離した形で置いておける。


## 注意点

**認証が無い。** README は、これを設計上の選択だと明言している。誰でも障壁なく使えることを狙っているため、**利用者を確かめる仕組みは入っていない**。ネットワーク側でポートを開け閉めして範囲を絞ることが推奨されていて、インターネットに直接さらす使い方については「リスクを理解し、相応の対策を取ったうえで、本当に分かっている場合を除き強く勧めない」と書かれている。今後入るかどうかについては「**現時点では優先事項ではない**」と書かれていて、要望が十分に集まれば検討するかもしれない、という段階にとどまる。公開のロードマップには利用者からの提案として載っていて、賛成票を募っている。

**AI まで動かすなら、機械はそれなりに要る。** 管理アプリだけなら2GHz の2コア・メモリ4GB・空き5GB で足りる、と README は書いている。ただし AI を使う構成として挙げられているのは、Ryzen 7 や Core i7 以上、メモリ32GB、RTX 3060 相当以上の GPU、空き250GB 以上（README は「できれば SSD」と書いている）。**似た用途の「最低限の構成の機械で動かす」ものとは逆の方向**を向いている、と README 自身が断っている。

**外部への通信がゼロというわけではない。** 組み込みの計測（テレメトリ）は無いと明記されている一方、つながっているかどうかの確認のために Cloudflare の `1.1.1.1` の確認用の口を叩き、届かなければ GitHub の API と NOMAD の API に切り替える。この宛先は設定画面か環境変数で差し替えられる。

**更新の扱いに線が引かれている。** 本体（コマンドセンター）が自分自身を更新する場合、自動で入るのは細かい版だけで、**大きな版の更新は必ず手動**になる。更新の時間帯や待ち時間は設定でき、空き容量などの事前確認を通ったときだけ動く。導入には root 権限が要る点も、置く場所を決める前に見ておきたい。

**開いているものはそれなりにある。** issue とプルリクエストを合わせて100件に近い。2025年6月から続いていて、更新は活発だ。
