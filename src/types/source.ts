import type { Category } from "./category";

export const sourceTypes = [
  "rss",
  "github",
  "hacker_news",
  "arxiv",
  "company_blog",
  "manual",
  "mock"
] as const;

export type SourceType = (typeof sourceTypes)[number];

export const fetchMethods = ["rss", "html", "api", "manual", "mock"] as const;

export type FetchMethod = (typeof fetchMethods)[number];

export type SourceRegistryItem = {
  id: string;
  name: string;
  url: string;
  category: Category;
  sourceType: SourceType;
  fetchMethod: FetchMethod;
  credibility: number;
  enabled: boolean;
};
