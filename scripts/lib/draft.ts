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
 * 「文字を入れない」は絶対に外さないこと（生成時に崩れて信頼を損なうため）。
 */
export const IMAGE_STYLE = [
  'flat geometric diagram, abstract shapes only, absolutely no text, no letters,',
  'no numbers, no labels, warm off-white background #F7F4EE, one dark green',
  'accent #1E5A48, near-black outlines #17160F, thin uniform 2px strokes,',
  'plenty of negative space, centered composition, no gradients, no shadows,',
  'no 3D, no perspective, no icons of computers or people, 16:9',
].join('\n');

/** 図の型。迷ったら流れ型（たいていのものは流れで説明できる） */
const FIGURE_TYPES = [
  {
    key: 'まとめ型',
    hint: 'バラバラだったものを1つにする（統合・プロキシ・ハブ）',
    shape:
      'several shapes on the left converging into one solid rounded rectangle in the center, then fanning out to the right',
    topics: ['gateway', 'proxy', 'router', 'orchestration', 'aggregator', 'hub', 'platform', 'framework'],
  },
  {
    key: '置き換え型',
    hint: '重かったものが軽くなる（依存が減る・手順が減る）',
    shape:
      'a comparison of two states: a cluster of many small shapes on the left, and a single simple shape on the right',
    topics: ['lightweight', 'zero-config', 'standalone', 'single-binary', 'replacement', 'alternative', 'local-first'],
  },
  {
    key: '層型',
    hint: '既存の仕組みのどこかに挟まる（ミドルウェア・ラッパー）',
    shape:
      'three horizontal bands stacked vertically, with the middle band filled solid and the others outlined',
    topics: ['middleware', 'wrapper', 'plugin', 'extension', 'sdk', 'runtime', 'kernel'],
  },
  {
    key: '流れ型',
    hint: '入力を受けて何かして出す（変換・解析・パイプライン）',
    shape:
      'shapes arranged left to right, changing form as they move: a square becoming a circle through a solid rectangle in the middle',
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

<!-- 型：${fig.key}（${fig.hint}）
     ※ topics から推定したもの。合わなければ docs/article-template.md の表から選び直す

     手順1. 「何が → どうなって → 何になる」を1文で書く
     手順2. 下のプロンプトの ①ここ を、その1文を絵にした説明に差し替える
     手順3. 生成した画像を data/notes/${repo.owner}/${repo.name}.png に置き、
             上の frontmatter に image: と image_alt: を書く
     手順4. キャプションを書く（絵が言えないことを言う）

  --- 生成プロンプト（①だけ書き換えて、そのまま使う）---

  ① A minimal abstract diagram: ${fig.shape}.

  ${indent(IMAGE_STYLE, '  ')}

  --- ここまで ---

  ★ 画像に文字を入れない。AI生成は文字が崩れる。意味はキャプションで持つ
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
