---
updated: 2026-09-22
image:
image_alt:
---

<!-- ============================================================
  vastsa/PI-Desktop
  https://github.com/vastsa/PI-Desktop
  Local-first AI coding agent desktop: Electron + Rust host core + pi Agent Harness + user-installable plugins
  TypeScript / LGPL-3.0 / スター 5,000台
============================================================ -->


## 見出しの一文

AIエージェント専用の作業場を用意し、中身は拡張で組み立てる


## どういうものか

エディタでもターミナルでもない、**AIエージェントのための独立した作業場**を用意するデスクトップアプリだ。LGPL-3.0。配布されているのは macOS（Apple Silicon と Intel）・Windows（x64）・Linux（x64）向けで、macOS 版は開発者証明書で署名され Apple の公証を通っている。README は現在の版を **0.15 系、早期プレビュー**と明記している。

作りの要になっているのが**プラグイン**だ。README の言い方では、中核は小さく保ち、実際の作業の流れは拡張のほうで組み立てる。足せるものはエージェントの道具やスキルだけではない。画面そのものを足す（パネル、右側の作業欄の表示、浮かぶ小窓、テーマ）ことも、土台を足す（MCP サーバー、常駐するサービス、プラグイン同士が話す通り道）こともできる。プラグインは `.piplug` という形で配るか、マーケットプレイスから入れる。

もうひとつの柱が**任せ方の段階**だ。まず仕事の頼み方に3つある。そのままやらせる Agent、先に計画を出させてから進める Plan、目的と達成の条件だけ決めて道筋は任せる Goal。そのうえで、一人のエージェントで足りないときの受け渡しが2段ある。**サブエージェント**は、調査や実装やテストの分析といった独立した仕事を、それぞれ別の文脈で背後に走らせて結果を返す。**セッションオーケストレーター**はもっと長い仕事向けで、丸ごと一つ分のセッションを担当者（Worker）として複数立て、親のセッションから束ねる。どの担当者も独立して動き、中をそのまま覗ける。README によれば、作業の単位は使い捨てのチャットではなく「プロジェクト → セッション → エージェント → 作業」で組まれていて、**セッションはアプリを閉じて開き直しても続けられる**。モデルは差し替えられる部品として扱われ、OpenAI・Anthropic・互換の API・自前の中継・Ollama・LM Studio・手元のモデルから選び、同じセッションの途中でも切り替えられる。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「中核は小さく、まわりを足していく」とある図。中央に「PI-Desktop（中核）」があり、そこから上へ矢印が伸びて「エージェント（道具・スキル・サブエージェント）」へ、左下へ矢印が伸びて「作業場（パネル・浮かぶ小窓・テーマ）」へ、右下へ矢印が伸びて「土台（MCPサーバー・常駐サービス）」へつながる。中核の右に「モデルは差し替えられる部品」とある。いちばん下に「足したぶんだけ、作業場の姿が変わる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="pi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">中核は小さく、<tspan fill="#1E5A48">まわりを足していく</tspan></text>

  <rect x="296" y="208" width="208" height="84" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="400" y="243" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">PI-Desktop</text>
  <text x="400" y="268" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（中核）</text>

  <line x1="400" y1="204" x2="400" y2="176" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />
  <rect x="280" y="94" width="240" height="78" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="400" y="126" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">エージェント</text>
  <text x="400" y="150" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（道具・スキル・サブエージェント）</text>

  <line x1="330" y1="296" x2="278" y2="330" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />
  <rect x="34" y="316" width="238" height="78" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="153" y="348" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">作業場</text>
  <text x="153" y="372" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（パネル・浮かぶ小窓・テーマ）</text>

  <line x1="470" y1="296" x2="522" y2="330" stroke="#1E5A48" stroke-width="4" marker-end="url(#pi-arrow)" />
  <rect x="528" y="316" width="238" height="78" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="647" y="348" text-anchor="middle" font-size="14" font-weight="700" fill="#17160F">土台</text>
  <text x="647" y="372" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（MCPサーバー・常駐サービス）</text>

  <text x="524" y="254" font-size="12" fill="#17160F" fill-opacity="0.72">モデルは差し替えられる部品</text>

  <text x="400" y="428" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">足したぶんだけ、作業場の姿が変わる</text>
</svg>

キャプション: 同じアプリでも、**入れた拡張しだいで別のものになる**という設計。機能の多さより、どこまでを中核に置かないかを決めている点が特徴。


## どんなときに使うか

### エージェントの作業を、エディタやターミナルの外に出したいとき

プロジェクト・セッション・確認・プレビューが、特定のエディタに寄りかからない場所にまとまる。セッションは閉じて開き直しても続き、留め置き・保存・枝分かれ・検索ができる。

### 仕事を分けて、複数のエージェントに並べて進めさせたいとき

前側・後ろ側・テスト・確認のように担当を分けて、それぞれを丸ごと一つ分のセッションとして走らせ、親から束ねられる。**ひとつの文脈に詰め込みたくない**長い作業のための仕組みだ。


## 注意点

**早期プレビューと明記されている。** README は現在の版を 0.15 系の早期プレビューだと書いている。開いている issue とプルリクエストは合わせて140件台にのぼる。長く使う道具として据える前に、この段階であることは見ておきたい。

**ライセンスが LGPL-3.0。** 自分で使うぶんには問題にならないが、自社の製品に組み込むことを考えている場合は、条件を先に確かめておきたい。

**手元で完結するが、モデルへの送信は別。** プロジェクト・セッション・設定・記録は手元に置かれ、API の資格情報は OS の鍵束に入る。PI-Desktop 自身のアカウントも中継も必須ではなく、計測（テレメトリ）も無いと書かれている。ただし遠くのモデルを使う場合、**依頼に必要な文脈はその提供元へ直接送られる**。手元のモデルを使うかどうかで、ここは変わる。

**Linux 版には条件がある。** x64 のパッケージは glibc 2.35 以上を必要とし、README が例に挙げているのは Ubuntu 22.04 以降・Debian 12 以降・Fedora 36 以降だ。

**エージェントの権限は自分で決める形になっている。** ファイルの読み書き、コマンドの実行、道具の呼び出しはできるが、README によれば特権を要する操作は許可の層を通り、許す・聞く・拒む、のいずれかになる。どこまで任せるかはセッションごとに決める。
