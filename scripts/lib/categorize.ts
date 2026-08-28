/**
 * カテゴリのルールベース分類（SPEC §6.3）
 *
 * ★ LLM は使わない。topics と language のキーワードマッチだけで分類する。
 *
 * 精度は完璧でなくてよい。絞り込みの補助であり、判定の根拠ではないため。
 * 運用しながらルールを育てる前提の場所なので、追記しやすい形にしてある。
 */

import type { Category } from '../../src/types.js';

interface Rule {
  category: Category;
  /** topics にこのいずれかが含まれれば該当 */
  topics?: string[];
  /** language がこのいずれかなら該当（topics 条件と AND） */
  languages?: string[];
  /** リポジトリ名にこのいずれかが含まれれば該当 */
  names?: string[];
}

/**
 * 上から順に評価し、最初に当たったものを採用する。
 * 具体的なものを先に、広いものを後に置くこと。
 */
const RULES: Rule[] = [
  {
    category: 'ai-agent',
    topics: ['ai-agent', 'agent', 'agents', 'autonomous-agents', 'multi-agent', 'agentic', 'mcp'],
  },
  {
    category: 'llm',
    topics: ['llm', 'large-language-models', 'gpt', 'chatgpt', 'rag', 'transformers', 'fine-tuning', 'prompt-engineering', 'inference'],
  },
  {
    category: 'security',
    topics: ['security', 'cve', 'pentesting', 'vulnerability', 'infosec', 'cryptography', 'malware', 'appsec'],
  },
  {
    category: 'infra',
    topics: ['kubernetes', 'infrastructure', 'devops', 'terraform', 'docker', 'container', 'observability', 'sre', 'cloud-native'],
  },
  {
    category: 'infra',
    languages: ['Dockerfile', 'HCL', 'Shell'],
    topics: ['deployment', 'provisioning', 'ci-cd'],
  },
  {
    category: 'data',
    topics: ['database', 'sql', 'analytics', 'data-engineering', 'etl', 'data-science', 'vector-database', 'dataframe'],
  },
  {
    category: 'web-frontend',
    topics: ['react', 'vue', 'svelte', 'frontend', 'css', 'ui-components', 'design-system', 'tailwind', 'web-components'],
  },
  {
    category: 'mobile',
    topics: ['android', 'ios', 'flutter', 'react-native', 'mobile', 'swiftui', 'kotlin-multiplatform'],
  },
  {
    category: 'game',
    topics: ['game', 'gamedev', 'game-engine', 'godot', 'unity', 'graphics', 'rendering'],
  },
  {
    category: 'learning',
    topics: ['awesome', 'awesome-list', 'tutorial', 'learning', 'roadmap', 'interview', 'books', 'course', 'education', 'cheatsheet'],
  },
  {
    // 教材系はリポジトリ名にも強い癖が出る。fork 比率の誤検知を避けるため拾っておく
    category: 'learning',
    names: ['awesome-', 'tutorial', 'roadmap', '-guide', 'interview', 'handbook', '100-days'],
  },
  {
    category: 'dev-tool',
    topics: ['cli', 'developer-tools', 'editor', 'linter', 'formatter', 'build-tool', 'package-manager', 'testing', 'debugger', 'terminal'],
  },
  {
    category: 'backend',
    topics: ['backend', 'api', 'server', 'microservices', 'graphql', 'grpc', 'web-framework', 'orm'],
  },
];

export function categorize(
  topics: string[] | null | undefined,
  language: string | null | undefined,
  repoName?: string
): Category {
  const t = new Set((topics ?? []).map((x) => x.toLowerCase()));
  const name = (repoName ?? '').toLowerCase();

  for (const rule of RULES) {
    const topicHit = rule.topics ? rule.topics.some((k) => t.has(k)) : null;
    const langHit = rule.languages ? rule.languages.includes(language ?? '') : null;
    const nameHit = rule.names ? rule.names.some((k) => name.includes(k)) : null;

    // 指定された条件だけを AND で評価する（未指定の条件は無視）
    const checks = [topicHit, langHit, nameHit].filter((v) => v !== null);
    if (checks.length > 0 && checks.every(Boolean)) return rule.category;
  }

  return 'other';
}
