import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeedResponse } from "../src/types";

const { getFeedMock } = vi.hoisted(() => ({
  getFeedMock: vi.fn()
}));

vi.mock("../src/server/feedService", () => ({
  getFeed: getFeedMock,
  isCategory: (value: string | undefined) => value === "developer_tools"
}));

const { GET } = await import("../src/app/api/feed/route");

const feedResponse: FeedResponse = {
  items: [
    {
      id: "ranked-1",
      title: "Mock developer tool update",
      url: "https://example.com/tool-update",
      source: "Mock Source",
      sourceType: "mock",
      publishedAt: "2026-04-27T12:00:00.000Z",
      category: "developer_tools",
      entities: ["Mock Tool"],
      summaryCandidateText: "Mock tool update text.",
      supportingUrls: ["https://example.com/tool-update"],
      score: {
        engineeringImpact: 4,
        novelty: 4,
        careerRelevance: 4,
        credibility: 3,
        urgency: 3,
        hypeRisk: 1,
        finalScore: 3.75
      },
      summary: "A mock developer tool update shipped.",
      whyEngineersCare: "It affects local developer workflow choices.",
      whoShouldCare: "Frontend and platform engineers",
      suggestedAction: "Review the release notes.",
      confidence: 0.8
    }
  ],
  total: 1,
  generatedAt: "2026-04-27T12:01:00.000Z"
};

function makeRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost/api/feed${query}`);
}

describe("GET /api/feed route", () => {
  beforeEach(() => {
    getFeedMock.mockReset();
    getFeedMock.mockResolvedValue(feedResponse);
  });

  it("returns FeedResponse JSON and parses supported query params", async () => {
    const response = await GET(makeRequest("?category=developer_tools&minScore=3.2&limit=7"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(getFeedMock).toHaveBeenCalledWith({
      category: "developer_tools",
      minScore: 3.2,
      limit: 7
    });
    expect(json).toEqual(feedResponse);
  });

  it("ignores unknown categories instead of passing invalid category values to getFeed", async () => {
    const response = await GET(makeRequest("?category=semiconductors&limit=3"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(getFeedMock).toHaveBeenCalledWith({
      category: undefined,
      minScore: undefined,
      limit: 3
    });
    expect(json).toEqual(feedResponse);
  });

  it("returns the documented error envelope when feed construction fails", async () => {
    getFeedMock.mockRejectedValue(new Error("feed unavailable"));

    const response = await GET(makeRequest());
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(json).toEqual({
      error: {
        code: "internal_error",
        message: "Unable to build the feed."
      }
    });
  });
});
