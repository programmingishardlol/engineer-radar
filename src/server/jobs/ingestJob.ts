import { collectMockRawItems } from "../../collectors/mockCollector";
import { normalizeRawItems } from "../../pipeline/normalize";
import { deduplicateCanonicalItems } from "../../pipeline/deduplicate";
import { rankItems } from "../../ranking/rankItems";
import { saveCanonicalItems, saveRankedItemScores, saveRawItems } from "../../db/itemsRepo";

export type MockIngestJobOptions = {
  persist?: boolean;
};

export async function runMockIngestJob(options: MockIngestJobOptions = {}) {
  const rawItems = await collectMockRawItems();
  const canonicalItems = deduplicateCanonicalItems(normalizeRawItems(rawItems));
  const rankedItems = rankItems(canonicalItems);
  const persisted = options.persist
    ? {
        rawItems: await saveRawItems(rawItems),
        canonicalItems: await saveCanonicalItems(canonicalItems),
        rankedItems: await saveRankedItemScores(rankedItems)
      }
    : undefined;

  return {
    rawItems,
    canonicalItems,
    rankedItems,
    persisted
  };
}
