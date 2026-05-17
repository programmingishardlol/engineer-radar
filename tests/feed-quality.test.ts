import { describe, expect, it } from "vitest";
import { normalizeRawItems } from "../src/pipeline/normalize";
import type { RawItem } from "../src/types";

const baseRawItem: RawItem = {
  id: "raw-quality-fixture",
  title: "Cloud provider publishes update",
  url: "https://example.com/update",
  source: "Example Cloud Blog",
  sourceType: "company_blog",
  publishedAt: "2026-05-15T12:00:00.000Z",
  metadata: {
    category: "cloud_infrastructure"
  }
};

describe("feed quality normalization", () => {
  it("lets strong security evidence beat a broad source default category", () => {
    const [item] = normalizeRawItems([
      {
        ...baseRawItem,
        title: "Critical Linux kernel vulnerability mitigation for production fleets",
        rawText: "Security engineers describe a CVE, exploit risk, patch rollout, and mitigation steps."
      }
    ]);

    expect(item.category).toBe("security");
  });

  it("keeps infrastructure category for debugging and reliability posts from infra sources", () => {
    const [item] = normalizeRawItems([
      {
        ...baseRawItem,
        title: "ClickHouse query planner contention slowed a billing pipeline",
        rawText: "Engineers investigated database lock contention, query planning, latency, and upstream patches."
      }
    ]);

    expect(item.category).toBe("cloud_infrastructure");
  });
});
