/**
 * 紹介記事の下書きを組み立てる（docs/article-template.md の雛形）
 *
 * ★ 毎回やることなので、書く場所と守ることを最初から埋めておく。
 *   Naoki は Claude Code と一緒にこのファイルを埋めていく（D-002）。
 *
 * ★ 図のプロンプトも、リポジトリの情報から機械的に組み立てておく。
 *   これは LLM ではなく、単なる文字列の組み立て（SPEC §9.1 を守る）。
 */

import type { Repository } from '../../src/types.js';

/**
 * 図の共通スタイル。★毎回まったく同じ文を使う。
 * サイト全体で絵が揃い、Wakuru の絵だと分かるようになる。
 *
 * 書き方の意図:
 * - 生成モデルは「Style:」「Composition:」のようにラベルで区切ると解釈が安定する
 * - 色は16進数で3色に限定し、「この3色だけ」と言い切る。指定しないと勝手に増える
 * - 文字の禁止は、言い換えを並べて逃げ道を塞ぐ。モデルによっては1語だと素通りする
 * - アイコン（パソコン・サーバー・雲・人）を明示的に禁じる。放っておくと必ず描く
 * - 線の太さはキャンバス幅を基準に言う。「thin」だけでは細さが安定しない
 */
export const IMAGE_STYLE = [
  'Style: flat 2D vector diagram, in the manner of a minimal editorial illustration',
  'for a technical magazine. Use only simple geometric primitives — rectangles,',
  'rounded rectangles, circles, and straight or right-angled connecting lines.',
  'Small solid triangular arrowheads are allowed to show direction.',
  '',
  'Composition: centered and balanced, with generous empty space around the shapes.',
  'Elements sit on a clear horizontal axis. Nothing touches the edge of the frame.',
  '',
  'Color: exactly three colors and nothing else — a warm off-white background',
  '(#F7F4EE), deep green fills (#1E5A48), and near-black outlines (#17160F).',
  'Outlines are thin and uniform, about 3px on a 1600px-wide canvas.',
  '',
  'Must not contain: writing of any kind — no text, letters, numbers, words,',
  'labels, captions, watermarks, or marks that resemble writing. No recognizable',
  'icons such as computers, servers, clouds, databases, gears, or people.',
  'No gradients, shadows, textures, 3D shading, perspective, or outer glow.',
  '',
  'Aspect ratio 16:9.',
].join('\n');

/**
 * 図の型。迷ったら流れ型（たいていのものは流れで説明できる）。
 * shape は「何が何個、どこに、どうつながっているか」を具体的に書く。
 * 抽象的に書くとモデルが勝手に解釈して、毎回違う絵が出る。
 */
const FIGURE_TYPES = [
  {
    key: 'まとめ型',
    hint: 'バラバラだったものを1つにする（統合・プロキシ・ハブ）',
    shape: [
      'Three small outlined squares are stacked vertically on the left. A straight',
      'line runs from each of them, converging into the left side of a single solid',
      'green rounded rectangle at the center. From the right side of that rectangle,',
      'three lines fan out to three outlined circles of different sizes on the right.',
    ].join('\n'),
    topics: ['gateway', 'proxy', 'router', 'orchestration', 'aggregator', 'hub', 'platform', 'framework'],
  },
  {
    key: '置き換え型',
    hint: '重かったものが軽くなる（依存が減る・手順が減る）',
    shape: [
      'The left half shows a loose cluster of six small outlined squares joined by',
      'many crossing lines. The right half shows a single solid green rounded',
      'rectangle standing alone with nothing around it. A thin vertical line',
      'separates the two halves.',
    ].join('\n'),
    topics: ['lightweight', 'zero-config', 'standalone', 'single-binary', 'replacement', 'alternative', 'local-first'],
  },
  {
    key: '層型',
    hint: '既存の仕組みのどこかに挟まる（ミドルウェア・ラッパー）',
    shape: [
      'Three wide horizontal bands are stacked with even gaps between them. The top',
      'and bottom bands are outlined only. The middle band is filled solid green and',
      'extends slightly wider than the other two.',
    ].join('\n'),
    topics: ['middleware', 'wrapper', 'plugin', 'extension', 'sdk', 'runtime', 'kernel'],
  },
  {
    key: '流れ型',
    hint: '入力を受けて何かして出す（変換・解析・パイプライン）',
    shape: [
      'A small outlined square sits on the left. A straight line runs right from it',
      'into a solid green rounded rectangle at the center. From the right side of',
      'that rectangle, another straight line continues to an outlined circle on the',
      'right. The form visibly changes from square to circle across the frame.',
    ].join('\n'),
    topics: [],
  },
] as const;

/** 2行目以降にも同じ字下げを付ける。コメントの中に埋めるため */
function indent(text: string, pad: string): string {
  return text.split('\n').join(`\n${pad}`);
}

/** topics から図の型を当てる。当たらなければ流れ型 */
function guessFigureType(repo: Repository) {
  const topics = new Set(repo.topics.map((t) => t.toLowerCase()));
  const name = repo.name.toLowerCase();
  for (const type of FIGURE_TYPES) {
    if (type.topics.some((k) => topics.has(k) || name.includes(k))) return type;
  }
  return FIGURE_TYPES[FIGURE_TYPES.length - 1];
}

export function buildDraft(repo: Repository, today: string): string {
  const fig = guessFigureType(repo);
  const url = `https://github.com/${repo.id}`;

  return `---
updated: ${today}
image:
image_alt:
---

<!-- ============================================================
  ${repo.id}
  ${url}
  ${repo.description_en ?? '(説明なし)'}
  ${repo.language ?? '-'} / ${repo.license_spdx ?? 'ライセンス未設定'} / スター ${repo.stars.toLocaleString()}
  ${repo.topics.length ? 'topics: ' + repo.topics.join(', ') : ''}

  書き方は docs/article-template.md を見る。
  必須は「どういうものか」だけ。ほかは書けたら書く。
  英語の説明を訳しただけにしない。触っていないことは書かない。
============================================================ -->


## 見出しの一文

<!-- 何をするものかを1行で。20〜35字。それで何が変わるかまで入れる -->



## どういうものか

<!-- ★必須。何をするものか、どう動くか。仕組みの話。3段落まで。
     「こういうときに使う」は次の節に書く（ここに書くと重複する） -->



## 図

<!-- ★ このプロンプトは仮のもの。topics から型を当てただけで、
     このリポジトリの中身は見ていない。

     「どういうものか」を書き終えてから、Claude Code に
     「図のプロンプトを作って」と頼むこと。書いた内容を読んで、
     ①の部分をこのリポジトリに合う形に書き直してくれる。
     手順は CLAUDE.md「記事を書くときの流れ」4 にある。

     推定した型：${fig.key}（${fig.hint}）
     画像は data/notes/${repo.owner}/${repo.name}.png に置き、
     上の frontmatter に image: と image_alt: を書く。

  ------------------------------------------------------------
  ① Subject（ここを書き直す）

  ${indent(fig.shape, '  ')}

  ${indent(IMAGE_STYLE, '  ')}
  ------------------------------------------------------------

  ★ 文字の禁止（no text 以下）は絶対に外さない。
    AI画像生成は文字を崩す。綴りの壊れた図は、判定基準を全公開している
    サイトでは致命傷になる。意味は絵ではなくキャプションが持つ。
-->

キャプション:



## どんなときに使うか

<!-- 見出し＋2〜3行を1〜2個。「〜したいとき」で見出しを終える。
     機能の言い換えではなく、読者の状況を書く -->



## 使い方

<!-- ★実際に動かせたときだけ書く。動かせなかったら、この節ごと消す。
     1. インストールする / 2. 設定ファイルを書く / 3. 起動して呼び出す
     コード例は自分で書いたもの。README の転載は不可（SPEC §8.2）
     最後に、確認した環境を書く -->



## 注意点

<!-- 使ったうえでの留保。設計思想が合わない場合、ライセンスの注意など。
     「合わない人」を書くと、合う人にとっての精度が上がる -->


`;
}
