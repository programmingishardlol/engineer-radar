import { describe, expect, it } from "vitest";
import { collectArxivItems } from "../src/collectors/arxivCollector";
import { collectCompanyBlogItems } from "../src/collectors/companyBlogCollector";
import { collectGitHubItems } from "../src/collectors/githubCollector";
import { collectHackerNewsItems } from "../src/collectors/hackerNewsCollector";
import { collectMockRawItems } from "../src/collectors/mockCollector";
import { collectRssItems } from "../src/collectors/rssCollector";
import { mockRawItems } from "../src/mocks/rawItems";
import { sourceTypes } from "../src/types";

describe("collectors", () => {
  it("returns the stable mock raw item fixtures without live fetching", async () => {
    const rawItems = await collectMockRawItems();

    expect(rawItems).toBe(mockRawItems);
    expect(rawItems).toHaveLength(9);
    expect(rawItems.every((item) => item.sourceType === "mock")).toBe(true);
    expect(rawItems.every((item) => sourceTypes.includes(item.sourceType))).toBe(true);
    expect(rawItems.every((item) => item.metadata?.demo === true)).toBe(true);
  });

  it("keeps real external collectors as empty typed stubs for the mock MVP", async () => {
    const collectorResults = await Promise.all([
      collectArxivItems(),
      collectCompanyBlogItems(),
      collectGitHubItems(),
      collectHackerNewsItems(),
      collectRssItems()
    ]);

    expect(collectorResults).toEqual([[], [], [], [], []]);
  });
});
