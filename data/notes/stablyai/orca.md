---
updated: 2026-09-03
image:
image_alt:
---

## 見出しの一文

同じ課題を複数のエージェントに同時にやらせて、勝った一つだけを取り込む

## どういうものか

複数のコーディングエージェントをまとめて動かすためのデスクトップアプリです。Claude Code、Codex、Copilot など30以上の CLI エージェントを対象にしていて、どれか一つに寄せるのではなく、**同じ課題を何本か並べて走らせることを前提に作られています。**

仕掛けの中心は **git の worktree** です。エージェントごとに別々の作業ツリーを割り当てるので、同じリポジトリの同じファイルを同時に触らせても、互いを踏みません。走り終わったら差分を並べて見比べ、良かったものを一つ選んでマージする、という流れになります。差分にはコメントを付けられるので、「ここだけ直して」と同じツリーへ戻すこともできます。

周りには開発中に画面を離れずに済むための道具が揃っています。WebGL で描くターミナル、UI を要素単位で調べられる Chromium の内蔵ブラウザ、GitHub と Linear の連携、SSH 経由でリモートのマシンにエージェントを走らせる機能、そして進み具合を外から見るためのスマホアプリです。macOS・Windows・Linux 版があり、CLI からも操作できます。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="ひとつの課題が3つのエージェントに分かれ、それぞれ独立した git worktree の中で作業し、出てきた3つの差分を見比べて1つだけをマージする流れの図。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="56" text-anchor="middle"
          style="font-family: var(--jp); font-size: 28px; font-weight: 700; fill: #17160F;">
      ひとつの課題を<tspan style="fill: #1E5A48;">並べて走らせ</tspan>、勝った一つを取る
    </text>

    <!-- 課題 -->
    <rect x="40" y="188" width="118" height="76" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <rect x="64" y="212" width="70" height="8" rx="4" fill="#17160F" opacity=".22"/>
    <rect x="64" y="230" width="46" height="8" rx="4" fill="#17160F" opacity=".22"/>

    <!-- 分岐 -->
    <path d="M170 226 C 200 226, 200 138, 232 138" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M232 127 l18 11 -18 11 z" fill="#1E5A48"/>
    <path d="M170 226 H232" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M232 215 l18 11 -18 11 z" fill="#1E5A48"/>
    <path d="M170 226 C 200 226, 200 314, 232 314" fill="none" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M232 303 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 3つの worktree -->
    <rect x="262" y="106" width="196" height="64" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <circle cx="292" cy="138" r="11" fill="#1E5A48"/>
    <text x="380" y="144" text-anchor="middle" style="font-family: var(--mono); font-size: 17px; fill: #17160F;">worktree A</text>

    <rect x="262" y="194" width="196" height="64" rx="10" fill="#FFFFFF" stroke="#1E5A48" stroke-width="3"/>
    <circle cx="292" cy="226" r="11" fill="#1E5A48"/>
    <text x="380" y="232" text-anchor="middle" style="font-family: var(--mono); font-size: 17px; fill: #17160F;">worktree B</text>

    <rect x="262" y="282" width="196" height="64" rx="10" fill="#FFFFFF" stroke="#17160F" stroke-width="2.5"/>
    <circle cx="292" cy="314" r="11" fill="#1E5A48"/>
    <text x="380" y="320" text-anchor="middle" style="font-family: var(--mono); font-size: 17px; fill: #17160F;">worktree C</text>

    <!-- 合流 -->
    <path d="M470 138 C 506 138, 506 226, 540 226" fill="none" stroke="#17160F" stroke-width="3" stroke-linecap="round" opacity=".28"/>
    <path d="M470 314 C 506 314, 506 226, 540 226" fill="none" stroke="#17160F" stroke-width="3" stroke-linecap="round" opacity=".28"/>
    <path d="M470 226 H540" stroke="#1E5A48" stroke-width="4" stroke-linecap="round"/>
    <path d="M540 215 l18 11 -18 11 z" fill="#1E5A48"/>

    <!-- 見比べて取り込む -->
    <rect x="574" y="182" width="186" height="88" rx="12" fill="#1E5A48"/>
    <text x="667" y="222" text-anchor="middle" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #FFFFFF;">差分を見比べて</text>
    <text x="667" y="248" text-anchor="middle" style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #FFFFFF;">1つをマージ</text>

    <!-- ラベル -->
    <text x="99" y="304" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">課題</text>
    <text x="99" y="326" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（1つ）</text>

    <text x="360" y="380" text-anchor="middle" style="font-family: var(--jp); font-size: 19px; font-weight: 700; fill: #17160F;">エージェント3体</text>
    <text x="360" y="402" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（作業ツリーが別なので踏み合わない）</text>

    <text x="667" y="304" text-anchor="middle" style="font-family: var(--jp); font-size: 15px; fill: #6E6A5F;">（残りは捨てる）</text>

    <text x="400" y="434" text-anchor="middle" style="font-family: var(--jp); font-size: 18px; fill: #514D45;">
      〜 どれが当たるか分からないなら、当ててから選ぶ 〜
    </text>
  </svg>
</figure>

キャプション:

3本走らせて2本を捨てる作りです。**無駄が出ることを承知のうえで、待ち時間を短くしている**——そこが、1本ずつ試して直す進め方との一番の違いです。

## どんなときに使うか

### どのエージェントに投げるか毎回迷っているとき

モデルや道具ごとに得意が違うので、投げ先を決め打ちすると外したときに丸ごとやり直しになります。並べて走らせれば、選ぶ判断を**結果を見たあと**に回せます。

### エージェントを走らせている間、席を離れたいとき

長く走る作業をしかけて放置し、スマホから様子を見る、という使い方が想定されています。SSH でリモートのマシンに走らせる機能もあるので、手元のノートPCを閉じても止まらない構成にできます。

## 注意点

**費用は素直に増えます。** 3本並べれば、API の料金もマシンの負荷も3本ぶんです。捨てる前提の作りなので、使う側が「何本まで並べるか」を決めることになります。

**デスクトップアプリです。** 手元にインストールして使うもので、ブラウザで完結する類のものではありません。走らせるエージェントの契約と認証は、それぞれ別途必要になります。

**まだ新しい道具です。** 対応エージェント30以上、内蔵ブラウザ、スマホアプリ、と守備範囲が広く、そのぶん個々の作り込みの深さは実際に触って確かめる必要があります。ライセンスは MIT です。
