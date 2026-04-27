import { describe, expect, it } from "vitest";
import { createDuplicateGroupId, normalizeTitle, normalizeUpdate } from "../src/lib/normalize";

describe("normalizeTitle", () => {
  it("creates a stable lowercase title key without punctuation noise", () => {
    expect(normalizeTitle("  OpenAI: New Model Update!!! ")).toBe("openai new model update");
  });
});

describe("normalizeUpdate", () => {
  it("normalizes category, keywords, and duplicate group id", () => {
    const update = normalizeUpdate({
      title: "GPU Memory Update",
      sourceName: "NVIDIA Blog",
      sourceUrl: "https://example.com/gpu",
      publishedAt: "2026-04-20",
      category: "Hardware and Computing",
      company: "NVIDIA",
      summary: "A short summary.",
      whyItMatters: "A short reason.",
      whoShouldCare: "GPU engineers",
      technicalKeywords: [" HBM ", "gpu", "HBM"]
    });

    expect(update.category).toBe("Hardware and Computing");
    expect(update.technicalKeywords).toEqual(["hbm", "gpu"]);
    expect(update.duplicateGroupId).toBe(createDuplicateGroupId(update));
  });
});
