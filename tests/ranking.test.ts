import { describe, expect, it } from "vitest";
import { mockCanonicalItems } from "../src/mocks/canonicalItems";
import { rankItem } from "../src/ranking/rankItem";
import { rankItems } from "../src/ranking/rankItems";

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
});
