---
updated: 2026-09-09
image:
image_alt:
---

<!-- ============================================================
  TauricResearch/TradingAgents
  https://github.com/TauricResearch/TradingAgents
  Multi-Agents LLM Financial Trading Framework
  Python / Apache-2.0 / スター 103,413
============================================================ -->


## 見出しの一文

証券会社の中の役割分担をそのまま組み、LLM同士に議論させて判断を出す


## どういうものか

先に断っておくと、これは**研究用の枠組みであり、投資助言ではない**。作者自身が README でそう明記している。注文が飛ぶ先も模擬の取引所だ。

株の判断を LLM に1回聞いて終わりにすると、その答えがなぜそうなったかを検証できない。TradingAgents はそこを、**実在する運用会社の組織図をまねる**という形で解いている。役割ごとに別々のエージェントを立て、順番に受け渡していく。まず分析班が4人。財務諸表を見る人、ニュースや景気指標を見る人、掲示板やSNSの空気を集める人、MACD や RSI といった指標を見る人。次に研究班で、**強気の担当と弱気の担当がわざと対立させられ**、分析班の材料をめぐって決められた回数だけ議論する。討論の回数は設定で変えられる。

そのうえでトレーダー役が売買案（時期と量）を書き、リスク管理班が値動きの荒さや流動性を見て評価をつけ、最後にポートフォリオ責任者が承認するか却下するかを決める。承認された注文は**模擬取引所**に送られて約定する。土台は LangGraph で、この受け渡しの並びが図として組まれている。一連の流れは Python から `TradingAgentsGraph` を作って `.propagate("銘柄", "日付")` を呼ぶだけでも走るし、対話式のコマンドライン画面から銘柄・日付・使うモデル・調査の深さを選ぶこともできる。

このプロジェクトの読みどころは、実は組織図よりも、**過去の情報を覗いてしまう問題への手当て**のほうにある。過去日付で試すとき、その日にはまだ存在しなかった情報が混ざれば、成績はいくらでもよく見える。更新履歴を見ると、景気指標・SNSの空気・判断の記録それぞれについて、この覗き見を潰す修正が繰り返し入っている。加えて、銘柄記号から会社を特定する処理は**エージェントが動く前に確定的に済ませ**、価格や指標の記述は検証済みのデータに紐づける、という作りに変えられている。「走らせるたびに別の会社の話になる」「ありもしない株価が出てくる」という報告への対処だと、README に経緯ごと書かれている。実行ごとの記録は判断ログに残り、次に同じ銘柄を分析するときは、実際の値動き（SPY との比較を含む）を取ってきて振り返りを1段落作り、それを責任者役への指示文に差し込む。


## 図

<svg viewBox="0 0 800 430" role="img" aria-label="TradingAgents の流れの図。左から、財務・ニュース・空気・指標を見る4人の分析班、強気と弱気が討論する研究班、売買案を書くトレーダー、リスク管理班と承認するポートフォリオ責任者、そして模擬取引所へと矢印が進む。下には、結果が判断ログとして残り、次の分析の材料として戻る流れが破線で描かれている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="ta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="430" fill="#FFFFFF" />
  <text x="400" y="50" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">会社の<tspan fill="#1E5A48">役割分担</tspan>をそのまま並べる</text>

  <rect x="14" y="104" width="164" height="150" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="96" y="134" text-anchor="middle" font-size="14.5" font-weight="700" fill="#17160F">分析班</text>
  <text x="96" y="154" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（材料を集める）</text>
  <text x="96" y="182" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">財務</text>
  <text x="96" y="202" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">ニュース・景気</text>
  <text x="96" y="222" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">SNSの空気</text>
  <text x="96" y="242" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">テクニカル指標</text>

  <line x1="178" y1="179" x2="212" y2="179" stroke="#1E5A48" stroke-width="4" marker-end="url(#ta-arrow)" />

  <rect x="220" y="104" width="164" height="150" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="302" y="134" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1E5A48">研究班</text>
  <text x="302" y="154" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（わざと対立させる）</text>
  <text x="302" y="188" text-anchor="middle" font-size="13" font-weight="700" fill="#17160F">強気 ⇄ 弱気</text>
  <text x="302" y="214" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">決めた回数だけ討論</text>
  <text x="302" y="238" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">利益と危険を突き合わせる</text>

  <line x1="384" y1="179" x2="418" y2="179" stroke="#1E5A48" stroke-width="4" marker-end="url(#ta-arrow)" />

  <rect x="426" y="104" width="164" height="150" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="508" y="134" text-anchor="middle" font-size="14.5" font-weight="700" fill="#17160F">売買案 → 審査</text>
  <text x="508" y="154" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.7">（時期と量を決める）</text>
  <text x="508" y="186" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">トレーダーが案を書く</text>
  <text x="508" y="210" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.85">リスク班が評価する</text>
  <text x="508" y="238" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1E5A48">責任者が承認／却下</text>

  <line x1="590" y1="179" x2="624" y2="179" stroke="#1E5A48" stroke-width="4" marker-end="url(#ta-arrow)" />

  <rect x="632" y="104" width="154" height="150" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="709" y="158" text-anchor="middle" font-size="14.5" font-weight="700" fill="#17160F">模擬取引所</text>
  <text x="709" y="188" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">承認された注文だけ</text>
  <text x="709" y="210" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.78">が約定する</text>
  <text x="709" y="238" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.62">（研究用の枠組み）</text>

  <path d="M709 254 L709 316 L302 316 L302 258" fill="none" stroke="#1E5A48" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#ta-arrow)" />
  <text x="505" y="340" text-anchor="middle" font-size="12" fill="#1E5A48">結果と反省を判断ログに残し、次の分析に差し込む</text>

  <text x="400" y="396" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">どこで判断が変わったかを役割ごとに追える。これが1回聞くのとの違いになる</text>
</svg>

キャプション: 狙いは当てることより、**判断の過程を分解して見えるようにすること**。だから討論と承認という手順が挟まっている。


## どんなときに使うか

### 複数のエージェントに議論させる設計を、動く実例で見たいとき

役割を分ける、わざと反対の立場を作る、承認の関門を置く、結果を次に持ち越す。多エージェントの設計でよく話題になる要素がひととおり実装されていて、LangGraph で組まれた流れとして読める。**題材が投資であることより、組み方のほうに学ぶところがある。**

### 過去日付での検証を、自分で組もうとしているとき

情報の混入をどこで塞ぐかが、更新履歴に具体的な項目として並んでいる。**どこから漏れるのかの一覧**として読める。


## 注意点

**投資助言ではない、と作者自身が明記している。** 研究目的の枠組みであり、成績は使うモデル・温度・期間・データの質などで変わる、と README とリンク先の免責に書かれている。この記事も同じ立場で紹介している。

**同じ入力でも結果は揺れる。** 作者はこれを不具合ではないと説明したうえで、原因を分けている。モデルの出力自体が毎回同じにならないこと、そして**ニュースやSNSは「いま」を返すので、過去の日付を指定しても社会の側の材料は変わってしまう**こと。掲載されている成績が再現される保証はない、と明言されている。

**費用が読みにくい。** 分析4人、討論を複数回、審査と承認。1回の判断で LLM が何度も呼ばれる構成なので、銘柄数や討論回数を増やすと費用が伸びる。深く考えるモデルと素早く答えるモデルを分けて指定できるので、そこで調整することになる。

**データ提供元の鍵を求められる場合がある。** README では、LLM 各社の鍵と並べて Alpha Vantage の鍵が案内されている（必須とは書かれていない）。市場の対応範囲は Yahoo Finance が扱う範囲と説明されていて、そちらは鍵が要らない。どこまで鍵なしで動くかは、使う機能によるので確かめたほうがいい。市場は、東証（`7203.T`）や香港（`0700.HK`）など、記号に取引所の接尾辞を付けて指定できる。

ライセンスは Apache-2.0。論文（arXiv:2412.20138）が併記されている。
