import { describe, expect, it } from "vitest";
import { sourceRegistry } from "../src/lib/sources";

describe("sourceRegistry", () => {
  it("starts with enabled free sources across the MVP categories", () => {
    const categories = new Set(sourceRegistry.map((source) => source.category));

    expect(sourceRegistry.every((source) => source.enabled)).toBe(true);
    expect(sourceRegistry.every((source) => source.trustScore >= 3)).toBe(true);
    expect(categories.has("AI Model Updates")).toBe(true);
    expect(categories.has("AI Coding Tool Updates")).toBe(true);
    expect(categories.has("Open Source and Developer Infrastructure")).toBe(true);
  });
});
