import { runMockIngestJob } from "./jobs/ingestJob";
import type { Category, FeedQuery, FeedResponse } from "../types";
import { categories } from "../types";

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 20;
  }

  return Math.max(1, Math.min(50, Math.floor(limit)));
}

export function isCategory(value: string | undefined): value is Category {
  return !!value && categories.includes(value as Category);
}

export async function getFeed(query: FeedQuery = {}): Promise<FeedResponse> {
  const { rankedItems } = await runMockIngestJob();
  const minScore = query.minScore ?? 0;
  const limit = parseLimit(query.limit);
  const filteredItems = rankedItems
    .filter((item) => !query.category || item.category === query.category)
    .filter((item) => item.score.finalScore >= minScore);

  return {
    items: filteredItems.slice(0, limit),
    total: filteredItems.length,
    generatedAt: new Date().toISOString()
  };
}
