import type { CanonicalItem, ScoreBreakdown, SourceType } from "../types";
import { categoryImpactWeights } from "./categoryWeights";

const scoringReferenceDateMs = Date.parse("2026-04-28T00:00:00.000Z");

const sourceCredibilityScores: Record<SourceType, number> = {
  company_blog: 4.6,
  github: 4.4,
  arxiv: 4.2,
  rss: 3.8,
  manual: 3.6,
  hacker_news: 2.8,
  mock: 3.2
};

const categoryCareerScores: Record<CanonicalItem["category"], number> = {
  ai_models: 4.4,
  developer_tools: 4.6,
  hardware: 3.9,
  startups: 3.5,
  open_source: 4,
  security: 4.3,
  cloud_infrastructure: 4,
  research: 3.4,
  company_moves: 3.2,
  career_skills: 4.7
};

const categoryUrgencyScores: Record<CanonicalItem["category"], number> = {
  ai_models: 3.5,
  developer_tools: 3.2,
  hardware: 3,
  startups: 2.6,
  open_source: 2.8,
  security: 4.5,
  cloud_infrastructure: 3.5,
  research: 2.4,
  company_moves: 3.2,
  career_skills: 2.8
};

const impactKeywords = [
  "advisory",
  "agent",
  "api",
  "benchmark",
  "breaking",
  "compiler",
  "context",
  "cuda",
  "database",
  "debug",
  "gpu",
  "kernel",
  "launch",
  "latency",
  "memory bandwidth",
  "model",
  "pricing",
  "release",
  "security",
  "serverless",
  "throughput",
  "upstream",
  "vulnerability"
];

const careerKeywords = [
  "agent",
  "benchmark",
  "cloud",
  "coding",
  "debug",
  "framework",
  "gpu",
  "hiring",
  "learn",
  "model",
  "security",
  "skill",
  "testing",
  "tool"
];

const urgencyKeywords = [
  "advisory",
  "available now",
  "breaking",
  "breach",
  "cve",
  "deprecated",
  "incident",
  "infrastructure",
  "exploit",
  "hiring",
  "launch",
  "layoff",
  "outage",
  "now",
  "patch",
  "pricing",
  "released",
  "today",
  "vulnerability",
  "zero-day"
];

const hypeKeywords = [
  "agi",
  "autonomous",
  "breakthrough",
  "disrupt",
  "explosive",
  "game changer",
  "magic",
  "replaces engineers",
  "revolutionary",
  "ultimate",
  "unprecedented",
  "world first",
  "10x"
];

const technicalDetailKeywords = [
  "advisory",
  "api",
  "architecture",
  "bandwidth",
  "benchmark",
  "compiler",
  "context",
  "cve",
  "debug",
  "dnssec",
  "ipsec",
  "kernel",
  "latency",
  "mitigation",
  "paper",
  "patch",
  "pricing",
  "query planner",
  "quic",
  "release note",
  "sdk",
  "throughput",
  "upstream"
];

const lowSignalKeywords = [
  "award",
  "brand campaign",
  "case study",
  "conference",
  "customer story",
  "customer stories",
  "event",
  "everything we launched",
  "generic event",
  "join us",
  "meet us",
  "partner",
  "promotion",
  "roundup",
  "sponsored",
  "summit",
  "thought leadership",
  "webinar"
];

function clampScore(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value * 10) / 10));
}

function keywordScore(item: CanonicalItem, keywords: string[], weight: number): number {
  const text = itemText(item);
  const matches = keywords.filter((keyword) => text.includes(keyword)).length;
  return Math.min(matches * weight, 1.2);
}

function itemText(item: CanonicalItem): string {
  return `${item.title} ${item.summaryCandidateText} ${item.entities.join(" ")}`.toLowerCase();
}

function qualityPenalty(item: CanonicalItem): number {
  return keywordScore(item, lowSignalKeywords, 0.35);
}

function noveltyScore(publishedAt: string): number {
  const publishedAtMs = Date.parse(publishedAt);

  if (Number.isNaN(publishedAtMs)) {
    return 2.8;
  }

  const ageDays = Math.max(0, Math.floor((scoringReferenceDateMs - publishedAtMs) / 86_400_000));

  if (ageDays <= 1) {
    return 5;
  }

  if (ageDays <= 7) {
    return 4.5;
  }

  if (ageDays <= 14) {
    return 4;
  }

  if (ageDays <= 30) {
    return 3.3;
  }

  if (ageDays <= 90) {
    return 2.4;
  }

  return 1.5;
}

function hypeRiskScore(item: CanonicalItem): number {
  const hype = keywordScore(item, hypeKeywords, 0.7);
  const technicalGrounding = keywordScore(item, technicalDetailKeywords, 0.35);
  const lowSignal = qualityPenalty(item);
  const sourcePenalty = item.sourceType === "hacker_news" ? 0.6 : 0;
  const mockPenalty = item.sourceType === "mock" ? 0.2 : 0;

  return clampScore(1.5 + hype + lowSignal + sourcePenalty + mockPenalty - Math.min(technicalGrounding, 0.7));
}

export function scoreCanonicalItem(item: CanonicalItem): ScoreBreakdown {
  const lowSignal = qualityPenalty(item);
  const technicalDepth = keywordScore(item, technicalDetailKeywords, 0.25);
  const engineeringImpact = clampScore(
    categoryImpactWeights[item.category] + keywordScore(item, impactKeywords, 0.2) + technicalDepth - lowSignal * 0.8
  );
  const novelty = clampScore(noveltyScore(item.publishedAt));
  const careerRelevance = clampScore(
    categoryCareerScores[item.category] + keywordScore(item, careerKeywords, 0.2) - lowSignal * 0.4
  );
  const credibility = clampScore(sourceCredibilityScores[item.sourceType]);
  const urgency = clampScore(categoryUrgencyScores[item.category] + keywordScore(item, urgencyKeywords, 0.25) - lowSignal * 0.3);
  const hypeRisk = hypeRiskScore(item);
  const finalScore = Math.round(
    (engineeringImpact * 0.3 +
      novelty * 0.2 +
      careerRelevance * 0.2 +
      credibility * 0.2 +
      urgency * 0.1 -
      hypeRisk * 0.2 -
      lowSignal * 0.35) *
      100
  ) / 100;

  return {
    engineeringImpact,
    novelty,
    careerRelevance,
    credibility,
    urgency,
    hypeRisk,
    finalScore: Math.max(0, finalScore)
  };
}
