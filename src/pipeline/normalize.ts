import { categories, type CanonicalItem, type Category, type RawItem } from "../types";

type CategoryRule = {
  category: Category;
  keywords: Array<string | RegExp>;
};

const categoryRules: CategoryRule[] = [
  {
    category: "security",
    keywords: [
      "security",
      "vulnerability",
      "advisory",
      "dependency confusion",
      "supply chain",
      "cve",
      "exploit",
      "zero-day",
      "patch"
    ]
  },
  {
    category: "research",
    keywords: ["research", "paper", "arxiv", "benchmark", "dataset", "evaluation", "university", "lab"]
  },
  {
    category: "developer_tools",
    keywords: [
      "codex",
      "claude code",
      "cursor",
      "copilot",
      "windsurf",
      "coding agent",
      "developer tool",
      "devtool",
      "ide",
      "debugger",
      "refactor",
      "code review",
      "mcp"
    ]
  },
  {
    category: "ai_models",
    keywords: [
      "llm",
      "model release",
      "context window",
      "multimodal",
      "reasoning",
      "token",
      "fine-tuning",
      "inference latency",
      /\b(openai|anthropic|gemini|claude|mistral|llama|deepseek|cohere|xai)\b/i
    ]
  },
  {
    category: "hardware",
    keywords: [
      "gpu",
      "cpu",
      "tpu",
      "npu",
      "asic",
      "fpga",
      "chip",
      "accelerator",
      "hbm",
      "memory bandwidth",
      "risc-v",
      "datacenter"
    ]
  },
  {
    category: "cloud_infrastructure",
    keywords: [
      "cloud",
      "serverless",
      "queue",
      "database",
      "kubernetes",
      "observability",
      "autoscaling",
      "infrastructure",
      "container"
    ]
  },
  {
    category: "open_source",
    keywords: ["github", "open-source", "open source", "repo", "repository", "maintainer", "framework", "library"]
  },
  {
    category: "startups",
    keywords: ["startup", "yc", "y combinator", "founder", "seed", "series a", "series b", "funding", "venture"]
  },
  {
    category: "company_moves",
    keywords: ["layoff", "hiring", "reorg", "reorganization", "org change", "acquisition", "acquires", "strategy"]
  },
  {
    category: "career_skills",
    keywords: [
      "skill",
      "skills",
      "career",
      "learning",
      "job posts",
      "internship",
      "hiring signal",
      "cuda",
      "distributed systems",
      "evals"
    ]
  }
];

const sourceTypeDefaults: Partial<Record<RawItem["sourceType"], Category>> = {
  arxiv: "research",
  github: "open_source",
  hacker_news: "career_skills"
};

const knownEntities = [
  "OpenAI",
  "Anthropic",
  "Google DeepMind",
  "Google",
  "Meta",
  "Microsoft",
  "Apple",
  "Amazon",
  "NVIDIA",
  "AMD",
  "Intel",
  "TSMC",
  "Samsung",
  "ASML",
  "Broadcom",
  "Qualcomm",
  "Mistral",
  "Cohere",
  "DeepSeek",
  "xAI",
  "GitHub",
  "Cursor",
  "Windsurf",
  "Y Combinator",
  "YC"
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && categories.includes(value as Category);
}

function metadataStrings(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  }

  return typeof value === "string" && value.trim().length > 0 ? [value] : [];
}

function searchableText(item: RawItem): string {
  const metadataKeywords = metadataStrings(item.metadata?.keywords).join(" ");
  return normalizeWhitespace(`${item.title} ${item.rawText ?? ""} ${item.source} ${metadataKeywords}`);
}

function keywordMatches(text: string, keyword: string | RegExp): boolean {
  return typeof keyword === "string" ? text.toLowerCase().includes(keyword.toLowerCase()) : keyword.test(text);
}

function scoreRule(text: string, rule: CategoryRule): number {
  return rule.keywords.reduce((score, keyword) => score + (keywordMatches(text, keyword) ? 1 : 0), 0);
}

function detectCategory(item: RawItem): Category {
  if (isCategory(item.metadata?.category)) {
    return item.metadata.category;
  }

  const text = searchableText(item);
  const [bestRule] = categoryRules
    .map((rule) => ({
      category: rule.category,
      score: scoreRule(text, rule)
    }))
    .sort((first, second) => second.score - first.score);

  if (bestRule && bestRule.score > 0) {
    return bestRule.category;
  }

  return sourceTypeDefaults[item.sourceType] ?? "career_skills";
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";

    for (const key of [...parsed.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) {
        parsed.searchParams.delete(key);
      }
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

function extractTitleEntities(title: string): string[] {
  const matches = title.match(/\b[A-Z][A-Za-z0-9+.-]*(?:\s+[A-Z][A-Za-z0-9+.-]*){0,3}\b/g) ?? [];

  return matches.filter((match) => {
    const lowered = match.toLowerCase();
    return !["mock", "demo", "mock demo"].includes(lowered) && match.length > 2;
  });
}

function extractEntities(item: RawItem): string[] {
  const text = searchableText(item).toLowerCase();
  const metadataEntities = [
    ...metadataStrings(item.metadata?.entities),
    ...metadataStrings(item.metadata?.company),
    ...metadataStrings(item.metadata?.organization),
    ...metadataStrings(item.metadata?.repository)
  ];
  const recognizedEntities = knownEntities.filter((entity) => text.includes(entity.toLowerCase()));
  const sourceEntity = item.source && !["Hacker News", "arXiv"].includes(item.source) ? [item.source] : [];

  return Array.from(
    new Set([...metadataEntities, ...recognizedEntities, ...sourceEntity, ...extractTitleEntities(item.title)].map(normalizeWhitespace))
  ).filter(Boolean);
}

function supportingUrlsFor(item: RawItem): string[] {
  const metadataUrls = [...metadataStrings(item.metadata?.supportingUrls), ...metadataStrings(item.metadata?.discussionUrl)];
  return Array.from(new Set([item.url, ...metadataUrls].map(normalizeUrl).filter(Boolean)));
}

function summaryCandidateTextFor(item: RawItem): string {
  const text = normalizeWhitespace(item.rawText ?? item.title);
  return text.length > 1200 ? `${text.slice(0, 1197)}...` : text;
}

export function normalizeRawItems(rawItems: RawItem[]): CanonicalItem[] {
  return rawItems.map((item) => ({
    id: `canonical-${item.id}`,
    title: normalizeWhitespace(item.title),
    url: normalizeUrl(item.url),
    source: normalizeWhitespace(item.source),
    sourceType: item.sourceType,
    publishedAt: item.publishedAt,
    category: detectCategory(item),
    entities: extractEntities(item),
    summaryCandidateText: summaryCandidateTextFor(item),
    supportingUrls: supportingUrlsFor(item)
  }));
}
