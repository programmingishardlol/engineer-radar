import type {
  CanonicalItem as DbCanonicalItem,
  ItemScore as DbItemScore,
  RawItem as DbRawItem,
  Source as DbSource
} from "@prisma/client";
import { categories, sourceTypes, type CanonicalItem, type Category, type RawItem, type RankedItem, type ScoreBreakdown, type SourceRegistryItem, type SourceType } from "../types";

function requireCategory(value: string): Category {
  if (categories.includes(value as Category)) {
    return value as Category;
  }

  throw new Error(`Unknown category in database: ${value}`);
}

function requireSourceType(value: string): SourceType {
  if (sourceTypes.includes(value as SourceType)) {
    return value as SourceType;
  }

  throw new Error(`Unknown source type in database: ${value}`);
}

function parseStringArray(value: string): string[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error("Expected JSON string array from database");
  }

  return parsed;
}

export function stringifyStringArray(values: string[]): string {
  return JSON.stringify(values);
}

export function mapDbSource(source: DbSource): SourceRegistryItem {
  return {
    id: source.id,
    name: source.name,
    url: source.url,
    sourceType: requireSourceType(source.sourceType),
    credibility: source.credibility,
    enabled: source.enabled
  };
}

export function mapDbRawItem(item: DbRawItem): RawItem {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    source: item.sourceName,
    sourceType: requireSourceType(item.sourceType),
    publishedAt: item.publishedAt.toISOString(),
    rawText: item.rawText ?? undefined,
    metadata: (item.metadata as RawItem["metadata"]) ?? undefined
  };
}

export function mapDbCanonicalItem(item: DbCanonicalItem): CanonicalItem {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    source: item.source,
    sourceType: requireSourceType(item.sourceType),
    publishedAt: item.publishedAt.toISOString(),
    category: requireCategory(item.category),
    entities: parseStringArray(item.entitiesJson),
    summaryCandidateText: item.summaryCandidateText,
    supportingUrls: parseStringArray(item.supportingUrlsJson)
  };
}

export function mapDbItemScore(score: DbItemScore): ScoreBreakdown {
  return {
    engineeringImpact: score.engineeringImpact,
    novelty: score.novelty,
    careerRelevance: score.careerRelevance,
    credibility: score.credibility,
    urgency: score.urgency,
    hypeRisk: score.hypeRisk,
    finalScore: score.finalScore
  };
}

export function mapDbRankedItem(item: DbCanonicalItem & { score: DbItemScore }): RankedItem {
  return {
    ...mapDbCanonicalItem(item),
    score: mapDbItemScore(item.score),
    summary: item.score.summary,
    whyEngineersCare: item.score.whyEngineersCare,
    whoShouldCare: item.score.whoShouldCare,
    suggestedAction: item.score.suggestedAction,
    confidence: item.score.confidence
  };
}
