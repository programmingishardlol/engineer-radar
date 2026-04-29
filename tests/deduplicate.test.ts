import { describe, expect, it } from "vitest";
import type { CanonicalItem } from "../src/types";
import { deduplicateCanonicalItems, getTitleSimilarityPlaceholder, normalizeItemUrl } from "../src/pipeline/deduplicate";

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

  it("strips tracking parameters, fragments, and trailing slashes from canonical URLs", () => {
    expect(
      normalizeItemUrl(
        "https://example.com/update/?utm_source=feed&utm_medium=email&utm_campaign=launch&utm_content=card&utm_term=gpu#section"
      )
    ).toBe("https://example.com/update");
  });

  it("preserves distinct normalized URLs as separate canonical items", () => {
    const result = deduplicateCanonicalItems([
      baseItem,
      {
        ...baseItem,
        id: "different",
        title: "Different mock item",
        url: "https://example.com/other-update"
      }
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.id)).toEqual(["one", "different"]);
  });

  it("keeps duplicate support URLs unique after normalization", () => {
    const result = deduplicateCanonicalItems([
      baseItem,
      {
        ...baseItem,
        id: "two",
        url: "https://example.com/update?utm_medium=email#same"
      },
      {
        ...baseItem,
        id: "three",
        url: "https://example.com/update/"
      }
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("https://example.com/update");
    expect(result[0].supportingUrls).toEqual(["https://example.com/update"]);
  });

  it("exposes the current exact-title similarity placeholder behavior", () => {
    expect(getTitleSimilarityPlaceholder("GPU Memory Update", "gpu memory update")).toBe(1);
    expect(getTitleSimilarityPlaceholder("GPU Memory Update", "GPU Memory Launch")).toBe(0);
  });
});
