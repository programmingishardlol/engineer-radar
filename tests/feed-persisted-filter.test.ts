import { beforeEach, describe, expect, it, vi } from "vitest";

const { countCanonicalItemsMock, countRankedItemsMock, listSavedRankedItemsMock, runMockIngestJobMock } = vi.hoisted(
  () => ({
    countCanonicalItemsMock: vi.fn(),
    countRankedItemsMock: vi.fn(),
    listSavedRankedItemsMock: vi.fn(),
    runMockIngestJobMock: vi.fn()
  })
);

vi.mock("../src/db/itemsRepo", () => ({
  countCanonicalItems: countCanonicalItemsMock,
  countRankedItems: countRankedItemsMock,
  listSavedRankedItems: listSavedRankedItemsMock
}));

vi.mock("../src/server/jobs/ingestJob", () => ({
  runMockIngestJob: runMockIngestJobMock
}));

describe("getFeed persisted category filters", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "file:./test.db";
    countCanonicalItemsMock.mockReset();
    countRankedItemsMock.mockReset();
    listSavedRankedItemsMock.mockReset();
    runMockIngestJobMock.mockReset();
  });

  it("returns an empty persisted category result instead of falling back to mock items", async () => {
    const { getFeed } = await import("../src/server/feedService");
    countCanonicalItemsMock.mockResolvedValue(12);
    listSavedRankedItemsMock.mockResolvedValue([]);
    countRankedItemsMock.mockResolvedValue(0);

    const feed = await getFeed({ category: "hardware", limit: 24 });

    expect(feed.items).toEqual([]);
    expect(feed.total).toBe(0);
    expect(feed.dataSource).toBe("database");
    expect(listSavedRankedItemsMock).toHaveBeenCalledWith({
      category: "hardware",
      includeMock: false,
      minScore: 0,
      limit: 24
    });
    expect(runMockIngestJobMock).not.toHaveBeenCalled();
  });
});
