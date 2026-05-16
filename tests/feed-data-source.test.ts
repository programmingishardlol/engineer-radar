import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RankedItem } from "../src/types";

const {
  countCanonicalItemsMock,
  countRankedItemsMock,
  listSavedRankedItemsMock,
  runMockIngestJobMock
} = vi.hoisted(() => ({
  countCanonicalItemsMock: vi.fn(),
  countRankedItemsMock: vi.fn(),
  listSavedRankedItemsMock: vi.fn(),
  runMockIngestJobMock: vi.fn()
}));

vi.mock("../src/db/itemsRepo", () => ({
  countCanonicalItems: countCanonicalItemsMock,
  countRankedItems: countRankedItemsMock,
  listSavedRankedItems: listSavedRankedItemsMock
}));

vi.mock("../src/server/jobs/ingestJob", () => ({
  runMockIngestJob: runMockIngestJobMock
}));

const savedItem: RankedItem = {
  id: "saved-rss-item",
  title: "Saved RSS item",
  url: "https://example.com/saved-rss-item",
  source: "RSS Source",
  sourceType: "rss",
  publishedAt: "2026-05-15T12:00:00.000Z",
  category: "developer_tools",
  entities: ["RSS Source"],
  summaryCandidateText: "A saved RSS item.",
  supportingUrls: ["https://example.com/saved-rss-item"],
  score: {
    engineeringImpact: 4,
    novelty: 4,
    careerRelevance: 4,
    credibility: 5,
    urgency: 3,
    hypeRisk: 1,
    finalScore: 4
  },
  summary: "A saved RSS item.",
  whyEngineersCare: "It affects developer workflows.",
  whoShouldCare: "Developers",
  suggestedAction: "Read the source.",
  confidence: 0.82
};

const mockItem: RankedItem = {
  ...savedItem,
  id: "mock-item",
  title: "Mock/demo item",
  url: "https://example.com/mock-item",
  source: "Mock Source",
  sourceType: "mock"
};

describe("getFeed data source metadata", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "file:./test.db";
    countCanonicalItemsMock.mockReset();
    countRankedItemsMock.mockReset();
    listSavedRankedItemsMock.mockReset();
    runMockIngestJobMock.mockReset();
  });

  it("marks persisted results as database-backed", async () => {
    const { getFeed } = await import("../src/server/feedService");
    countCanonicalItemsMock.mockResolvedValue(3);
    listSavedRankedItemsMock.mockResolvedValue([savedItem]);
    countRankedItemsMock.mockResolvedValue(3);

    const feed = await getFeed({ limit: 1 });

    expect(feed).toMatchObject({
      dataSource: "database",
      items: [savedItem],
      total: 3
    });
    expect(feed).not.toHaveProperty("fallbackReason");
    expect(runMockIngestJobMock).not.toHaveBeenCalled();
  });

  it("uses mock data only as an explicit mode or when the database is empty", async () => {
    const { getFeed } = await import("../src/server/feedService");
    runMockIngestJobMock.mockResolvedValue({ rankedItems: [mockItem] });

    const explicitMockFeed = await getFeed({ mode: "mock" });

    expect(explicitMockFeed).toMatchObject({
      dataSource: "mock",
      fallbackReason: "explicit_mock_mode",
      items: [mockItem],
      total: 1
    });
    expect(countCanonicalItemsMock).not.toHaveBeenCalled();

    countCanonicalItemsMock.mockResolvedValue(0);

    const emptyDatabaseFeed = await getFeed({ limit: 1 });

    expect(emptyDatabaseFeed).toMatchObject({
      dataSource: "mock",
      fallbackReason: "database_empty",
      items: [mockItem],
      total: 1
    });
  });
});
