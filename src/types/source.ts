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

export type SourceRegistryItem = {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  credibility: number;
  enabled: boolean;
};
