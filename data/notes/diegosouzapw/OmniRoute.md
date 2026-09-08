---
updated: 2026-09-08
image:
image_alt:
---

<!-- ============================================================
  diegosouzapw/OmniRoute
  https://github.com/diegosouzapw/OmniRoute
  Free MIT AI gateway: one endpoint, many providers, auto-fallback
  TypeScript / MIT / スター 62,714 / 既定ブランチ release/v3.8.51
============================================================ -->


## 見出しの一文

複数のAI提供元を1つの窓口にまとめ、止まったら次へ回す


## どういうものか

AIのコーディングツールを使っていると、作業の途中で上限に当たって止まる。契約しているのは1社とは限らず、無料枠を持っている先も別にある。しかしツール側の設定は接続先を1つしか持たない。OmniRoute は、この間に立つ**手元で動かす中継役**。自分のPCで待ち受ける窓口を1つ立て、コーディングツールにはその窓口だけを見せる。窓口の向こうで、どの提供元に流すかを決めるのは OmniRoute だ。

中心にあるのは「コンボ」と呼ぶ仕組みで、**使うモデルを1本の列にしておく**もの。上限に達した、提供元が落ちた、費用が跳ねた、といったときに、列の次の生きている先へ自動で移る。既定の順番は決まっていて、契約しているもの → 自分のAPIキー → 安いところ → 無料枠、の4段を上から試す。この順番は変えられて、振り分け方は19種類が用意されている。安い順・残り枠の多い順・順番に回す・最後にうまくいった先に留まる、といった方針から選ぶ。モデル名に `auto` と書けば、接続済みの提供元からその場で組み立てる動きもする。落ちた先を切り離す仕組みも3層に分かれていて、提供元まるごと止める・特定の鍵だけ休ませる・そのモデルだけ使わない、と粒度が分けてある。

もうひとつの売りが、無料枠の集約と、送るトークン量の削減だ。README には各社の無料枠を一覧にした画面があり、月あたりどれだけ使えるかを集計して表示すると書かれている。削減のほうは自前の仕組みで、README は RTK や Caveman といった先行プロジェクトの考え方を取り入れたものだと書いている。複数の圧縮を重ねて掛ける形で、15〜95%（平均約89%）という数字が掲げられている。鍵は手元に暗号化して置き、使用量や費用は自前の画面で見る、という作りになっている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="コーディングツールが手元の窓口1つに接続し、その先で契約・APIキー・安い先・無料枠という4つの段へ順に振り分けられる流れ図。上限に当たったり落ちたりすると、次の段へ自動で移ることが示されている。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="om-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="54" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">窓口はひとつ。<tspan fill="#1E5A48">止まったら次へ</tspan></text>
  <rect x="20" y="150" width="164" height="120" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="102" y="190" text-anchor="middle" font-size="16" font-weight="700" fill="#17160F">手元のツール</text>
  <text x="102" y="218" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">エディタ・CLI</text>
  <text x="102" y="242" text-anchor="middle" font-size="12" fill="#17160F" fill-opacity="0.78">（接続先は1つだけ）</text>
  <line x1="184" y1="210" x2="222" y2="210" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />
  <rect x="230" y="142" width="196" height="136" rx="8" fill="none" stroke="#1E5A48" stroke-width="2" />
  <text x="328" y="180" text-anchor="middle" font-size="17" font-weight="700" fill="#1E5A48">OmniRoute</text>
  <text x="328" y="212" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.82">自分のPCで動く窓口</text>
  <text x="328" y="238" text-anchor="middle" font-size="12.5" fill="#17160F" fill-opacity="0.82">19通りの振り分け方</text>
  <text x="328" y="262" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.72">（送る量を削ってから流す）</text>
  <line x1="426" y1="210" x2="464" y2="210" stroke="#1E5A48" stroke-width="4" marker-end="url(#om-arrow)" />
  <rect x="472" y="112" width="308" height="196" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.28" stroke-width="1.5" />
  <text x="626" y="144" text-anchor="middle" font-size="15" font-weight="700" fill="#17160F">上から順に試す</text>
  <text x="500" y="180" font-size="13" fill="#17160F" fill-opacity="0.85">1. 契約しているもの</text>
  <text x="500" y="212" font-size="13" fill="#17160F" fill-opacity="0.85">2. 自分のAPIキー</text>
  <text x="500" y="244" font-size="13" fill="#17160F" fill-opacity="0.85">3. 安いところ</text>
  <text x="500" y="276" font-size="13" fill="#17160F" fill-opacity="0.85">4. 無料枠</text>
  <path d="M 742 168 C 766 168, 766 200, 742 200" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#om-arrow)" />
  <path d="M 742 200 C 766 200, 766 232, 742 232" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#om-arrow)" />
  <path d="M 742 232 C 766 232, 766 264, 742 264" fill="none" stroke="#1E5A48" stroke-width="3" marker-end="url(#om-arrow)" />
  <text x="400" y="378" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.72">上限・障害・費用のいずれで止まっても、ツール側の設定は変えないまま次へ移る</text>
</svg>

キャプション: ここで替わっているのは「接続先」ではなく「接続先を決める人」。ツールから見た宛先を固定したまま、選ぶ役目を手元に引き取っている。


## どんなときに使うか

### 上限に当たって作業が止まるのが困るとき

途中で止まると、作業だけでなく思考も切れる。行き先の列を先に決めておけば、止まった時点で次に移る。**作業を続けることを最優先にしたい**場面向けの道具だ。

### 契約と無料枠が複数に散らばっているとき

会社の契約、自分のAPIキー、各社の無料枠。どれがどれだけ残っているかは、普段は見えない。残量や費用を1つの画面で見られること自体が、**使い分けの判断材料**になる。


## 注意点

**README の数字は、そのまま引用しないほうがいい。** 提供元の数は同じ README の中で352と356が混在している。さらに「無料」の件数は、数え方が複数ある。README 自身が、352のうち無料の印が付くのは152、無料枠のカタログは444行・34のプール・恒久無料が52、と並べたうえで、**これらは意図的に別々の分母だ**と断っている。加えて、無料枠の集計は2週間ごとに監査していて増えも減りもする、とも書かれている。**どれも時点の値**として読むのが正しい。トークン削減の「15〜95%」も、対象になる作業での話だ。

**無料枠を束ねる使い方は、相手の規約次第。** 各社の無料枠には、それぞれ条件がある。README 自体、規約上のリスクから「避けるべき」と印を付けた提供元を13件挙げていると書いている。**使う前に、自分が使う提供元の規約を読む**という手順は省けない。

**検知を避けるための機能が含まれている。** 接続の指紋を変える仕組みや多段のプロキシが機能として挙がっている。相手側の制限をすり抜ける性格を持つので、業務で使うなら、そこを承知したうえで判断する必要がある。

**鍵が1か所に集まる。** 暗号化して手元に置く設計だが、**集約したぶん、その1か所の管理が重くなる**ことは変わらない。共用PCや持ち出す端末では特に。

**README が非常に長い。** 宣伝的な表現も多く、機能の一覧を追うだけで疲れる。試すなら、まず窓口を立ててツールを1つつなぐところまでに絞るとよい。ライセンスは MIT。
