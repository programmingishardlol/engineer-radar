import type { ScoreDimensions, UpdateScore } from "./types";

const weights: Record<keyof ScoreDimensions, number> = {
  importance: 0.35,
  novelty: 0.2,
  technicalDepth: 0.2,
  careerRelevance: 0.15,
  sourceTrust: 0.1
};

function assertValidScore(value: number) {
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    throw new Error("Score dimensions must be between 1 and 5");
  }
}

function getScoreLabel(finalScore: number): UpdateScore["label"] {
  if (finalScore >= 4.6) {
    return "Critical";
  }

  if (finalScore >= 4) {
    return "High";
  }

  if (finalScore >= 2.75) {
    return "Medium";
  }

  return "Low";
}

export function calculateUpdateScore(dimensions: ScoreDimensions): UpdateScore {
  Object.values(dimensions).forEach(assertValidScore);

  const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + dimensions[key as keyof ScoreDimensions] * weight;
  }, 0);
  const finalScore = Math.round(weightedScore * 100) / 100;

  return {
    ...dimensions,
    finalScore,
    label: getScoreLabel(finalScore)
  };
}
