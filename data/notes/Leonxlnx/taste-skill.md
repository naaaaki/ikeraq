---
updated: 2026-09-24
image:
image_alt:
---

<!-- ============================================================
  Leonxlnx/taste-skill
  https://github.com/Leonxlnx/taste-skill
  Taste-Skill - gives your AI good taste. stops the AI from generating boring, generic slop 
  JavaScript / MIT / スター 89,594
  topics: agent, ai, claude, claude-code, codex, coding, design, frontend, lowcode, nocode, skill, skills, vibecoding

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

AIが作る画面の「どこかで見た感じ」を、指示書で抑える


## どういうものか

AI のコーディングエージェントに読ませる**指示書**（スキル）を集めたリポジトリだ。AI に Web ページを作らせると、紫のグラデーション、中央寄せの大見出し、同じ大きさのカードが3枚並ぶ、といった決まった見た目になりやすい。こうした「ありがちな形」を避け、レイアウト・文字組み・動き・余白を作り込ませるための決まりごとが、`SKILL.md` というファイルに書かれている。README によれば Codex・Cursor・Claude Code などで使え、React・Vue・Svelte のどれにも使えるよう、特定のフレームワークではなくデザインの意図を対象にしている。

中心になるのは `taste-skill` で、いまは大きく書き直した v2 が「実験版」として既定になっている。書き始める前に依頼文を読んで、どんなページを誰に向けて作るのかを1行で宣言させ、そのうえで**つまみを3つ**（レイアウトの冒険度・動きの量・情報の詰め具合、それぞれ1〜10）合わせてから作らせる。長いダッシュ記号（—）を禁止するといった細かい決まりも入っている。

ほかに、GPT・Codex 向けに締め付けを強めたもの、既存のサイトを点検してから直すもの、落ち着いた高級感・ミニマル・ブルータリズムといった方向別のもの、途中で省略せず最後まで出力させるものなど、用途ごとに分かれている。コードではなく**参考画像だけを作るスキル**（Web・スマホの画面案、ブランドの素材一式）もあり、ChatGPT Images などで作った画像を、あとからコーディングエージェントに渡して実装させる使い方が想定されている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="指示書を読ませて、AIの画面づくりのありがちを抑える。依頼（作りたいページ）。SKILL.md（デザインの決まりごと）（taste-skillはつまみ3つ）。エージェント（Codex・Cursor・Claude Code）。画面のコード（フレームワークは問わない）。参考画像だけを作るスキルもあり、できた画像をエージェントに渡して実装させる" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="taste-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#17160F">指示書を読ませて、AIの画面づくりの<tspan fill="#1E5A48">ありがち</tspan>を抑える</text>

  <rect x="24" y="176" width="160" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="104" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">依頼</text>
  <text x="104" y="246" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（作りたいページ）</text>

  <line x1="188" y1="228" x2="212" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#taste-arrow)" />

  <rect x="216" y="176" width="170" height="104" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="301" y="214" text-anchor="middle" font-size="16" font-weight="700" fill="#1E5A48">SKILL.md</text>
  <text x="301" y="240" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（デザインの決まりごと）</text>
  <text x="301" y="258" text-anchor="middle" font-size="11" fill="#17160F" fill-opacity="0.72">（taste-skillはつまみ3つ）</text>

  <line x1="390" y1="228" x2="414" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#taste-arrow)" />

  <rect x="418" y="176" width="180" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="508" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">エージェント</text>
  <text x="508" y="246" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（Codex・Cursor・Claude Code）</text>

  <line x1="602" y1="228" x2="626" y2="228" stroke="#1E5A48" stroke-width="4" marker-end="url(#taste-arrow)" />

  <rect x="630" y="176" width="150" height="104" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="705" y="220" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">画面のコード</text>
  <text x="705" y="242" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">（フレームワーク</text>
  <text x="705" y="258" text-anchor="middle" font-size="10.5" fill="#17160F" fill-opacity="0.72">は問わない）</text>

  <text x="400" y="380" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">参考画像だけを作るスキルもあり、できた画像をエージェントに渡して実装させる</text>
</svg>

キャプション: 中身はプログラムではなく、エージェントが読む**デザインの決まりごと**の文書だ。依頼文から方向性を読み取らせ、中心の taste-skill では3つのつまみで振れ幅を決めてから作らせる。


## どんなときに使うか

### AIに作らせたページが、どれも似た見た目になってしまうとき

ランディングページやポートフォリオを AI に任せると、配色や並びが毎回同じ型に収まりがちだ。指示書を読ませることで、避けるべき形と、依頼に合わせた方向の決め方をエージェントに渡せる。**見た目の方向性がすでに決まっているなら**、ミニマル・ブルータリズムなどの方向別スキルを足す。

### 画面の案を先に絵で固めてから、実装に回したいとき

画像生成向けのスキルで Web やスマホの画面案、ブランドの素材一式を作り、その画像をコーディングエージェントに渡せる。生成から画像の読み取り、実装までを1つの流れでやらせるスキルも用意されている。


## 注意点

**既定のスキルは実験版。** 既定の `taste-skill` は v2 で、README は「実験版」としている。v1 の挙動に頼っている場合は、v1 を名指しで入れれば固定できる。

**向いていない画面がある。** `taste-skill` の指示書自体に、対象はランディングページ・ポートフォリオ・リデザインで、ダッシュボードやデータの表、手順の多い業務画面は対象外だと書かれている。既定の v2 で管理画面を作らせたい人には合わない。

**コマンドで入れるなら、外部の道具を使う。** 導入は `npx skills add` というコマンドを使う方法が案内されている。`SKILL.md` を自分のプロジェクトにコピーしたり、会話に貼り付けたりする方法もある。

**名前を使った暗号資産とは無関係。** README は、公式のトークンや暗号資産は存在せず、作者の名前や画像を使ったものは無関係だと明記している。
