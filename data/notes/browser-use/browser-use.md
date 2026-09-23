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

Web の作業をプログラムに任せるとき、これまでは「このボタンを押す」「この欄に入れる」を人が全部書いていた。画面が変われば、書いたものは動かなくなる。Browser Use は、その指示を**日本語や英語の一文にして渡す**ための道具。一文を書くと、エージェントがページを開き、ボタンを押し、文字を打ち、フォームを埋める。README がいま挙げている例は「空き枠を探し、日時を選び、CAPTCHA を処理して、運転免許の試験を予約する」というもの。

作りとしては Python のライブラリで、`Agent(task=..., llm=...)` に「やること」と「使うモデル」を渡して走らせる。**モデルは差し替えられる。** README では開発元が用意した `ChatBrowserUse` のほか、OpenAI・Anthropic・Google のモデルを直接指定する書き方が並んでおり、Ollama を使って手元のモデルで動かすこともできると書かれている。エージェントが呼べる道具を自分で足す仕組みもあり、`@tools.action(...)` を付けた関数がそのままエージェントの選択肢に加わる。

README は入口を3つに分けて示している。**Python のライブラリとして自分のコードから呼ぶ形**、**CLI として登録し、すでに使っているエージェント（Claude Code や Cursor など）に代行させる形**、そして**エージェントもブラウザも預けるクラウド版**。前の2つは、手元のブラウザにもクラウドのブラウザにもつなげる。クラウド版は検知を避けるブラウザ、プロファイルや録画の管理などを引き受け、規模を増やす用途に置かれている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「手順ではなく、やってほしいことを渡す」とある図。左に「一文の指示」があり、「空き枠を探して試験を予約して」と書かれている。中央の「エージェント」には「1. いまの画面を読む」「2. 次の一手を決める」「3. 押す・打つ・埋める」が並び、「（終わるまで繰り返す）」と添えてある。「画面を見て、また決める」ともある。右の「ブラウザ」には「実際のページが動く（送信・取得・保存）」とある。下に「ボタンの位置は指示に書かない。画面が変わっても、渡す言葉は変えない」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="bu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="56" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">手順ではなく、<tspan fill="#1E5A48">やってほしいこと</tspan>を渡す</text>
  <rect x="20" y="150" width="168" height="112" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="104" y="190" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">一文の指示</text>
  <text x="104" y="218" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">「空き枠を探して</text>
  <text x="104" y="240" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">試験を予約して」</text>
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

同じ手続きでも、サイトごとに項目名も並びも違う。従来のやり方だと相手の数だけ手順を書くことになる。目的だけを渡す形なら、**書くものが1つで済む**。予約や申し込みのような、様式がばらばらな入力作業と相性がよい。

### すでに使っているAIエージェントに、Webの用事もさせたいとき

Claude Code のようなエージェントを使っているなら、一度登録するだけでブラウザ操作の担当を足せる。**一度きりの用事**を頼める相手が増える、という話だ。


## 注意点

**ログイン済みのブラウザを預けることになる。** README には、保存済みのログインを再利用するために手元の Chrome のプロファイルをそのまま使う例が載っている。便利な反面、エージェントが触れる範囲は自分のアカウント全体になる。送信ボタンまで任せるのか、どのサイトで使うのか、**先に線を引いてから使うほうがいい**。

**うまくいかない相手はいる。** CAPTCHA については、README 自身が「有料のクラウド版を使え」と案内している。検知やブロックの対策は手元だけでは押し切れない、というのが開発元の立場だ。

**成績の数字は、開発元が作ったベンチマークのものだ。** いま README に載っているのは「Browser Use Benchmark v2」で、示されている図はそのうち60タスクぶんの結果。README 自身が「いちばん難しい作業を狙ったもので、易しい作業なら小さいモデルでも高い成功率が出る」と断っている。**測っているのは作った側**なので、そのつもりで読む。

**本番に出すときの選び方が、README に3通り示されている。** 自分のコードは持ったままブラウザだけクラウドに預ける、エージェントごと預ける、そして Python ライブラリもブラウザも自前の環境で動かす、の3つだ。どこまで自分で面倒を見るかで選ぶ形になっている。

**ライセンスは MIT。** ただしクラウド版は別の利用規約とプライバシーポリシーが適用される。自動化の対象になるサイト側の規約も、当然ながら別にある。
