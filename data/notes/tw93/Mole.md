---
updated: 2026-09-13
image:
image_alt:
---

<!-- ============================================================
  tw93/Mole
  https://github.com/tw93/Mole
  🐹 Clean, uninstall, analyze, optimize, and monitor your Mac. Free open-source CLI, plus a native Mac app.
  Shell / GPL-3.0 / スター 65,399
============================================================ -->


## 見出しの一文

Macの掃除と監視を、有料アプリを買わずにターミナルで済ませる


## どういうものか

`mo` という1つのコマンドの下に、Mac の手入れに要る操作がまとまっている。キャッシュや消したアプリの残骸を消す `clean`、設定ファイルごとアプリを消す `uninstall`、ディスクの内訳を対話的にたどる `analyze`、CPU・メモリ・電力などを実時間で並べる `status`、`node_modules` や `target` のような作り直せる成果物だけを狙って消す `purge`。有料の掃除アプリやディスク可視化アプリが別々に担ってきた領域を、ターミナルの中に寄せたものと考えると近い。

消す側の道具としては、慎重な作りをしている。削除の前にパスを検証し、共有された場所やシステム所有の場所は保護する。安全だと確認が取れないものは、消さずに飛ばすか拒否すると明記されている。`--dry-run` を付ければ実際には消さずに結果だけ見られ、消した内容は `~/Library/Logs/mole/operations.log` に残る。掃除と最適化については、触ってほしくないものを `--whitelist` で対象から外せる。同じデータをまだ使っている別のコピーが残っていれば消さない、という判断も入っている。

構造として覚えておきたいのは、**無償のCLIと有償のネイティブアプリが別物**だということ。CLI は GPL-3.0 で公開されていて、今後も無償だと書かれている。同じ作者が「Mole for Mac」という有償のGUIアプリを別に出している。README は CLI を「今後も無償・オープンソースのまま」とし、Mac 版は「別の商用アプリ」と書くだけで、両者の機能差がどこにあるかまでは触れていない。開発は活発で、2025年9月の公開からリリースを重ねている。


## 図

<svg viewBox="0 0 800 450" role="img" aria-label="見出しに「消していいと確認できたものだけ、消す」とある図。左に「削除候補（キャッシュ・残骸）」があり、中央の「安全か検証（共有・システム所有は保護）」を通って、「消す（安全と確認できたもの）」と「触らない（確証が持てないもの）」の2つに分かれる。下に「迷ったものは触らない。--dry-run を付ければ、何も消さずに結果だけ確認できる」とある。" style="width: 100%; height: auto; display: block; font-family: var(--jp);">
  <defs>
    <marker id="mole-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#1E5A48" />
    </marker>
  </defs>
  <rect width="800" height="450" fill="#FFFFFF" />
  <text x="400" y="60" text-anchor="middle" font-size="27" font-weight="700" fill="#17160F">消していいと<tspan fill="#1E5A48">確認できたものだけ</tspan>、消す</text>
  <rect x="40" y="162" width="170" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="125" y="202" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">削除候補</text>
  <text x="125" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（キャッシュ・残骸）</text>
  <line x1="210" y1="210" x2="260" y2="210" stroke="#1E5A48" stroke-width="4" marker-end="url(#mole-arrow)" />
  <rect x="268" y="162" width="196" height="96" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="366" y="202" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">安全か検証</text>
  <text x="366" y="226" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（共有・システム所有は保護）</text>
  <line x1="464" y1="210" x2="516" y2="210" stroke="#1E5A48" stroke-width="4" />
  <line x1="516" y1="168" x2="516" y2="268" stroke="#1E5A48" stroke-width="4" />
  <line x1="516" y1="168" x2="568" y2="168" stroke="#1E5A48" stroke-width="4" marker-end="url(#mole-arrow)" />
  <line x1="516" y1="268" x2="568" y2="268" stroke="#1E5A48" stroke-width="4" marker-end="url(#mole-arrow)" />
  <rect x="576" y="134" width="184" height="68" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="668" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">消す</text>
  <text x="668" y="188" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（安全と確認できたもの）</text>
  <rect x="576" y="234" width="184" height="68" rx="8" fill="none" stroke="#17160F" stroke-opacity="0.22" stroke-width="1.5" />
  <text x="668" y="268" text-anchor="middle" font-size="17" font-weight="700" fill="#17160F">触らない</text>
  <text x="668" y="288" text-anchor="middle" font-size="11.5" fill="#17160F" fill-opacity="0.55">（確証が持てないもの）</text>
  <text x="400" y="382" text-anchor="middle" font-size="13.5" fill="#17160F" fill-opacity="0.7">迷ったものは触らない。--dry-run を付ければ、何も消さずに結果だけ確認できる</text>
</svg>

キャプション: 安全と確認が取れたものだけを消し、確証が持てないものは残す。Mole の慎重さは、この向きから来ている。


## どんなときに使うか

### ディスクが埋まった理由が分からないとき

「その他」に数十GBが入っているのに、Finder からは追いきれない。`mo analyze` はターミナルの中でディレクトリを掘り下げていける表示で、どこが重いのかを場所として掴める。消すためというより、**まず在り処を知るため**の道具として先に使える。

### アプリを消したのに何かが残っている気がするとき

ゴミ箱に入れただけでは、設定ファイルや起動エージェントが残る。`mo uninstall` はアプリ本体とあわせてそれらを探して消す。ただし同じデータをまだ使っている別のコピーが残っている場合は消さない、と README は説明している。


## 注意点

**ライセンスの警告は、たいていの人には関係ない。** 当サイトは GPL-3.0 に対して「自社サービス組込み注意」を自動で出しているが、これは自社の製品に組み込んで配布するときの話で、手元の Mac で実行するだけなら影響しない。なお作者は、フォークして別の製品にするなら違う名前を付けて出典を書いてほしい、と書いている。

**管理者パスワードを求められる場面がある。** システム所有のファイルを触るコマンドと、スクリプトで入れたときの既定の導入先である `/usr/local/bin` がそれにあたる。`~/.local/bin` のような自分の領域に入れれば、そのぶんの入力は減らせる。README は「`sudo` を付けずに実行し、必要なときだけ管理者権限を求める」形だと書いている。

**中身の大半はシェルスクリプト。** GitHub が数えたバイト数で見ると8割以上が Shell で、Go は1割台にとどまる。欠点ではないが、**中身を自分で読んでから入れたい人は、読む対象が主にシェルスクリプトだと知っておくとよい。**
