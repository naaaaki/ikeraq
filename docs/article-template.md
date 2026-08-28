# 記事作成テンプレート

> 1リポジトリぶんの紹介記事を書くときに、毎回これを見る。
> 下書きは `npm run note -- owner/name` で作られる。このファイルの内容が雛形に入っている。

---

## 全体のルール

| # | ルール | 理由 |
|---|---|---|
| 1 | **必須は「どういうものか」だけ。** 他は書けたら書く | 全部埋めないと出せない設計だと、忙しい週に止まる |
| 2 | **英語の description を訳しただけにしない** | それはページを作る理由にならない（SPEC §2.3 S6） |
| 3 | **触っていないこと・確かめていないことは書かない** | 動かなかったときに信用がまとめて失われる |
| 4 | **README のコード例を貼らない** | README はそのリポジトリのライセンスに従う（SPEC §8.2） |
| 5 | **1本あたり20分を目安にする** | 週3本 × 20分 = 1時間。これを超える設計は続かない |

書き上げたら、**必ず自分で読み直してから公開する。** 生成したまま載せない。

---

## 記事の構成

上から順に。番号は読者が知りたい順序そのもの。

### 1. 見出しの一文 ★必須

リポジトリ名の下に出る、日本語の一言。

- **何をするものか**を1行で。20〜35字くらい
- 「〜するツール」で終わらせない。**それで何が変わるか**まで入れる

> ✅ 複数のLLMを1つの入口にまとめて、乗り換えを怖くなくする
> ❌ LLMのルーティングとキャッシュのツール

### 2. どういうものか ★必須

**何をするものか、どう動くか。仕組みの話。**

- 3段落まで。1段落目で全体像、2段落目で中身
- ここに「こういうときに使う」を書かない（次の節と重複する）

### 3. 図 ★書けたら

→ 下の「図の作り方」を見る。

### 4. どんなときに使うか

**どういう場面で手に取るか。場面の話。**

- 見出し＋2〜3行を、1〜2個
- 「〜したいとき」で見出しを終える
- 機能の言い換えにしない。**読者の状況**を書く

> ✅ モデルを乗り換える前に、壊れないか確かめたいとき
> ❌ リクエストの記録・再生ができる

### 5. 使い方

**★実際に動かせたときだけ書く。動かせなかったら、この節ごと省く。**

- 1. インストールする / 2. 設定ファイルを書く / 3. 起動して呼び出す
- コード例は**自分で書いたもの**。README の転載は不可
- 最後に確認した環境を書く（例：macOS / Python 3.12）
- GPU が要る、APIキーが要る、セットアップが重い → 無理に埋めない

### 6. 注意点

**使ったうえでの留保。**

- 設計思想が合わない場合の話
- ライセンスの注意（コピーレフト、特許条項など）
- 「合わない人」を書くと、合う人にとっての精度が上がる

### 7. 開発の様子 ※自動

数字は機械が入れる。書くことはない。

### 8. ほかの候補 ※自動

同じカテゴリから機械が拾う。一言の違いだけ手で直してよい。

---

## 図の作り方

**1リポジトリにつき1枚。**「どういうものか」の直後に入る。

### ★ 画像に文字を入れない

AI画像生成は文字を高確率で崩す。綴りが壊れたラベルは、信頼を売りにするサイトでは致命傷になる。

**絵は関係性だけを示し、意味はキャプションで書く。** この分担なら崩れようがない。

### 手順1 — どの型かを決める

リポジトリの description と README の最初の段落から、次のどれかを選ぶ。

| 型 | どんなリポジトリか | 絵の構造 |
|---|---|---|
| **流れ型** | 入力を受けて何かして出す（変換・解析・パイプライン） | 左から右へ、形が変わっていく |
| **まとめ型** | バラバラだったものを1つにする（統合・プロキシ・ハブ） | 多 → 1 → 多。中央に箱 |
| **置き換え型** | 重かったものが軽くなる（依存が減る・手順が減る） | 上下または左右に Before / After |
| **層型** | 既存の仕組みのどこかに挟まる（ミドルウェア・ラッパー） | 横長の帯を積み、1枚を強調 |

迷ったら**流れ型**。たいていのものは流れで説明できる。

### 手順2 — 1文にする

「**何が** → **どうなって** → **何になる**」を1文で書く。これが絵の中身になる。

> 例：アプリからの呼び出しが1か所に集まり、そこから複数のモデルに振り分けられる

### 手順3 — プロンプトを組む

**［① 何が描かれているか］＋［共通スタイル］** の2段構成。

①だけを毎回書き直し、共通スタイルは**一字一句そのまま**使う。サイト全体で絵が揃い、Wakuru の絵だと分かるようになる。

#### ①の書き方

**「何が、何個、どこに、どうつながっているか」を具体的に書く。** 抽象的に書くとモデルが勝手に解釈して、毎回違う絵が出る。

> ✅ Three small outlined squares are stacked vertically on the left. A straight line runs from each of them, converging into a single solid green rounded rectangle at the center.
>
> ❌ A diagram showing how requests are routed to models.

日本語で考えてから英語にする。並べる向きは **左から右** か **上から下**。

#### 共通スタイル（毎回そのままコピーする）

```
Style: flat 2D vector diagram, in the manner of a minimal editorial illustration
for a technical magazine. Use only simple geometric primitives - rectangles,
rounded rectangles, circles, and straight or right-angled connecting lines.
Small solid triangular arrowheads are allowed to show direction.

Composition: centered and balanced, with generous empty space around the shapes.
Elements sit on a clear horizontal axis. Nothing touches the edge of the frame.

Color: exactly three colors and nothing else - a warm off-white background
(#F7F4EE), deep green fills (#1E5A48), and near-black outlines (#17160F).
Outlines are thin and uniform, about 3px on a 1600px-wide canvas.

Must not contain: writing of any kind - no text, letters, numbers, words,
labels, captions, watermarks, or marks that resemble writing. No recognizable
icons such as computers, servers, clouds, databases, gears, or people.
No gradients, shadows, textures, 3D shading, perspective, or outer glow.

Aspect ratio 16:9.
```

#### なぜこの書き方なのか

| 書いていること | 理由 |
|---|---|
| `Style:` `Composition:` のラベル区切り | ラベルで区切ると生成モデルの解釈が安定する |
| 色を16進数で3色に限定し「この3色だけ」と言い切る | 指定しないと勝手に色が増える |
| 文字の禁止を言い換えで並べる | 1語だけだとモデルによっては素通りする |
| アイコン（パソコン・サーバー・雲・人）を名指しで禁止 | 放っておくと必ず描く |
| 線の太さをキャンバス幅基準で言う | 「thin」だけでは細さが安定しない |

### 例：deepfoundry/atlas-lm の場合

- **型**：まとめ型
- **1文**：アプリからの呼び出しが1か所に集まり、そこから複数のモデルに振り分けられる

```
A small outlined square sits on the left. A straight line runs right from it
into a solid green rounded rectangle at the center. From the right side of that
rectangle, three lines fan out to three outlined circles of different sizes on
the right. The circles vary in size to suggest that the destinations differ.

Style: flat 2D vector diagram, in the manner of a minimal editorial illustration
for a technical magazine. Use only simple geometric primitives - rectangles,
rounded rectangles, circles, and straight or right-angled connecting lines.
Small solid triangular arrowheads are allowed to show direction.

Composition: centered and balanced, with generous empty space around the shapes.
Elements sit on a clear horizontal axis. Nothing touches the edge of the frame.

Color: exactly three colors and nothing else - a warm off-white background
(#F7F4EE), deep green fills (#1E5A48), and near-black outlines (#17160F).
Outlines are thin and uniform, about 3px on a 1600px-wide canvas.

Must not contain: writing of any kind - no text, letters, numbers, words,
labels, captions, watermarks, or marks that resemble writing. No recognizable
icons such as computers, servers, clouds, databases, gears, or people.
No gradients, shadows, textures, 3D shading, perspective, or outer glow.

Aspect ratio 16:9.
```

### 手順4 — キャプションを書く

**絵が言えないことを、ここで言う。** 絵の説明ではなく、絵から読み取ってほしい意味を書く。

> ✅ アプリが見る先はひとつだけになり、どのモデルに渡すかは atlas-lm の側で決まります。モデルを増やしても、アプリのコードは変わりません。
> ❌ アプリとモデルの関係を示した図です。

### 手順5 — 保存する

- 保存先：`data/notes/{owner}/{name}.png`
- 横1600px以上、16:9
- ノートの frontmatter に `image:` と `image_alt:` を書く
- `image_alt` は目の見えない人向けの説明。**絵に何が描かれているか**を書く（キャプションとは役割が違う）

### 図を入れないほうがいい場合

- 説明が1つの箱で終わってしまう（絵にすると情報がゼロになる）
- 見た目が主役のもの（UIツール・テーマ）→ スクリーンショットのほうがよい。ただしライセンス確認が要る
- 型のどれにも当てはまらない → 無理に作らない。図は必須ではない
