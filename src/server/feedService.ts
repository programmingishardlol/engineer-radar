import { runMockIngestJob } from "./jobs/ingestJob";
import type { Category, FeedQuery, FeedResponse } from "../types";
import { categories } from "../types";
import { countCanonicalItems, listSavedRankedItems } from "../db/itemsRepo";

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 20;
  }

  return Math.max(1, Math.min(50, Math.floor(limit)));
}

export function isCategory(value: string | undefined): value is Category {
  return !!value && categories.includes(value as Category);
}

async function getPersistedFeedItems(query: FeedQuery, limit: number) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const canonicalCount = await countCanonicalItems();
    if (canonicalCount === 0) {
      return null;
    }

    const items = await listSavedRankedItems({
      category: query.category,
      minScore: query.minScore ?? 0,
      limit
    });

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export async function getFeed(query: FeedQuery = {}): Promise<FeedResponse> {
  const minScore = query.minScore ?? 0;
  const limit = parseLimit(query.limit);
  const persistedItems = await getPersistedFeedItems(query, limit);

  if (persistedItems) {
    return {
      items: persistedItems,
      total: persistedItems.length,
      generatedAt: new Date().toISOString()
    };
  }

  const { rankedItems } = await runMockIngestJob();
  const filteredItems = rankedItems
    .filter((item) => !query.category || item.category === query.category)
    .filter((item) => item.score.finalScore >= minScore);

  return {
    items: filteredItems.slice(0, limit),
    total: filteredItems.length,
    generatedAt: new Date().toISOString()
  };
}
