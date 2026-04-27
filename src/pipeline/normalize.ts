import type { CanonicalItem, Category, RawItem } from "../types";

const categoryRules: Array<{ category: Category; keywords: string[] }> = [
  { category: "ai_models", keywords: ["model", "context", "llm", "multimodal"] },
  { category: "developer_tools", keywords: ["codex", "claude code", "cursor", "coding agent", "developer tool"] },
  { category: "hardware", keywords: ["gpu", "chip", "memory bandwidth", "accelerator", "npu"] },
  { category: "startups", keywords: ["startup", "yc", "founder"] },
  { category: "open_source", keywords: ["github", "open-source", "open source", "repo"] },
  { category: "security", keywords: ["security", "vulnerability", "advisory", "dependency confusion"] },
  { category: "cloud_infrastructure", keywords: ["cloud", "serverless", "queue", "infrastructure"] },
  { category: "research", keywords: ["research", "paper", "arxiv", "benchmark"] },
  { category: "company_moves", keywords: ["layoff", "hiring", "reorg", "acquisition"] },
  { category: "career_skills", keywords: ["skill", "career", "learning"] }
];

function detectCategory(item: RawItem): Category {
  const text = `${item.title} ${item.rawText ?? ""} ${item.source}`.toLowerCase();
  return categoryRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))?.category ?? "career_skills";
}

function extractEntities(item: RawItem): string[] {
  const entities = new Set<string>([item.source]);
  const titleWords = item.title.match(/\b[A-Z][A-Za-z0-9+-]{2,}\b/g) ?? [];
  titleWords.slice(0, 4).forEach((word) => entities.add(word));
  return Array.from(entities);
}

export function normalizeRawItems(rawItems: RawItem[]): CanonicalItem[] {
  return rawItems.map((item) => ({
    id: `canonical-${item.id}`,
    title: item.title,
    url: item.url,
    source: item.source,
    sourceType: item.sourceType,
    publishedAt: item.publishedAt,
    category: detectCategory(item),
    entities: extractEntities(item),
    summaryCandidateText: item.rawText ?? item.title,
    supportingUrls: [item.url]
  }));
}
