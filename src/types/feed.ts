import type { Category } from "./category";
import type { RankedItem } from "./item";

export type FeedQuery = {
  category?: Category;
  minScore?: number;
  limit?: number;
  mode?: "auto" | "mock";
};

export type FeedDataSource = "database" | "mock" | "transient";

export type FeedFallbackReason = "database_empty" | "database_unavailable" | "explicit_mock_mode";

export type FeedResponse = {
  items: RankedItem[];
  total: number;
  generatedAt: string;
  dataSource: FeedDataSource;
  fallbackReason?: FeedFallbackReason;
};

export type RefreshResponse = {
  fetched: number;
  saved: number;
  usedFallback: boolean;
  sourceCount: number;
  feed: FeedResponse;
};
