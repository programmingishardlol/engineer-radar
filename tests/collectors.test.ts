import { describe, expect, it } from "vitest";
import { collectArxivItems } from "../src/collectors/arxivCollector";
import { collectCompanyBlogItems } from "../src/collectors/companyBlogCollector";
import { collectGitHubItems } from "../src/collectors/githubCollector";
import { collectHackerNewsItems } from "../src/collectors/hackerNewsCollector";
import { collectMockRawItems } from "../src/collectors/mockCollector";
import { collectRssItems } from "../src/collectors/rssCollector";
import { defaultRssSources } from "../src/collectors/sourceRegistry";
import { mockRawItems } from "../src/mocks/rawItems";
import { sourceTypes, type SourceRegistryItem } from "../src/types";

const sampleRssXml = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Example Feed</title>
    <item>
      <title>Example AI model release</title>
      <link>https://example.com/model-release?utm_source=rss</link>
      <pubDate>Tue, 28 Apr 2026 12:00:00 GMT</pubDate>
      <description><![CDATA[An AI lab shipped a model update for developers.]]></description>
    </item>
  </channel>
</rss>`;

const rssSource: SourceRegistryItem = {
  id: "example-feed",
  name: "Example AI Blog",
  url: "https://example.com/feed.xml",
  category: "ai_models",
  sourceType: "rss",
  fetchMethod: "rss",
  credibility: 5,
  enabled: true
};

describe("collectors", () => {
  it("returns the stable mock raw item fixtures without live fetching", async () => {
    const rawItems = await collectMockRawItems();

    expect(rawItems).toStrictEqual(mockRawItems);
    expect(rawItems).toHaveLength(11);
    expect(rawItems.every((item) => item.sourceType === "mock")).toBe(true);
    expect(rawItems.every((item) => sourceTypes.includes(item.sourceType))).toBe(true);
    expect(rawItems.every((item) => item.metadata?.demo === true)).toBe(true);
  });

  it("keeps real external collectors as empty typed stubs for the mock MVP", async () => {
    const collectorResults = await Promise.all([
      collectArxivItems(),
      collectCompanyBlogItems(),
      collectGitHubItems(),
      collectHackerNewsItems(),
      collectRssItems()
    ]);

    expect(collectorResults).toEqual([[], [], [], [], []]);
  });

  it("defines a small enabled registry of free RSS and Atom sources", () => {
    expect(defaultRssSources.length).toBeGreaterThanOrEqual(5);
    expect(defaultRssSources.length).toBeLessThanOrEqual(8);
    expect(defaultRssSources.every((source) => source.enabled)).toBe(true);
    expect(defaultRssSources.every((source) => source.fetchMethod === "rss")).toBe(true);
    expect(new Set(defaultRssSources.map((source) => source.url)).size).toBe(defaultRssSources.length);
  });

  it("fetches RSS XML and converts feed entries into RawItem objects with source metadata", async () => {
    const rawItems = await collectRssItems({
      source: rssSource,
      fetch: async () => new Response(sampleRssXml, { status: 200 }),
      now: () => new Date("2026-04-29T00:00:00.000Z")
    });

    expect(rawItems).toHaveLength(1);
    expect(rawItems[0]).toMatchObject({
      title: "Example AI model release",
      url: "https://example.com/model-release?utm_source=rss",
      source: "Example AI Blog",
      sourceType: "rss",
      publishedAt: "2026-04-28T12:00:00.000Z",
      rawText: "An AI lab shipped a model update for developers.",
      metadata: {
        feedUrl: rssSource.url,
        feedFormat: "rss",
        category: "ai_models",
        sourceCredibility: 5
      }
    });
  });

  it("keeps RSS collection bounded to recent feed entries", async () => {
    const itemXml = Array.from(
      { length: 25 },
      (_, index) => `
        <item>
          <title>Example update ${index}</title>
          <link>https://example.com/update-${index}</link>
          <pubDate>Tue, 28 Apr 2026 12:${String(index).padStart(2, "0")}:00 GMT</pubDate>
        </item>`
    ).join("");

    const rawItems = await collectRssItems({
      source: rssSource,
      fetch: async () => new Response(`<rss><channel>${itemXml}</channel></rss>`, { status: 200 })
    });

    expect(rawItems).toHaveLength(20);
    expect(rawItems[0].title).toBe("Example update 0");
    expect(rawItems[19].title).toBe("Example update 19");
  });
});
