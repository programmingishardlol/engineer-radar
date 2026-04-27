import { describe, expect, it } from "vitest";
import { getFeed } from "../src/server/feedService";

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
});
