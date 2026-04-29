import { describe, expect, it } from "vitest";
import { collectMockRawItems } from "../src/collectors/mockCollector";
import { normalizeRawItems } from "../src/pipeline/normalize";
import type { RawItem } from "../src/types";

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

  it("preserves source fields and derives the expected category for each mock fixture", async () => {
    const rawItems = await collectMockRawItems();
    const canonicalItems = normalizeRawItems(rawItems);

    expect(canonicalItems.map((item) => item.category)).toEqual([
      "ai_models",
      "developer_tools",
      "hardware",
      "startups",
      "open_source",
      "security",
      "cloud_infrastructure",
      "research",
      "security"
    ]);
    expect(canonicalItems).toHaveLength(rawItems.length);
    expect(canonicalItems[0]).toMatchObject({
      id: `canonical-${rawItems[0].id}`,
      url: rawItems[0].url,
      source: rawItems[0].source,
      sourceType: rawItems[0].sourceType,
      publishedAt: rawItems[0].publishedAt,
      summaryCandidateText: rawItems[0].rawText
    });
  });

  it("uses title text and the career skills fallback when raw text is absent", () => {
    const rawItems: RawItem[] = [
      {
        id: "career-signal",
        title: "Mock/demo: Verification skills become important for engineering careers",
        url: "https://example.com/mock/career-signal",
        source: "Mock Manual Source",
        sourceType: "mock",
        publishedAt: "2026-04-23T12:00:00.000Z"
      }
    ];

    const [canonicalItem] = normalizeRawItems(rawItems);

    expect(canonicalItem.category).toBe("career_skills");
    expect(canonicalItem.summaryCandidateText).toBe(rawItems[0].title);
    expect(canonicalItem.entities).toContain("Mock Manual Source");
    expect(canonicalItem.supportingUrls).toEqual([rawItems[0].url]);
  });
});
