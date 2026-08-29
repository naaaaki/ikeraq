---
updated: 2026-08-30
image:
image_alt:
---

## 見出しの一文

モデルもツールも、エージェントの本体すら差し替えられる

## どういうものか

DeepSeek が公開した、AIエージェントの土台（ハーネス）です。Claude Code や Cursor のような「AIにコードを書かせる道具」の、中身にあたる部分だと考えると近いです。8月13日の公開から2週間あまりで、スターが20万を超えました。

特徴は**「すべてがプラグイン」という構造**です。ふつうこの手の道具は、中心となる本体があり、その周りに拡張を足していく形になります。DeepSeek Harness にはその中心がありません。モデルとのやりとり、使える道具の一覧、会話の記録、そして**エージェントが考えて動く輪（ループ）そのもの**まで、すべてが対等なプラグインとして並んでいます。設計文書は「手を入れるべき特権的な中核は存在しない」と言い切っています。

拡張の仕方も、本体を書き換えるのではなく、**すでにあるプラグインの隣にもう1つ置く**という形になります。取り外すと、そのプラグインが加えた変更は元に戻ります。土台には Cordis という別のプロジェクトが使われていて、その考え方は論文としても公開されています。起動時の構成は「プロファイル」という名前で保存され、ブラウザで使う `web`、一度きり実行する `headless`、他のプログラムから呼ぶ `sdk` などが最初から用意されています。

## 図

<figure>
  <svg viewBox="0 0 800 450" role="img"
       aria-label="左右を比べた図。左は「ふつうのエージェント」で、中央に黒い「中核」の箱があり、その周りに4つの小さな拡張が並んでいる。中核には触れず、拡張は周りに足すだけと書かれている。右は「DeepSeek Harness」で、同じ大きさの部品が6つ対等に並び、そのうち「考える輪」も他と同じ1つの部品として置かれている。触れない部分がひとつもない、という構造の違いを示している。">
    <rect width="800" height="450" fill="#FFFFFF"/>

    <text x="400" y="62" text-anchor="middle"
          style="font-family: var(--jp); font-size: 30px; font-weight: 700; fill: #17160F;">
      中核がない。だから<tspan style="fill: #1E5A48;">ぜんぶ差し替えられる</tspan>
    </text>

    <!-- 仕切り -->
    <path d="M400 104 V336" stroke="#17160F" stroke-width="1.5" opacity=".14"/>

    <!-- ── 左：ふつうのエージェント ── -->
    <text x="215" y="128" text-anchor="middle"
          style="font-family: var(--jp); font-size: 18px; font-weight: 700; fill: #17160F;">ふつうのエージェント</text>

    <path d="M137 175 H155" stroke="#17160F" stroke-width="2" opacity=".3"/>
    <path d="M137 223 H155" stroke="#17160F" stroke-width="2" opacity=".3"/>
    <path d="M275 175 H293" stroke="#17160F" stroke-width="2" opacity=".3"/>
    <path d="M275 223 H293" stroke="#17160F" stroke-width="2" opacity=".3"/>

    <rect x="79" y="156" width="58" height="38" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2" opacity=".35"/>
    <rect x="79" y="204" width="58" height="38" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2" opacity=".35"/>
    <rect x="293" y="156" width="58" height="38" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2" opacity=".35"/>
    <rect x="293" y="204" width="58" height="38" rx="6" fill="#FFFFFF" stroke="#17160F" stroke-width="2" opacity=".35"/>

    <rect x="155" y="156" width="120" height="86" rx="10" fill="#17160F"/>
    <text x="215" y="206" text-anchor="middle"
          style="font-family: var(--jp); font-size: 20px; font-weight: 700; fill: #FFFFFF;">中核</text>

    <text x="215" y="286" text-anchor="middle"
          style="font-family: var(--jp); font-size: 16px; fill: #17160F; opacity: .62;">中核には触れない</text>
    <text x="215" y="311" text-anchor="middle"
          style="font-family: var(--jp); font-size: 16px; fill: #17160F; opacity: .62;">拡張は周りに足すだけ</text>

    <!-- ── 右：DeepSeek Harness ── -->
    <text x="590" y="128" text-anchor="middle"
          style="font-family: var(--mono); font-size: 18px; font-weight: 500; fill: #1E5A48;">DeepSeek Harness</text>

    <rect x="464" y="156" width="76" height="42" rx="6" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2"/>
    <text x="502" y="182" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">モデル</text>

    <rect x="552" y="156" width="76" height="42" rx="6" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2"/>
    <text x="590" y="182" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">道具</text>

    <rect x="640" y="156" width="76" height="42" rx="6" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2"/>
    <text x="678" y="182" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">記録</text>

    <rect x="464" y="210" width="76" height="42" rx="6" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2"/>
    <text x="502" y="236" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">設定</text>

    <rect x="552" y="210" width="76" height="42" rx="6" fill="#FFFFFF" stroke="#1E5A48" stroke-width="2"/>
    <text x="590" y="236" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; fill: #17160F;">画面</text>

    <rect x="640" y="210" width="76" height="42" rx="6" fill="#1E5A48"/>
    <text x="678" y="236" text-anchor="middle" style="font-family: var(--jp); font-size: 14px; font-weight: 700; fill: #FFFFFF;">考える輪</text>

    <text x="590" y="286" text-anchor="middle"
          style="font-family: var(--jp); font-size: 16px; fill: #17160F; opacity: .62;">すべて対等に並ぶ</text>
    <text x="590" y="311" text-anchor="middle"
          style="font-family: var(--jp); font-size: 16px; fill: #17160F; opacity: .62;">考える輪も、ただの部品</text>

    <text x="400" y="396" text-anchor="middle"
          style="font-family: var(--jp); font-size: 18px; fill: #17160F; opacity: .8;">
      〜 触れない部分が、ひとつもない 〜
    </text>
  </svg>
</figure>

キャプション:

左と右で、変えられる範囲が違います。ふつうは中核が固定されていて、利用者が触れるのは周りの拡張だけ。DeepSeek Harness は「考える輪」まで並びの中にあるので、エージェントの動き方そのものを別のものに置き換えられます。

## どんなときに使うか

### エージェントの動き方そのものを、自分で決めたいとき

多くのエージェントは、考えて・道具を使って・結果を見て、という流れが決め打ちになっていて、利用者が触れるのは設定の範囲に限られます。この流れ自体がプラグインとして外に出ているので、独自の進め方を試したい場合に、本体を書き換えずに差し替えられます。

### 使うモデルを、あとから入れ替える前提で組みたいとき

モデルとのやりとりもプラグインの1つです。DeepSeek 製ですが、DeepSeek のモデル専用というつくりにはなっていません。特定のモデルに縛られたくない、という要件が先にある場合に選択肢に入ります。

## 注意点

**まだ実験段階だと、作者自身が明記しています。** 開発者向けプレビューであり、「**互換性を壊す変更が必ず入る**」と大文字で書かれています。仕事で使うものの土台に据えるには早い段階です。

**安全性の審査を受けていない、と書かれています。** 別文書（SAFETY.md）に、セキュリティ監査を受けておらず本番向けとみなしてはならない、と明記されています。この種の道具はモデルが生成したコマンドを実行し、外部のプラグインを読み込み、手元のファイルや資格情報に触れます。そのうえで「サンドボックスや承認画面は危険を減らすが、隔離を保証するものではない」とも書かれています。使い捨ての仮想マシンや専用の環境で動かすことが推奨されています。

**評価が固まるにはまだ早い時期です。** 公開から2週間あまりで20万スターというのは、中身が検証された結果というより、DeepSeek という名前への注目が大きいと見るのが自然です。リリースは5回、関わっている開発者は40人ほど。未解決の Issue が0件なのは問題がないからではなく、不具合や要望の受け口を GitHub Discussions のほうに置いているためです。

ライセンスは MIT で、商用利用の妨げになる条項はありません。
