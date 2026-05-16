import { runMockIngestJob } from "./jobs/ingestJob";
import type { Category, FeedFallbackReason, FeedQuery, FeedResponse, RankedItem } from "../types";
import { categories } from "../types";
import { countCanonicalItems, countRankedItems, listSavedRankedItems } from "../db/itemsRepo";

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
    return { result: null, fallbackReason: "database_unavailable" as const };
  }

  try {
    const canonicalCount = await countCanonicalItems({ includeMock: false });
    if (canonicalCount === 0) {
      return { result: null, fallbackReason: "database_empty" as const };
    }

    const items = await listSavedRankedItems({
      category: query.category,
      includeMock: false,
      minScore: query.minScore ?? 0,
      limit
    });
    const total = await countRankedItems({
      category: query.category,
      includeMock: false,
      minScore: query.minScore ?? 0
    });

    return { result: { items, total }, fallbackReason: undefined };
  } catch {
    return { result: null, fallbackReason: "database_unavailable" as const };
  }
}

function buildMockFeed(
  items: RankedItem[],
  query: FeedQuery,
  limit: number,
  fallbackReason: FeedFallbackReason
): FeedResponse {
  const minScore = query.minScore ?? 0;
  const filteredItems = items
    .filter((item) => !query.category || item.category === query.category)
    .filter((item) => item.score.finalScore >= minScore);

  return {
    items: filteredItems.slice(0, limit),
    total: filteredItems.length,
    generatedAt: new Date().toISOString(),
    dataSource: "mock",
    fallbackReason
  };
}

async function getMockFeed(query: FeedQuery, limit: number, fallbackReason: FeedFallbackReason): Promise<FeedResponse> {
  const { rankedItems } = await runMockIngestJob();
  return buildMockFeed(rankedItems, query, limit, fallbackReason);
}

export async function getFeed(query: FeedQuery = {}): Promise<FeedResponse> {
  const limit = parseLimit(query.limit);

  if (query.mode === "mock") {
    return getMockFeed(query, limit, "explicit_mock_mode");
  }

  const persistedItems = await getPersistedFeedItems(query, limit);

  if (persistedItems.result) {
    return {
      items: persistedItems.result.items,
      total: persistedItems.result.total,
      generatedAt: new Date().toISOString(),
      dataSource: "database"
    };
  }

  return getMockFeed(query, limit, persistedItems.fallbackReason);
}
