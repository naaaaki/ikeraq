---
updated: 2026-09-07
image:
image_alt:
---

<!-- ============================================================
  magnitudedev/magnitude
  https://github.com/magnitudedev/magnitude
  Open source inference server that runs the best local models for your hardware, plugged into the agent you already use.
  TypeScript / Apache-2.0 / スター 3,168
============================================================ -->


## 見出しの一文

PCの性能を測ってから合うモデルを選び、いつものエージェントにつなぐ


## どういうものか

ローカルでモデルを動かすこと自体は、いま珍しくない。難しいのは**どのモデルなら自分のPCで実用になるかの見当がつかない**ところで、名前とサイズの一覧を前に、落としては試し、遅くて消す、を繰り返すことになる。Magnitude は、そこを機械に測らせる推論サーバー。README の言葉では、チップ・メモリ・帯域を調べ（"profiles your chip, memory, and bandwidth"）、合うモデルを**推定の毎秒トークン数つきで**提示し、そのまま落として、調整して、動かす。

動かしたあとの面倒も引き受ける。モデルは要求が来たときに読み込まれ、使われていないときやメモリが埋まってきたときに降ろされる（"loaded on request, unloaded when idle or memory fills"）。速度に効く設定 — README が挙げているのは投機的デコードと並列度 — も、機械に合わせて設定済みの状態で渡される。ここは、自分で詰めようとすると時間を取られやすいところでもある。

つなぎ先は、いま使っているエージェントのまま。README が名前を挙げているのは Pi、OpenCode、Hermes、OpenClaw、Codex、Claude Code、Oh My Pi、Cline で、付属の実行環境を使うこともできる。導入は npm のコマンド1つと `magnitude setup` の2手。エージェント自身に手順を読ませて設定させるやり方も併記されている。対応するのは macOS と Linux、Windows は WSL 経由。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="PCの性能を測るところから始まり、合うモデルを選んで落とし、調整して手元のサーバーで動かし、いつものエージェントにつなぐまでの流れ図。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="mag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="58" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">モデルを選ぶ前に、<tspan fill="#1E5A48">機械を測る</tspan></text>
  <rect x="26" y="150" width="166" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="109" y="192" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">このPC</text>
  <text x="109" y="216" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（チップ・メモリ）</text>
  <text x="109" y="234" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（帯域）</text>
  <line x1="192" y1="202" x2="234" y2="202" stroke="#1E5A48" stroke-width="4" marker-end="url(#mag-arrow)" />
  <rect x="242" y="150" width="176" height="104" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="330" y="192" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">合うモデルを提示</text>
  <text x="330" y="216" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（推定の毎秒トークン</text>
  <text x="330" y="234" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">数つきで）</text>
  <line x1="418" y1="202" x2="454" y2="202" stroke="#1E5A48" stroke-width="4" marker-end="url(#mag-arrow)" />
  <rect x="462" y="150" width="164" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="544" y="192" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">落として動かす</text>
  <text x="544" y="216" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（設定は調整済み。</text>
  <text x="544" y="234" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">使わなければ降ろす）</text>
  <line x1="626" y1="202" x2="656" y2="202" stroke="#1E5A48" stroke-width="4" marker-end="url(#mag-arrow)" />
  <rect x="664" y="150" width="120" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="724" y="192" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">エージェント</text>
  <text x="724" y="216" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（いつもの</text>
  <text x="724" y="234" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">ものでよい）</text>
  <text x="400" y="352" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">選ぶ・落とす・速度を詰める、の3つが1本につながっている</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">やりとりは外に出ないが、そのぶん速度は機械の性能がそのまま出る</text>
</svg>

キャプション: 目新しいのは「ローカルで動くこと」ではなく、選定・入手・調整という別々だった作業が1本につながっていること。止まりやすいのは、動かす手前の選ぶところになる。


## どんなときに使うか

### コードを外に出したくないとき

README が挙げている利点は、トークン代・APIキー・レート制限がないことと、モデルもやりとりもファイルも手元から出ないこと。**扱いに制約のあるコードで、クラウドのAPIを使う許可が下りない**ような場面では、選択肢がここに限られる。

### ローカルのモデルを試したいが、選定で止まっているとき

「自分の機械で何がどれくらいの速さで動くのか」が分からないまま止まっている人には、測って提示してくれるところが本題になる。推定の毎秒トークン数が先に見えるので、落とす前に見切りをつけられる。


## 注意点

**無料なのはトークン代だけ。** 電気代・ディスク・待ち時間は自分持ちになる。README は必要な性能について「決まった下限はない（There's no fixed minimum）」と書いているが、これは**どんな機械でも快適に動くという意味ではない**。機械の性能がそのまま出る速度を、あらかじめ見込んでおく必要がある。

**中で何を使って推論しているかは、README に書かれていない。** 投機的デコードや並列度といった調整項目の名前は出てくるが、推論エンジンの名前は出てこない。**基盤を自分で確かめてから入れたい場合は、READMEの外まで読みに行く必要がある。**

**まだ新しい。** 公開は2026年6月で、この記事の時点で3か月ほど。書き手は少人数だが、リリースは高い頻度で続いている。作りが変わる可能性を前提に、**使い方を固めすぎない**のが無難になる。

**Windows は WSL 経由。** 素の Windows で直接動かす想定にはなっていない。ライセンスは Apache-2.0。
