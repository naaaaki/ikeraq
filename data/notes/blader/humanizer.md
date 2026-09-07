---
updated: 2026-09-07
image:
image_alt:
---

<!-- ============================================================
  blader/humanizer
  https://github.com/blader/humanizer
  Agent skill that removes signs of AI-generated writing from text
  Python / MIT / スター 43,430
============================================================ -->


## 見出しの一文

AIが書いた文章の癖を、言っている内容は変えずに抜く


## どういうものか

中身はプログラムではなく、**1枚の Markdown**（`SKILL.md`）。README にも「ただの Markdown なので、スキルに対応したエージェントならどれでも動く」と書かれている。このページには言語として Python と出るが、これは補助のスクリプトだけで、本体はその Markdown のほうになる。やることは、AIが書いたと分かる書き癖を抜いて人が書いたように読ませること。ただし条件が付いていて、README の言葉では「**言っていることは変えずに**（without changing what it says）」書き直す。

判断の物差しが外にあるのが特徴になっている。下敷きは Wikipedia の "Signs of AI writing" — WikiProject AI Cleanup が維持している、AI が書いた文章の見分け方をまとめた文書。そこから起こした型が5つの区分に分かれて並んでいる。断言せずに前置きで持ち上げる書き方、規則的すぎるリズム、大げさな語や借り物の権威づけ、機械的な体裁、チャットや下書きの名残。型の数は版によって変わっていて、3.0.0 で35個が25個にまとめられた。

書き直し方も手順として決まっている。まず全体を一度読んで**癖に印をつける**（強いものから順に）。次に、元の構成を動かしてよいものとして書き直す。そのうえで**書いた案を、型と元の主張の両方に照らし合わせる**。最後に清書する。ここで効いているのが、事実については何も足さないという縛りで、名前・数字・日付・引用・出典は元の文か書き手から来たものでなければ入れられず、足りないときは**でっち上げずに聞き返す**。渡された文章を「編集する材料」として扱い、その中の文を指示として読まない、とも書かれている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="原文に癖の印をつけ、書き直し、25の型と元の主張の両方に照らし合わせてから清書するまでの4段階の流れ図。照らし合わせの段は書き直しの段へ戻る矢印を持つ。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="hum-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">直す前に、<tspan fill="#1E5A48">癖に印をつける</tspan></text>
  <rect x="24" y="146" width="158" height="98" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="103" y="186" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">印をつける</text>
  <text x="103" y="210" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（強い癖から</text>
  <text x="103" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">順に）</text>
  <line x1="182" y1="195" x2="222" y2="195" stroke="#1E5A48" stroke-width="4" marker-end="url(#hum-arrow)" />
  <rect x="230" y="146" width="158" height="98" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="309" y="186" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">書き直す</text>
  <text x="309" y="210" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（構成は動かして</text>
  <text x="309" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">よい）</text>
  <line x1="388" y1="195" x2="428" y2="195" stroke="#1E5A48" stroke-width="4" marker-end="url(#hum-arrow)" />
  <rect x="436" y="146" width="176" height="98" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="524" y="186" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">照らし合わせる</text>
  <text x="524" y="210" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（25の型と、</text>
  <text x="524" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">元の主張の両方に）</text>
  <path d="M524 244 L524 288 L309 288 L309 246" fill="none" stroke="#1E5A48" stroke-width="4" stroke-dasharray="8 7" marker-end="url(#hum-arrow)" />
  <text x="416" y="312" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">残っていれば、書き直しに戻る</text>
  <line x1="612" y1="195" x2="652" y2="195" stroke="#1E5A48" stroke-width="4" marker-end="url(#hum-arrow)" />
  <rect x="660" y="146" width="116" height="98" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="718" y="186" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">清書する</text>
  <text x="718" y="210" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（言っている内容</text>
  <text x="718" y="228" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">は変えない）</text>
  <text x="400" y="384" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">足りない事実はでっち上げず、書き手に聞き返す。だから「書き直し」で止まる</text>
</svg>

キャプション: 印をつける段が先にあるのが要点。どこが引っかかるのかを言葉にしてから直すので、「なんとなく整えた文」にならずに済む。

## どんなときに使うか

### 下書きはAIに任せたが、そのままでは出せないとき

内容は合っているのに、読むと機械が書いたと分かってしまう。書き直しを頼むと今度は中身が変わる — という往復に、型と手順を与えたものになる。**事実を足さないという縛りがあるぶん、直したあとの確認が軽くなる。**

### 自分の書き癖を点検したいとき

25の型そのものが読み物として使える。前置きで持ち上げてから言う、リズムが規則的すぎる、大げさな語を足す — どれも人間にも起きる癖で、**通してもらわずに一覧を眺めるだけでも役に立つ。**


## 注意点

**AI検出をすり抜けるための道具ではない。** 書かれている狙いは、読んで引っかからない文章にすること。検出器に対して何かを保証するものではないし、README にも検出への言及はない。

**型の例は英語の文で示されている。** 下敷きの Wikipedia の文書も、`SKILL.md` に並ぶ実例も英語。日本語の文章に同じように効くかどうかは、**当サイトでは確かめていない**。日本語で使う場合は、まず短い文で様子を見たほうがよい。

**「意味を変えない」と「事実が正しい」は別。** 事実を足さない縛りはあるが、元の文が間違っていれば、間違ったまま読みやすくなる。**出す前に人が読み直す工程は、これを入れても減らない。**

**入れ方は複数ある。** `npx skills add` で入れる方法、Claude Code のプラグインとして入れる方法、ZIP をスキルとしてアップロードする方法が README に並んでいる。ライセンスは MIT。
