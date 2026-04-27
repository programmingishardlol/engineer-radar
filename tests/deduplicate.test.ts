import { describe, expect, it } from "vitest";
import type { CanonicalItem } from "../src/types";
import { deduplicateCanonicalItems } from "../src/pipeline/deduplicate";

const baseItem: CanonicalItem = {
  id: "one",
  title: "Mock duplicate item",
  url: "https://example.com/update?utm_source=test",
  source: "Mock Source",
  sourceType: "mock",
  publishedAt: "2026-04-01T00:00:00.000Z",
  category: "developer_tools",
  entities: ["Mock Source"],
  summaryCandidateText: "A mock update for testing.",
  supportingUrls: ["https://example.com/update?utm_source=test"]
};

describe("deduplicateCanonicalItems", () => {
  it("removes exact URL duplicates after URL normalization", () => {
    const duplicate: CanonicalItem = {
      ...baseItem,
      id: "two",
      url: "https://example.com/update"
    };

    const result = deduplicateCanonicalItems([baseItem, duplicate]);

    expect(result).toHaveLength(1);
    expect(result[0].supportingUrls).toEqual(["https://example.com/update"]);
  });
});
