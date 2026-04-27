import { describe, expect, it } from "vitest";
import { collectMockRawItems } from "../src/collectors/mockCollector";
import { normalizeRawItems } from "../src/pipeline/normalize";

describe("normalizeRawItems", () => {
  it("converts mock RawItem objects into CanonicalItem objects", async () => {
    const rawItems = await collectMockRawItems();
    const canonicalItems = normalizeRawItems(rawItems);

    expect(canonicalItems.length).toBeGreaterThan(0);
    expect(canonicalItems[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      url: expect.any(String),
      category: expect.any(String),
      summaryCandidateText: expect.any(String)
    });
    expect(canonicalItems[0].supportingUrls).toContain(canonicalItems[0].url);
  });
});
