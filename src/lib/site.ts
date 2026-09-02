/**
 * サイト全体で使う固定値
 *
 * ★ 連絡先や運営者名を各ページに直接書かない。
 *   同じことを2か所に書くと、必ず片方が古くなる（レビューで3回指摘された型のミス）。
 *   ここを直せば、出ている場所すべてが揃う。
 */

/**
 * 問い合わせ先。
 *
 * ★ 掲載の取り下げ依頼を受ける窓口。実在の人物が作ったリポジトリを扱う以上、
 *   ここが機能しないまま公開しない（docs/TODO.md A-1）。
 *   プライバシーポリシーの本文が、この窓口を参照している。
 */
export const CONTACT_EMAIL = 'dino.spike.web3@gmail.com';

/**
 * 運営者の表記。
 *
 * ★ 個人情報の取り扱いを説明する文書には、扱う主体を書く必要がある。
 *   本名・屋号・ハンドルネームのどこまでが必要かは、専門家に確認する価値がある
 *   （docs/TODO.md）。いまはハンドルネームで置いている。
 */
export const SITE_OPERATOR = 'naaaaki';

/**
 * 広告（アフィリエイト）を掲載しているか。
 *
 * ★ 表示の有無をここ1か所で決める。ステマ規制の表記・サイト説明・
 *   プライバシーポリシーの3か所が、この値で揃う。
 *
 * ★ false のまま「利用しています」と出さない。
 *   実際には1本もリンクが無いのに掲載を宣言している状態は、
 *   規制対応にならないどころか、記載を確かめていない運営に見える。
 *
 * 導入するときは true にするだけでよい。あわせて
 * プライバシーポリシーに事業者名を書き足すこと（docs/TODO.md C-2）。
 */
export const HAS_AFFILIATE = false;

/**
 * アクセス解析を入れているか。
 *
 * ★ 広告（HAS_AFFILIATE）と同じで、実態とプライバシーポリシーをここ1か所で揃える。
 *
 * ★ 解析だけは、他と危険度が違う。
 *   Cloudflare Web Analytics はダッシュボードのトグル1つで有効にできてしまう。
 *   コードを一切触らずにプライバシーポリシーが嘘になる、唯一の経路がここ。
 *   「ここを true にしてからでないと有効化しない」という順番を必ず守ること。
 *
 * ★ true にする前に、ツールが Cookie を使うかどうかを確かめること。
 *   下の文面は「Cookie を使わない」前提で書いてある。Cookie を使うツールに
 *   入れ替えるなら、Cookie の節も直す必要がある。
 */
export const HAS_ANALYTICS = true;

/** 使っている解析ツールの名前。HAS_ANALYTICS が true のときだけ意味を持つ */
export const ANALYTICS_NAME = 'Cloudflare Web Analytics';

/**
 * 配信事業者。プライバシーポリシーで名指しするために置く。
 *
 * ★ Google Fonts は「Google LLC」と実名で書いているのに、
 *   ホスティングだけ「配信事業者」と伏せていた。読む人からすると、
 *   自分の IP アドレスがどこの誰に届くのかが分からない。片方だけ伏せる理由がない。
 */
export const HOSTING_PROVIDER = 'Cloudflare, Inc.';
export const HOSTING_PROVIDER_COUNTRY = '米国';
export const HOSTING_PRIVACY_URL = 'https://www.cloudflare.com/privacypolicy/';
