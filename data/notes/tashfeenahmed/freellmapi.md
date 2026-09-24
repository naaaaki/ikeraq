---
updated: 2026-09-24
image:
image_alt:
---

<!-- ============================================================
  tashfeenahmed/freellmapi
  https://github.com/tashfeenahmed/freellmapi
  7.4 billion tokens per month. 34 free LLM providers. 635 free model endpoints. All behind one /v1 endpoint, plus any custom OpenAI-compatible endpoint. Smart routing, automatic failover, encrypted keys. Personal experimentation only.
  TypeScript / MIT / スター 28,000台
  

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

各社のLLMの無料枠を1つの入口に束ね、上限に来たら次へ回す


## どういうものか

各社が用意している LLM の無料枠を、手元で動かす1台のサーバーにまとめるツールだ。自分で取得した各社の API キーを登録すると、アプリからは **OpenAI 互換の入口1つと、専用のキー1本**で呼べるようになる。Anthropic 形式の入口もあり、README は Claude Code を無料枠のモデルに向けて動かせるとしている。README の時点で、対応先の一覧は34社・無料で使える窓口635件、各社の無料枠を足し合わせると月におよそ74億トークンになるという。

中身の中心は**ルーター**だ。リクエストが来るたびに、予備の順番の上から、キーが正常で、1分・1日あたりの回数やトークン数の上限にまだ届いていないモデルを選んで呼ぶ。相手から 429（使いすぎ）や 5xx（障害）が返れば、そのキーをしばらく休ませて次のモデルで呼び直す。上限は、キーごと・モデルごとに回数を数えて守る。予備の順番は、既定では速さ・賢さ・安定度の実測スコアで並べ替わり、自分で並べた順をそのまま使う設定も選べる。同じ会話は30分間、同じモデルに固定される。

登録したキーは暗号化して SQLite に保存し、呼び出すときだけメモリ上で戻す。設計は**1人で使う前提で、手元で動かすもの**だと README は明言している。どのモデルがどこで無料か、という一覧は作者のサイトから署名つきで1日2回取り込む。無料版が受け取るのは月ごとのまとめで、新しいモデルが加わるのは一覧に載ってから30日後になる。当日中に反映させたければ有料の購読（年19ドル、または買い切り49ドル）がある。ルーター本体は MIT のまま無料だ。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="1つの入口から、各社の無料枠を順番に使い回す。アプリ（専用キー1本で呼ぶ）。FreeLLMAPI（上限の手前のモデルを選ぶ）。1番手のモデル。2番手のモデル。3番手のモデル。上限・障害なら次へ。各社のキーは自分で取得し、各社の規約もそのまま適用される" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="freellmapi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="66" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">1つの入口から、<tspan fill="#1E5A48">各社の無料枠</tspan>を順番に使い回す</text>

  <rect x="40" y="178" width="170" height="100" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="125" y="220" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">アプリ</text>
  <text x="125" y="248" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">（専用キー1本で呼ぶ）</text>

  <line x1="214" y1="228" x2="258" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#freellmapi-arrow)" />

  <rect x="262" y="178" width="210" height="100" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="367" y="220" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">FreeLLMAPI</text>
  <text x="367" y="248" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.72">（上限の手前のモデルを選ぶ）</text>

  <line x1="476" y1="228" x2="540" y2="140" stroke="#1E5A48" stroke-width="4" marker-end="url(#freellmapi-arrow)" />

  <rect x="546" y="108" width="190" height="56" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="641" y="142" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">1番手のモデル</text>

  <rect x="546" y="200" width="190" height="56" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="641" y="234" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">2番手のモデル</text>

  <rect x="546" y="292" width="190" height="56" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="641" y="326" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">3番手のモデル</text>

  <line x1="641" y1="166" x2="641" y2="194" stroke="#1E5A48" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#freellmapi-arrow)" />
  <line x1="641" y1="258" x2="641" y2="286" stroke="#1E5A48" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#freellmapi-arrow)" />
  <text x="641" y="376" text-anchor="middle" font-size="12" fill="#1E5A48">上限・障害なら次へ</text>

  <text x="400" y="420" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">各社のキーは自分で取得し、各社の規約もそのまま適用される</text>
</svg>

キャプション: アプリから見える入口は1つだけで、どのモデルに届くかは、**予備の並び順と各キーの残り枠**で決まる。同じ質問でも、時間帯によって答えるモデルが変わりうる。


## どんなときに使うか

### 手元の試作や勉強で、LLM の利用料を払わずに試したいとき

各社の無料枠を1社ずつ使い分ける手間を、ルーターが引き受ける。OpenAI 互換の入口なので、試作のコードは接続先とキーを差し替えるだけで済む。README は、本格的に作るものは公開前に有料の API へ切り替えるよう求めている。

### コーディング用のエージェントを、無料のモデルで回してみたいとき

README には Claude Code・Codex CLI・Aider など15種ほどの設定を自動で書き出すコマンドがあり、既存の設定は変更前にバックアップを取るとしている。どこまで実用になるかは、次の「注意点」にある性能の制約しだいだ。


## 注意点

**README 自身が「個人の実験と学習用で、本番向けではない」と断っている。** 無料枠は試作用に用意されたもので、安定した基盤ではない、というのが作者の立場だ。各社のキーには、各社のアカウントを作ったときに同意した規約がこのツールを通しても適用され、守る責任は使う人にあるとも書いている。1人で使う中継をどう扱うかを作者が各社の規約で確かめた記録（2026年5月時点）が、別の資料にまとめられている。**使い方によっては規約に触れるおそれがある**ので、使う前に各社の規約を自分で読みたい。

**最上位のモデルは続けては使えず、速さも保証されない。** README が詳しい制約として案内している資料によれば、最上位クラスのモデルも一覧には載っているが、1日の枠が最も小さく、続けて使える量はない。応答の速さはばらつき、稼働の保証もない。上位のモデルが1日の上限に達するにつれて答えの質が下がり、協定世界時の0時（日本時間の朝9時）に戻る。日本時間では、夜から朝にかけて質が下がりやすい。

**「月74億トークン」は、一覧に載った34社の無料枠の合計だ。** 使えるのは自分がキーを登録した会社のぶんだけで、枠の大きさも各社の都合でいつでも変わる。

**無料版はモデル一覧の更新が遅れる。** 新しいモデルは一覧に載ってから30日たって無料版に届く。すぐ使いたい場合は有料の購読が要る。
