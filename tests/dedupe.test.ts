import { describe, expect, it } from "vitest";
import { dedupeUpdates } from "../src/lib/dedupe";
import { normalizeUpdate } from "../src/lib/normalize";

describe("dedupeUpdates", () => {
  it("removes duplicate updates by URL or duplicate group and keeps the higher score", () => {
    const lowScore = normalizeUpdate({
      title: "AI coding assistant memory update",
      sourceName: "Example Blog",
      sourceUrl: "https://example.com/update",
      publishedAt: "2026-04-20",
      category: "AI Coding Tool Updates",
      company: "Example",
      summary: "A short summary.",
      whyItMatters: "A short reason.",
      whoShouldCare: "Developers",
      technicalKeywords: ["agents"],
      score: 3.2
    });
    const highScore = { ...lowScore, id: "newer", score: 4.4 };

    const result = dedupeUpdates([lowScore, highScore]);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("newer");
    expect(result[0].score).toBe(4.4);
  });
});
