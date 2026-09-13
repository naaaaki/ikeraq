---
updated: 2026-08-31
image:
image_alt:
---

## 見出しの一文

SEOツールの固定月額を、使った分だけの従量課金に置き換える

## どういうものか

キーワード調査、順位の追跡、競合の分析、被リンク、サイト監査、AI 検索での見え方までをひととおり持つ SEO 分析基盤です。リポジトリの説明で、Semrush や Ahrefs の代替を掲げています。

構造の肝は、**データを自分で集めていない**ことです。順位や被リンクのデータは DataForSEO という外部サービスから取ります。利用者は自分の DataForSEO のキーを用意して差し込みます。OpenSEO はその上に載る画面と、束ねる仕組みです。だから料金が「月額いくら」ではなく「叩いた分だけ」になります。使う頻度が低いほど効いてくる形です。

置き方は2通り。Docker で手元に立てて試すか、Cloudflare に載せて外から使えるようにするか。README は前者を「まず試すなら」、後者を外向けの推奨として区別しています。MCP に対応しているので、Claude Code のようなエージェントから叩く使い方も想定されています。

## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「道具は同じ。変わるのは、誰に払うか」とある図。左に「あなた」があり、そこから2本の道が出ている。上は「ホスト版（openseo.so）」で、無料で試せる、支援したいなら月10ドル、DataForSEO への請求に +28% と書かれている。下は「自分で立てる（Cloudflare / Docker）」で、月額なし、DataForSEO へ直接払う、運用は自分持ち と書かれている。2本はどちらも右の「DataForSEO（順位・被リンクの出どころ）」に合流する。下に「オープンソースでも、データ代は消えない。消えるのは上乗せのほう」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="os-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">道具は同じ。変わるのは、<tspan fill="#1E5A48">誰に払うか</tspan></text>

  <rect x="20" y="190" width="130" height="80" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="85" y="236" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">あなた</text>

  <path d="M 150 214 L 196 214 L 196 148" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#os-arrow)" />
  <path d="M 150 246 L 196 246 L 196 312" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#os-arrow)" />

  <rect x="212" y="100" width="286" height="112" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="355" y="130" text-anchor="middle" font-size="15" font-weight="700" fill="#1E5A48">ホスト版（openseo.so）</text>
  <text x="355" y="156" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">無料で試せる</text>
  <text x="355" y="176" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">支援したいなら月10ドル</text>
  <text x="355" y="196" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1E5A48">DataForSEO への請求に +28%</text>

  <rect x="212" y="248" width="286" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.35" stroke-width="1.5" />
  <text x="355" y="278" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">自分で立てる（Cloudflare / Docker）</text>
  <text x="355" y="304" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">月額なし</text>
  <text x="355" y="324" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">DataForSEO へ直接払う</text>
  <text x="355" y="344" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.85">運用は自分持ち</text>

  <path d="M 498 156 L 560 156 L 560 230" fill="none" stroke="#1E5A48" stroke-width="3" />
  <path d="M 498 304 L 560 304 L 560 230" fill="none" stroke="#1E5A48" stroke-width="3" />
  <line x1="560" y1="230" x2="616" y2="230" stroke="#1E5A48" stroke-width="4" marker-end="url(#os-arrow)" />

  <rect x="624" y="180" width="156" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.35" stroke-width="1.5" />
  <text x="702" y="216" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">DataForSEO</text>
  <text x="702" y="242" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（順位・被リンクの</text>
  <text x="702" y="260" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">出どころ）</text>

  <text x="400" y="404" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">オープンソースでも、データ代は消えない。消えるのは上乗せのほう</text>
</svg>

キャプション: どちらの道を選んでも、データの出どころは同じ1社。**選んでいるのは機能ではなく、支払い先と手間の配分**だ。


## どんなときに使うか

### 使う頻度は低いのに、SEOツールの月額が重いとき

月に数回しか見ないのに固定費が出ていく、という状態がいちばん噛み合いません。従量に変えられるなら、そこがそのまま効きます。

### 順位や被リンクの記録を、自分の手元に貯めたいとき

自分のデータベースに入るので、過去の推移を自分の形で持てます。サービスを解約したら履歴も消える、という状態を避けたいときの選択肢です。

## 注意点

**データ源は自分のものではありません。** DataForSEO のキーが必須で、そこが値上げしたり止まったりすれば、この道具も影響を受けます。「オープンソースだから無料」ではなく、**払う相手が変わるだけ**だと理解しておく必要があります。

**自分で立てる場合、勧められている道が限られています。** README は、チームや複数の機器から使うなら Cloudflare を勧め、Railway・Coolify・Dokploy よりも Cloudflare を勧める、という書き方をしていて（他のアプリを自分で運用し慣れている人は別）、それらは数か月のうちに簡単にする予定だとしています。Docker の手順は手元で試す用という位置づけです。何ができるかの一覧はありますが、対象外の機能までは並んでいないので、必要な機能は実際に確かめる工程が要ります。

**ホスト版は無料で試せます。月10ドルの購読は、プロジェクトを支援したい人向けだと README にあります。** 費用の本体はそこではなく、ホスト版を使うと DataForSEO への請求1回ごとに28%が上乗せされる点です。自分で立てれば DataForSEO へ直接払う形になり、この上乗せは消えます。つまり「月額をゼロにする」話ではなく、**どこに、いくら払うかを選び直す**話です。

ライセンスは MIT です。
