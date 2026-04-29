import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCanonicalItems } from "../src/mocks/canonicalItems";
import { mockRankedItems } from "../src/mocks/rankedItems";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(async (operations: Array<Promise<unknown>>) => Promise.all(operations)),
    canonicalItem: {
      count: vi.fn(async () => 0),
      findMany: vi.fn(async (): Promise<unknown[]> => []),
      upsert: vi.fn(async (input: unknown) => input)
    },
    itemScore: {
      upsert: vi.fn(async (input: unknown) => input)
    },
    source: {
      findMany: vi.fn(async (): Promise<unknown[]> => [])
    },
    userPreference: {
      findFirst: vi.fn(async () => null),
      create: vi.fn(async (input: { data: { preferredJson: string; mutedJson: string; minScore: number } }) => ({
        id: "preference-1",
        ...input.data
      })),
      update: vi.fn(async (input: { data: { preferredJson: string; mutedJson: string; minScore: number } }) => ({
        id: "preference-1",
        ...input.data
      }))
    }
  }
}));

vi.mock("../src/db/client", () => ({
  prisma: prismaMock
}));

describe("database repository fallbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (operations: Array<Promise<unknown>>) => Promise.all(operations));
    prismaMock.canonicalItem.count.mockResolvedValue(0);
    prismaMock.canonicalItem.findMany.mockResolvedValue([]);
    prismaMock.canonicalItem.upsert.mockImplementation(async (input: unknown) => input);
    prismaMock.itemScore.upsert.mockImplementation(async (input: unknown) => input);
    prismaMock.source.findMany.mockResolvedValue([]);
    prismaMock.userPreference.findFirst.mockResolvedValue(null);
  });

  it("saves canonical items and ranked item scores through Prisma repositories", async () => {
    const { saveCanonicalItems, saveRankedItems } = await import("../src/db/itemsRepo");

    await expect(saveCanonicalItems(mockCanonicalItems)).resolves.toEqual({ saved: mockCanonicalItems.length });

    prismaMock.canonicalItem.findMany.mockResolvedValue(
      mockRankedItems.map((item) => ({
        id: item.id,
        url: item.url
      }))
    );

    await expect(saveRankedItems(mockRankedItems)).resolves.toEqual({ saved: mockRankedItems.length });
  });

  it("returns deterministic default preferences when no preference exists", async () => {
    const { getDefaultPreferences } = await import("../src/db/preferencesRepo");

    await expect(getDefaultPreferences()).resolves.toEqual({
      preferredCategories: [],
      mutedCategories: [],
      minScore: 0
    });
  });

  it("returns no persisted sources when source storage is empty", async () => {
    const { listSources } = await import("../src/db/sourcesRepo");

    await expect(listSources()).resolves.toEqual([]);
  });
});
