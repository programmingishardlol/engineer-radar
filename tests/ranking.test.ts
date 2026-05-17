import { describe, expect, it } from "vitest";
import { mockCanonicalItems } from "../src/mocks/canonicalItems";
import { rankItem } from "../src/ranking/rankItem";
import { rankItems } from "../src/ranking/rankItems";
import { scoreCanonicalItem } from "../src/ranking/scoringRules";
import type { CanonicalItem } from "../src/types";

const baseCanonicalItem: CanonicalItem = {
  id: "ranking-fixture",
  title: "Mock/demo: Security tool improves package manager checks",
  url: "https://example.com/mock/security-tool",
  source: "Mock Security Advisory",
  sourceType: "mock",
  publishedAt: "2026-04-22T12:00:00.000Z",
  category: "security",
  entities: ["Mock Security Advisory"],
  summaryCandidateText: "A security tool helps teams test package manager dependency confusion mitigations.",
  supportingUrls: ["https://example.com/mock/security-tool"]
};

describe("ranking", () => {
  it("returns a deterministic finalScore for one item", () => {
    const ranked = rankItem(mockCanonicalItems[0]);

    expect(ranked.score.finalScore).toBeGreaterThan(0);
    expect(ranked.summary).toContain("Mock/demo item");
    expect(ranked.confidence).toBeGreaterThan(0);
  });

  it("sorts ranked items by score descending", () => {
    const ranked = rankItems(mockCanonicalItems);

    expect(ranked.length).toBe(mockCanonicalItems.length);
    expect(ranked[0].score.finalScore).toBeGreaterThanOrEqual(ranked[ranked.length - 1].score.finalScore);
  });

  it("returns the full ranked item contract fields for a canonical item", () => {
    const ranked = rankItem(baseCanonicalItem);

    expect(ranked).toMatchObject({
      ...baseCanonicalItem,
      score: {
        engineeringImpact: expect.any(Number),
        novelty: expect.any(Number),
        careerRelevance: expect.any(Number),
        credibility: expect.any(Number),
        urgency: expect.any(Number),
        hypeRisk: expect.any(Number),
        finalScore: expect.any(Number)
      },
      summary: expect.any(String),
      whyEngineersCare: expect.any(String),
      whoShouldCare: expect.any(String),
      suggestedAction: expect.any(String),
      confidence: expect.any(Number)
    });
  });

  it("penalizes hype language in the final score", () => {
    const plainScore = scoreCanonicalItem(baseCanonicalItem);
    const hypeScore = scoreCanonicalItem({
      ...baseCanonicalItem,
      id: "hype-fixture",
      title: "Mock/demo: Revolutionary game changer security tool breakthrough"
    });

    expect(hypeScore.hypeRisk).toBeGreaterThan(plainScore.hypeRisk);
    expect(hypeScore.finalScore).toBeLessThan(plainScore.finalScore);
  });

  it("ranks technical engineering detail above broad marketing announcements", () => {
    const technicalItem: CanonicalItem = {
      ...baseCanonicalItem,
      id: "technical-detail",
      sourceType: "company_blog",
      title: "Linux kernel QUIC bug fix improves congestion control latency",
      summaryCandidateText:
        "Engineers debugged a Linux kernel interaction with QUIC congestion control, measured latency regressions, and shipped a mitigation with upstream patches.",
      category: "cloud_infrastructure"
    };
    const marketingItem: CanonicalItem = {
      ...baseCanonicalItem,
      id: "marketing-roundup",
      sourceType: "company_blog",
      title: "Everything we launched during customer week",
      summaryCandidateText:
        "A broad roundup of customer stories, partner announcements, webinars, and product updates from a company event.",
      category: "cloud_infrastructure"
    };

    const technicalScore = scoreCanonicalItem(technicalItem);
    const marketingScore = scoreCanonicalItem(marketingItem);

    expect(technicalScore.finalScore).toBeGreaterThan(marketingScore.finalScore);
    expect(technicalScore.engineeringImpact).toBeGreaterThan(marketingScore.engineeringImpact);
    expect(marketingScore.hypeRisk).toBeGreaterThan(technicalScore.hypeRisk);
  });

  it("uses publish date as the tie breaker when final scores match", () => {
    const older: CanonicalItem = {
      ...baseCanonicalItem,
      id: "older",
      publishedAt: "2026-04-20T12:00:00.000Z"
    };
    const newer: CanonicalItem = {
      ...baseCanonicalItem,
      id: "newer",
      publishedAt: "2026-04-21T12:00:00.000Z"
    };

    const ranked = rankItems([older, newer]);

    expect(ranked.map((item) => item.id)).toEqual(["newer", "older"]);
    expect(ranked[0].score.finalScore).toBe(ranked[1].score.finalScore);
  });
});
