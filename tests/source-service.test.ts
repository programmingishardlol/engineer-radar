import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SourceRegistryItem, SourceStats } from "../src/types";

const {
  listSourceStatsMock,
  listSourcesMock,
  setSourceEnabledMock,
  syncSourcesMock
} = vi.hoisted(() => ({
  listSourceStatsMock: vi.fn(),
  listSourcesMock: vi.fn(),
  setSourceEnabledMock: vi.fn(),
  syncSourcesMock: vi.fn()
}));

vi.mock("../src/db/sourcesRepo", () => ({
  listSourceStats: listSourceStatsMock,
  listSources: listSourcesMock,
  setSourceEnabled: setSourceEnabledMock,
  syncSources: syncSourcesMock
}));

const source: SourceRegistryItem = {
  id: "source-a",
  name: "Source A",
  url: "https://example.com/feed.xml",
  category: "developer_tools",
  sourceType: "rss",
  fetchMethod: "rss",
  credibility: 5,
  enabled: true,
  priority: 90,
  includeKeywords: ["api"],
  excludeKeywords: ["webinar"]
};

const disabledSource: SourceRegistryItem = {
  ...source,
  enabled: false
};

const stats: SourceStats = {
  sourceName: "Source A",
  savedItemCount: 12,
  latestPublishedAt: "2026-05-15T12:00:00.000Z",
  lastSavedAt: "2026-05-15T12:05:00.000Z"
};

describe("source service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncSourcesMock.mockResolvedValue(undefined);
    listSourcesMock.mockResolvedValue([source]);
    listSourceStatsMock.mockResolvedValue([stats]);
    setSourceEnabledMock.mockResolvedValue(disabledSource);
  });

  it("syncs default registry sources and returns admin rows with saved item stats", async () => {
    const { listAdminSources } = await import("../src/server/sourceService");

    const sources = await listAdminSources([source]);

    expect(syncSourcesMock).toHaveBeenCalledWith([source]);
    expect(sources).toEqual([
      {
        ...source,
        stats: {
          savedItemCount: 12,
          latestPublishedAt: "2026-05-15T12:00:00.000Z",
          lastSavedAt: "2026-05-15T12:05:00.000Z"
        }
      }
    ]);
  });

  it("uses persisted enabled state when building sources for ingestion", async () => {
    const { getConfiguredRssSources } = await import("../src/server/sourceService");
    listSourcesMock.mockResolvedValue([disabledSource]);

    const sources = await getConfiguredRssSources([source]);

    expect(sources).toHaveLength(0);
  });

  it("updates source enabled state through the repository", async () => {
    const { updateSourceEnabled } = await import("../src/server/sourceService");

    const updated = await updateSourceEnabled(source.url, false);

    expect(setSourceEnabledMock).toHaveBeenCalledWith(source.url, false);
    expect(updated.enabled).toBe(false);
  });
});
