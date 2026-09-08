---
updated: 2026-09-08
image:
image_alt:
---

<!-- ============================================================
  browser-use/browser-use
  https://github.com/browser-use/browser-use
  Make websites accessible for AI agents. Automate tasks online with ease.
  Python / MIT / スター 113,028
============================================================ -->


## 見出しの一文

人と同じようにブラウザを触らせて、Web上の手作業をAIに任せる


## どういうものか

Web の作業をプログラムに任せるとき、これまでは「このボタンを押す」「この欄に入れる」を人が全部書いていた。画面が変われば、書いたものは動かなくなる。Browser Use は、その指示を**日本語や英語の一文にして渡す**ための道具。「この求人にこの経歴で応募して」と書くと、エージェントがページを開き、ボタンを押し、文字を打ち、フォームを埋める。README が挙げている例は、求人応募の自動入力と、フォロワー情報を構造化して CSV にする作業。

作りとしては Python のライブラリで、`Agent(task=..., llm=...)` に「やること」と「使うモデル」を渡して走らせる。**モデルは差し替えられる。** README では開発元が用意した `ChatBrowserUse` のほか、OpenAI・Anthropic・Google のモデルを直接指定する書き方が並んでおり、Ollama を使って手元のモデルで動かすこともできると書かれている。エージェントが呼べる道具を自分で足す仕組みもあり、`@tools.action(...)` を付けた関数がそのままエージェントの選択肢に加わる。

入口は2つある。**Python のライブラリとして自分のコードから呼ぶ形**と、**CLI として登録し、すでに使っているエージェント（Claude Code や Cursor など）に代行させる形**。どちらも動くものは同じで、指示の出し方と、結果を受け取る場所が変わる。開発元は有料のクラウド版も出しており、そちらは検知回避・IPの切り替え・CAPTCHA対応・並列実行を引き受ける位置づけになっている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="一文で書いた指示がエージェントに渡り、エージェントが「ページを見る・次の操作を決める・クリックや入力をする」を繰り返してブラウザを操作し、結果を返す流れ図。画面が変わっても指示は書き換えないことが下の一行に示されている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="bu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">手順ではなく、<tspan fill="#1E5A48">やってほしいこと</tspan>を渡す</text>
  <rect x="20" y="150" width="168" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="104" y="190" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">一文の指示</text>
  <text x="104" y="218" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">「この求人に、この</text>
  <text x="104" y="240" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">経歴で応募して」</text>
  <line x1="188" y1="206" x2="230" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#bu-arrow)" />
  <rect x="238" y="120" width="270" height="172" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="373" y="156" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">エージェント</text>
  <text x="373" y="192" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.82">1. いまの画面を読む</text>
  <text x="373" y="218" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.82">2. 次の一手を決める</text>
  <text x="373" y="244" text-anchor="middle" font-size="13" fill="#17160F" fill-opacity="0.82">3. 押す・打つ・埋める</text>
  <text x="373" y="274" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（終わるまで繰り返す）</text>
  <path d="M 258 300 C 258 336, 488 336, 488 300" fill="none" stroke="#1E5A48" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#bu-arrow)" />
  <text x="373" y="352" text-anchor="middle" font-size="12" fill="#1E5A48">画面を見て、また決める</text>
  <line x1="508" y1="206" x2="550" y2="206" stroke="#1E5A48" stroke-width="4" marker-end="url(#bu-arrow)" />
  <rect x="558" y="150" width="222" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="669" y="190" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">ブラウザ</text>
  <text x="669" y="220" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">実際のページが動く</text>
  <text x="669" y="242" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">（送信・取得・保存）</text>
  <text x="400" y="404" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">ボタンの位置は指示に書かない。画面が変わっても、渡す言葉は変えない</text>
</svg>

キャプション: 変わったのは自動化の「書き方」。押す場所を書き並べる代わりに、目的だけを渡して、途中の判断をエージェントに預ける。


## どんなときに使うか

### 毎回ページの作りが少し違う作業を任せたいとき

同じ手続きでも、サイトごとに項目名も並びも違う。従来のやり方だと相手の数だけ手順を書くことになる。目的だけを渡す形なら、**書くものが1つで済む**。求人応募のような、様式がばらばらな入力作業と相性がよい。

### すでに使っているAIエージェントに、Webの用事もさせたいとき

Claude Code のようなエージェントを使っているなら、一度登録するだけでブラウザ操作の担当を足せる。README の例は「この動画をアップロードして」「3台のノートPCを比べて表にして」。**一度きりの用事**を頼める相手が増える、という話だ。


## 注意点

**ログイン済みのブラウザを預けることになる。** README には、保存済みのログインを再利用するために手元の Chrome のプロファイルをそのまま使う例が載っている。便利な反面、エージェントが触れる範囲は自分のアカウント全体になる。送信ボタンまで任せるのか、どのサイトで使うのか、**先に線を引いてから使うほうがいい**。

**うまくいかない相手はいる。** CAPTCHA については、README 自身が「有料のクラウド版を使え」と案内している。検知やブロックの対策は手元だけでは押し切れない、というのが開発元の立場だ。

**成績の数字は、出どころが2つある。** ひとつは開発元が作って公開しているベンチマークで、実際のWeb作業100件を測ったもの。もうひとつは第三者のリーダーボード（Odysseys）で、長い手順を要する200件のタスクで平均87.4%、1位という記載になっている。**前者は作った側による評価**なので、そのつもりで読む。後者は測っているのが別の主体なので、扱いが違う。

**そのまま本番に載せる想定にはなっていない。** Chrome はメモリを多く使い、たくさん並列に動かすと管理が難しい、と README に書かれている。規模を出すならクラウド版へ、という設計だ。

**ライセンスは MIT。** ただしクラウド版は別の利用規約とプライバシーポリシーが適用される。自動化の対象になるサイト側の規約も、当然ながら別にある。
