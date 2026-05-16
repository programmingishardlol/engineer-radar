import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CanonicalItem, RankedItem, RawItem, SourceRegistryItem } from "../src/types";

const {
  saveCanonicalItemsMock,
  saveRankedItemScoresMock,
  saveRawItemsMock
} = vi.hoisted(() => ({
  saveCanonicalItemsMock: vi.fn(async (items: CanonicalItem[]) => ({ saved: items.length })),
  saveRankedItemScoresMock: vi.fn(async (items: RankedItem[]) => ({ saved: items.length })),
  saveRawItemsMock: vi.fn(async (items: RawItem[]) => ({ saved: items.length }))
}));

vi.mock("../src/db/itemsRepo", () => ({
  saveCanonicalItems: saveCanonicalItemsMock,
  saveRankedItemScores: saveRankedItemScoresMock,
  saveRawItems: saveRawItemsMock
}));

const source: SourceRegistryItem = {
  id: "rss-persist-test-source",
  name: "RSS Persist Test Source",
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
    <title>Developer tool adds persistent refresh workflow</title>
    <link href="https://example.com/devtool-persistent-refresh" />
    <updated>2026-04-28T15:00:00.000Z</updated>
    <summary>A devtool release improves refresh persistence, tests, and code review.</summary>
  </entry>
</feed>`;

describe("runIngestJob persistence", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    delete process.env.DATABASE_URL;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("persists when persist is requested even if the process did not preload DATABASE_URL", async () => {
    const { runIngestJob } = await import("../src/server/jobs/ingestJob");

    const result = await runIngestJob({
      persist: true,
      sources: [source],
      fetch: async () => new Response(xml, { status: 200 })
    });

    expect(saveRawItemsMock).toHaveBeenCalledOnce();
    expect(saveCanonicalItemsMock).toHaveBeenCalledOnce();
    expect(saveRankedItemScoresMock).toHaveBeenCalledOnce();
    expect(result.stats.saved).toBe(1);
  });
});
