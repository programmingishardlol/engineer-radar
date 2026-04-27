import { collectMockRawItems } from "../../collectors/mockCollector";
import { normalizeRawItems } from "../../pipeline/normalize";
import { deduplicateCanonicalItems } from "../../pipeline/deduplicate";
import { rankItems } from "../../ranking/rankItems";

export async function runMockIngestJob() {
  const rawItems = await collectMockRawItems();
  const canonicalItems = deduplicateCanonicalItems(normalizeRawItems(rawItems));
  const rankedItems = rankItems(canonicalItems);

  return {
    rawItems,
    canonicalItems,
    rankedItems
  };
}
