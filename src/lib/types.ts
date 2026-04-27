export const UPDATE_CATEGORIES = [
  "AI Model Updates",
  "AI Coding Tool Updates",
  "Hardware and Computing",
  "Semiconductor and Manufacturing",
  "Fast-Growing Startups",
  "Big Tech Company Updates",
  "Engineering Career and Skill Signals",
  "Open Source and Developer Infrastructure"
] as const;

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number];

export type SourceType =
  | "official_blog"
  | "release_notes"
  | "github_release"
  | "research_paper"
  | "tech_publication"
  | "startup_database"
  | "social_signal";

export type Source = {
  id: string;
  name: string;
  url: string;
  category: UpdateCategory;
  type: SourceType;
  trustScore: number;
  fetchMethod: "rss" | "html" | "manual" | "api";
  enabled: boolean;
};

export type ScoreDimensions = {
  importance: number;
  novelty: number;
  technicalDepth: number;
  careerRelevance: number;
  sourceTrust: number;
};

export type UpdateScore = ScoreDimensions & {
  finalScore: number;
  label: "Low" | "Medium" | "High" | "Critical";
};

export type RawUpdateInput = {
  id?: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: UpdateCategory;
  company?: string;
  summary: string;
  whyItMatters: string;
  whoShouldCare: string;
  technicalKeywords: string[];
  score?: number;
  scoreDimensions?: ScoreDimensions;
  isMock?: boolean;
  viewed?: boolean;
};

export type NormalizedUpdate = Omit<RawUpdateInput, "scoreDimensions"> & {
  id: string;
  normalizedTitle: string;
  duplicateGroupId: string;
  technicalKeywords: string[];
  score: number;
  scoreDetails?: UpdateScore;
  firstSeenAt: string;
  lastSeenAt: string;
  isMock: boolean;
  viewed: boolean;
};
