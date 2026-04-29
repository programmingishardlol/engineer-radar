import { describe, expect, it } from "vitest";
import { mockCanonicalItems } from "../src/mocks/canonicalItems";
import { mockRankedItems } from "../src/mocks/rankedItems";
import { getDefaultPreferences } from "../src/db/preferencesRepo";
import { listSources } from "../src/db/sourcesRepo";
import { saveCanonicalItems, saveRankedItems } from "../src/db/itemsRepo";

describe("database fallback stubs", () => {
  it("does not report saved records before Prisma persistence is wired", async () => {
    await expect(saveCanonicalItems(mockCanonicalItems)).resolves.toEqual({ saved: 0 });
    await expect(saveRankedItems(mockRankedItems)).resolves.toEqual({ saved: 0 });
  });

  it("returns deterministic default preferences without requiring database state", async () => {
    await expect(getDefaultPreferences()).resolves.toEqual({
      preferredCategories: [],
      mutedCategories: [],
      minScore: 0
    });
  });

  it("returns no persisted sources while source registry persistence is still a fallback", async () => {
    await expect(listSources()).resolves.toEqual([]);
  });
});
