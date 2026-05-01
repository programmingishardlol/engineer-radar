import { describe, expect, it } from "vitest";
import { runIngestJob } from "../src/server/jobs/ingestJob";
import type { SourceRegistryItem } from "../src/types";

const source: SourceRegistryItem = {
  id: "rss-test-source",
  name: "RSS Test Source",
  url: "https://example.com/rss.xml",
  category: "developer_tools",
  sourceType: "rss",
  fetchMethod: "rss",
  credibility: 5,
  enabled: true
};

const xml = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Developer tool adds agent debugging workflow</title>
    <link href="https://example.com/devtool-agent-debugging" />
    <updated>2026-04-28T15:00:00.000Z</updated>
    <summary>A devtool release improves coding agent debugging, tests, and code review.</summary>
  </entry>
</feed>`;

describe("runIngestJob", () => {
  it("fetches RSS sources, normalizes, deduplicates, and ranks real feed items", async () => {
    const result = await runIngestJob({
      persist: false,
      sources: [source],
      fetch: async () => new Response(xml, { status: 200 })
    });

    expect(result.stats).toMatchObject({
      fetched: 1,
      usedFallback: false,
      sourceCount: 1
    });
    expect(result.rawItems).toHaveLength(1);
    expect(result.canonicalItems).toHaveLength(1);
    expect(result.rankedItems).toHaveLength(1);
    expect(result.rankedItems[0]).toMatchObject({
      title: "Developer tool adds agent debugging workflow",
      source: "RSS Test Source",
      sourceType: "rss",
      category: "developer_tools"
    });
  });

  it("falls back to mock data when RSS sources return no items", async () => {
    const result = await runIngestJob({
      persist: false,
      sources: [source],
      fetch: async () => new Response("", { status: 500 })
    });

    expect(result.stats.usedFallback).toBe(true);
    expect(result.stats.fetched).toBeGreaterThan(1);
    expect(result.rawItems.every((item) => item.sourceType === "mock")).toBe(true);
    expect(result.rankedItems.length).toBeGreaterThan(0);
  });
});
