---
updated: 2026-09-12
image:
image_alt:
---

<!-- ============================================================
  D4Vinci/Scrapling
  https://github.com/D4Vinci/Scrapling
  🕷️ An adaptive Web Scraping framework that handles everything from a single request to a full-scale crawl!
  Python / BSD-3-Clause / スター 80,298
  topics: ai, ai-scraping, automation, crawler, crawling, crawling-python, data, data-extraction, mcp, mcp-server, playwright, python, scraping, selectors, stealth, web-scraper, web-scraping, web-scraping-python, webscraping, xpath
============================================================ -->


## 見出しの一文

サイトの作りが変わっても、取り出す場所を自力で探し直す


## どういうものか

Scrapling は Python のスクレイピング一式。ページを取ってくる部分、HTML から値を抜く部分、リンクをたどって巡回する部分が、ひとつの中に入っている。名前にある「適応（adaptive）」が指しているのは、**サイトの作りが変わって指定が外れたときに、要素を探し直す仕組み**のことだ。

普通のスクレイパーは、`div.price` のような**場所の指定**で値を取る。だから相手がデザインを直してクラス名が変わった途端、何も取れなくなる。しかも多くの場合、例外ではなく「空っぽ」で返るので、壊れたことにしばらく気づかない。Scrapling は値を取るときに、その要素そのものの特徴（タグ、属性、周りとの位置関係、中の文字）を控えておく。次に走らせて指定が空振りしたら、控えた特徴に似た要素をページ全体から探し当てる。README はこれを「intelligent similarity algorithms」と呼んでいる。

取得の口は3つある。素の HTTP で取る `Fetcher`、検知をかわす方向に振った `StealthyFetcher`（README は Cloudflare Turnstile への対応を挙げている）、Playwright で実際のブラウザを動かす `DynamicFetcher`。書き換えるのは1行なので、軽い方法から始めて、駄目なときだけ重い方に寄せられる。巡回のほうは Scrapy に似た `Spider` の形で、相手の応答の速さを見て1ドメインごとの間隔を自動で調整する仕組み（AutoThrottle）、途中で止めて再開するための記録、robots.txt の尊重が入っている。出力は JSON / JSONL / CSV / XML。MCP サーバとしても動くので、エージェントから呼ぶこともできる。


## 図

<svg viewBox="0 0 800 430" role="img" aria-label="Scrapling の適応の図。左に「1回目」の箱があり、値を取ると同時にその要素の特徴（タグ・属性・位置・文字）を控えると書かれている。中央に「サイトが変わる」の箱があり、クラス名が price から cost に変わった例が描かれ、普通のスクレイパーはここで空になると添えられている。右に「2回目」の箱があり、指定が空振りしたら控えた特徴に似た要素を探し、取り直すと書かれている。中央から右へ向かう矢印に「空振り」と書かれている。下に、壊れたことに気づかないまま空のデータが溜まるのを防ぐと添えられている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="sc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="430" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">指定が外れたら、<tspan fill="#1E5A48">似ている要素</tspan>を探し直す</text>

  <rect x="20" y="112" width="222" height="208" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="131" y="148" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">1回目</text>
  <text x="131" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（取れている状態）</text>
  <text x="131" y="212" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">div.price から取る</text>
  <text x="131" y="248" text-anchor="middle" font-size="13" fill="#1E5A48" font-weight="700">同時に、その要素の</text>
  <text x="131" y="270" text-anchor="middle" font-size="13" fill="#1E5A48" font-weight="700">特徴を控えておく</text>
  <text x="131" y="296" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">タグ・属性・位置・文字</text>

  <line x1="242" y1="216" x2="282" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#sc-arrow)" />

  <rect x="289" y="112" width="222" height="208" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="400" y="148" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">サイトが変わる</text>
  <text x="400" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（相手の都合・予告なし）</text>
  <text x="400" y="216" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">div.price</text>
  <text x="400" y="240" text-anchor="middle" font-size="15" fill="#17160F" fill-opacity="0.55">↓</text>
  <text x="400" y="264" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">div.cost</text>
  <text x="400" y="298" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">普通はここで空になる</text>

  <line x1="511" y1="216" x2="551" y2="216" stroke="#1E5A48" stroke-width="4" marker-end="url(#sc-arrow)" />
  <text x="531" y="202" text-anchor="middle" font-size="11.5" fill="#1E5A48" font-weight="700">空振り</text>

  <rect x="558" y="112" width="222" height="208" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="669" y="148" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">2回目</text>
  <text x="669" y="172" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（探し直す）</text>
  <text x="669" y="212" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">控えた特徴に</text>
  <text x="669" y="234" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.85">似た要素をページ全体から</text>
  <text x="669" y="270" text-anchor="middle" font-size="13" fill="#1E5A48" font-weight="700">見つけて取り直す</text>
  <text x="669" y="296" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">指定の書き換えは要らない</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">止まるのではなく「空のまま動き続ける」のが、スクレイパーのいちばん厄介な壊れ方</text>
</svg>

キャプション: 手を入れる回数を減らす道具、というより、**壊れたことに気づかないまま空のデータが溜まる**状態を減らす道具。定期実行しているものほど効く。


## どんなときに使うか

### 定期的に回しているスクレイパーが、ある朝だけ黙って空を返すのを減らしたいとき

相手のデザイン変更は予告なく来る。控えた特徴から探し直せれば、**気づいて直すまでの空白**を埋められる。毎日走らせているもの、他人の運用に組み込んだものほど、この差が大きい。

### 軽い取得で始めて、駄目なときだけブラウザに寄せたいとき

`Fetcher` と `DynamicFetcher` は同じ使い方で入れ替わる。最初からブラウザを立てずに済むので、**動いたページはそのまま安く回して**、動かなかったページだけ重い方法に切り替えられる。


## 注意点

**探し直せることは、正しく取れることの保証ではない。** 似た要素を当てるので、似た要素が複数あれば別のものを拾う余地がある。取れた値が想定どおりか（数字か、桁は妥当か）を自分の側で確かめる作りにしておいたほうがいい。

**検知をかわす機能が入っている。** 使う相手の利用規約と robots.txt の確認は使う側の責任になる。README 自身も、教育・研究目的であること、サイトの規約と robots.txt を尊重することを明記している。

**インストールが2段階。** `pip install scrapling` だけだと解析部分しか入らず、取得部分を import すると `ModuleNotFoundError` になる。取得まで使うなら `pip install "scrapling[fetchers]"` に加えて `scrapling install` でブラウザ側を入れる。README によれば Python 3.10 以上が要る。

ライセンスは BSD-3-Clause。商用利用も含めて扱いやすい部類だが、再配布時に著作権表示を残す条件が付く。
