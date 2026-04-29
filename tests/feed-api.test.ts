import { describe, expect, it } from "vitest";
import { getFeed, isCategory } from "../src/server/feedService";
import type { FeedResponse } from "../src/types";

describe("getFeed", () => {
  it("returns ranked feed items sorted by score", async () => {
    const feed = await getFeed({ limit: 5, minScore: 0 });

    expect(feed.total).toBeGreaterThan(0);
    expect(feed.items.length).toBeLessThanOrEqual(5);
    expect(feed.generatedAt).toEqual(expect.any(String));
    expect(feed.items[0].score.finalScore).toBeGreaterThanOrEqual(
      feed.items[feed.items.length - 1].score.finalScore
    );
  });

  it("filters by category", async () => {
    const feed = await getFeed({ category: "developer_tools" });

    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.items.every((item) => item.category === "developer_tools")).toBe(true);
  });

  it("returns FeedResponse-shaped data with ranked item contract fields", async () => {
    const feed: FeedResponse = await getFeed({ limit: 1 });

    expect(feed.total).toBeGreaterThanOrEqual(feed.items.length);
    expect(Number.isNaN(Date.parse(feed.generatedAt))).toBe(false);
    expect(feed.items[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      url: expect.stringMatching(/^https:\/\//),
      source: expect.any(String),
      sourceType: "mock",
      publishedAt: expect.any(String),
      category: expect.any(String),
      entities: expect.any(Array),
      summaryCandidateText: expect.any(String),
      supportingUrls: expect.any(Array),
      score: {
        finalScore: expect.any(Number)
      },
      summary: expect.any(String),
      whyEngineersCare: expect.any(String),
      whoShouldCare: expect.any(String),
      suggestedAction: expect.any(String),
      confidence: expect.any(Number)
    });
  });

  it("filters by minimum score before applying the limit", async () => {
    const fullFeed = await getFeed();
    const threshold = fullFeed.items[0].score.finalScore;
    const filteredFeed = await getFeed({ minScore: threshold, limit: 1 });

    expect(filteredFeed.items).toHaveLength(1);
    expect(filteredFeed.total).toBe(fullFeed.items.filter((item) => item.score.finalScore >= threshold).length);
    expect(filteredFeed.items.every((item) => item.score.finalScore >= threshold)).toBe(true);
  });

  it("clamps limits to the supported range", async () => {
    const tinyLimitFeed = await getFeed({ limit: 0 });
    const fractionalLimitFeed = await getFeed({ limit: 2.9 });
    const largeLimitFeed = await getFeed({ limit: 500 });

    expect(tinyLimitFeed.items).toHaveLength(Math.min(tinyLimitFeed.total, 20));
    expect(fractionalLimitFeed.items).toHaveLength(2);
    expect(largeLimitFeed.items).toHaveLength(largeLimitFeed.total);
  });

  it("validates category query values against the shared category contract", () => {
    expect(isCategory("developer_tools")).toBe(true);
    expect(isCategory("semiconductors")).toBe(false);
    expect(isCategory(undefined)).toBe(false);
  });
});
