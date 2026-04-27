import type { Category } from "./category";
import type { RankedItem } from "./item";

export type FeedQuery = {
  category?: Category;
  minScore?: number;
  limit?: number;
};

export type FeedResponse = {
  items: RankedItem[];
  total: number;
  generatedAt: string;
};
