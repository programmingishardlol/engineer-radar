import type { Category } from "./category";
import type { ScoreBreakdown } from "./score";
import type { SourceType } from "./source";

export type RawItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceType: SourceType;
  publishedAt: string;
  rawText?: string;
  metadata?: Record<string, string | number | boolean | string[]>;
};

export type CanonicalItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceType: SourceType;
  publishedAt: string;
  category: Category;
  entities: string[];
  summaryCandidateText: string;
  supportingUrls: string[];
};

export type RankedItem = CanonicalItem & {
  score: ScoreBreakdown;
  summary: string;
  whyEngineersCare: string;
  whoShouldCare: string;
  suggestedAction: string;
  confidence: number;
};
