import type { CanonicalItem, ScoreBreakdown } from "../types";
import { categoryImpactWeights } from "./categoryWeights";

function clampScore(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value * 10) / 10));
}

function hasKeyword(item: CanonicalItem, keywords: string[]): boolean {
  const text = `${item.title} ${item.summaryCandidateText}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword));
}

export function scoreCanonicalItem(item: CanonicalItem): ScoreBreakdown {
  const engineeringImpact = categoryImpactWeights[item.category];
  const novelty = clampScore(3.5 + (Date.now() - new Date(item.publishedAt).getTime() < 14 * 86_400_000 ? 0.5 : 0));
  const careerRelevance = clampScore(
    3 + (hasKeyword(item, ["tool", "coding", "security", "cloud", "gpu", "testing"]) ? 0.8 : 0)
  );
  const credibility = item.sourceType === "mock" ? 3.2 : item.sourceType === "company_blog" || item.sourceType === "github" ? 4.2 : 3.5;
  const urgency = clampScore(2.8 + (item.category === "security" ? 1.3 : 0) + (item.category === "ai_models" ? 0.4 : 0));
  const hypeRisk = clampScore(hasKeyword(item, ["breakthrough", "revolutionary", "game changer"]) ? 3.5 : 1.7);
  const finalScore = Math.round(
    (engineeringImpact * 0.3 +
      novelty * 0.2 +
      careerRelevance * 0.2 +
      credibility * 0.2 +
      urgency * 0.1 -
      hypeRisk * 0.2) *
      100
  ) / 100;

  return {
    engineeringImpact: clampScore(engineeringImpact),
    novelty,
    careerRelevance,
    credibility: clampScore(credibility),
    urgency,
    hypeRisk,
    finalScore: Math.max(0, finalScore)
  };
}
