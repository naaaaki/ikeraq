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
    topics: ['agent', 'agents', 'agentic', 'mcp', 'harness', 'copilot', 'autogpt'],
  },
  {
    category: 'llm',
    topics: ['llm', 'llms', 'gpt', 'chatgpt', 'rag', 'transformers', 'fine-tuning', 'prompt', 'prompts', 'inference', 'embeddings', 'ollama'],
  },
  {
    category: 'security',
    topics: ['security', 'cve', 'pentesting', 'vulnerability', 'infosec', 'cryptography', 'malware', 'appsec', 'osint', 'forensics'],
  },
  {
    category: 'infra',
    topics: ['kubernetes', 'infrastructure', 'devops', 'terraform', 'docker', 'container', 'observability', 'sre', 'proxy', 'vpn', 'tunnel', 'networking', 'selfhosted', 'self-hosted', 'monitoring', 'hosting'],
  },
  {
    category: 'infra',
    languages: ['Dockerfile', 'HCL', 'Shell'],
    topics: ['deployment', 'provisioning', 'ci-cd'],
  },
  {
    category: 'data',
    topics: ['database', 'sql', 'analytics', 'etl', 'dataframe', 'elasticsearch', 'knowledge-graph', 'scraping', 'crawler'],
  },
  {
    category: 'web-frontend',
    topics: ['react', 'vue', 'svelte', 'frontend', 'css', 'tailwind', 'ui', 'design', 'canvas', 'whiteboard', 'components'],
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
    topics: ['awesome', 'tutorial', 'tutorials', 'learning', 'roadmap', 'interview', 'books', 'course', 'education', 'cheatsheet', 'cookbook', 'guide', 'examples'],
  },
  {
    // 教材系はリポジトリ名にも強い癖が出る。fork 比率の誤検知を避けるため拾っておく
    category: 'learning',
    names: ['awesome-', 'tutorial', 'roadmap', '-guide', 'interview', 'handbook', '100-days'],
  },
  {
    category: 'dev-tool',
    topics: ['cli', 'editor', 'ide', 'linter', 'formatter', 'packaging', 'testing', 'debugger', 'terminal', 'devtools', 'productivity', 'automation', 'git', 'bundler', 'compiler', 'monorepo', 'resolver'],
  },
  {
    category: 'backend',
    topics: ['backend', 'api', 'server', 'microservices', 'graphql', 'grpc', 'orm', 'nodejs', 'http', 'rest', 'websocket', 'framework'],
  },
];

/**
 * topics を語の単位までほどく。
 *
 * ★ 完全一致だけでは取りこぼす。実データで `ai-agents`（複数形）や
 *   `agent-skills` が「そのほか」に落ちていた。ハイフンで区切った語も見る。
 *   部分一致にしないのは、`api` が `rapid` に当たるような誤爆を避けるため。
 */
function expandTopics(topics: string[] | null | undefined): Set<string> {
  const out = new Set<string>();
  for (const raw of topics ?? []) {
    const topic = raw.toLowerCase();
    out.add(topic);
    for (const part of topic.split('-')) {
      if (part.length >= 2) out.add(part);
    }
  }
  return out;
}

export function categorize(
  topics: string[] | null | undefined,
  language: string | null | undefined,
  repoName?: string
): Category {
  const t = expandTopics(topics);
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
