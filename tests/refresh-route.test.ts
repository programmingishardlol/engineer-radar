import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeedResponse, RankedItem } from "../src/types";

const { getFeedMock, runIngestJobMock } = vi.hoisted(() => ({
  getFeedMock: vi.fn(),
  runIngestJobMock: vi.fn()
}));

vi.mock("../src/server/feedService", () => ({
  getFeed: getFeedMock,
  isCategory: (value: string | undefined) => value === "developer_tools"
}));

vi.mock("../src/server/jobs/ingestJob", () => ({
  runIngestJob: runIngestJobMock
}));

const { POST } = await import("../src/app/api/refresh/route");

const feedResponse: FeedResponse = {
  items: [],
  total: 0,
  generatedAt: "2026-04-29T12:00:00.000Z"
};

const rankedItem: RankedItem = {
  id: "ranked-rss-1",
  title: "RSS developer tool update",
  url: "https://example.com/rss-tool",
  source: "RSS Source",
  sourceType: "rss",
  publishedAt: "2026-04-28T12:00:00.000Z",
  category: "developer_tools",
  entities: ["RSS Source"],
  summaryCandidateText: "A developer tool update.",
  supportingUrls: ["https://example.com/rss-tool"],
  score: {
    engineeringImpact: 4,
    novelty: 4,
    careerRelevance: 4,
    credibility: 5,
    urgency: 3,
    hypeRisk: 1,
    finalScore: 3.9
  },
  summary: "A developer tool update.",
  whyEngineersCare: "It may affect developer workflows.",
  whoShouldCare: "Developers",
  suggestedAction: "Read the source.",
  confidence: 0.82
};

function makeRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost/api/refresh${query}`);
}

describe("POST /api/refresh route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runIngestJobMock.mockResolvedValue({
      rawItems: [],
      canonicalItems: [],
      rankedItems: [rankedItem],
      persisted: {
        rawItems: { saved: 3 },
        canonicalItems: { saved: 3 },
        rankedItems: { saved: 3 }
      },
      stats: {
        fetched: 3,
        saved: 3,
        usedFallback: false,
        sourceCount: 6
      }
    });
    getFeedMock.mockResolvedValue(feedResponse);
  });

  it("runs ingestion, returns refresh counts, and reloads the feed contract", async () => {
    const response = await POST(makeRequest("?category=developer_tools&limit=7"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(runIngestJobMock).toHaveBeenCalledWith({ persist: true });
    expect(getFeedMock).toHaveBeenCalledWith({
      category: "developer_tools",
      minScore: undefined,
      limit: 7
    });
    expect(json).toEqual({
      fetched: 3,
      saved: 3,
      usedFallback: false,
      sourceCount: 6,
      feed: feedResponse
    });
  });

  it("returns freshly ingested ranked items when persistence is unavailable", async () => {
    runIngestJobMock.mockResolvedValue({
      rawItems: [],
      canonicalItems: [],
      rankedItems: [rankedItem],
      persisted: undefined,
      stats: {
        fetched: 1,
        saved: 0,
        usedFallback: false,
        sourceCount: 1
      }
    });

    const response = await POST(makeRequest("?category=developer_tools&limit=1"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(getFeedMock).not.toHaveBeenCalled();
    expect(json).toMatchObject({
      fetched: 1,
      saved: 0,
      usedFallback: false,
      sourceCount: 1,
      feed: {
        items: [rankedItem],
        total: 1,
        generatedAt: expect.any(String)
      }
    });
  });
});
