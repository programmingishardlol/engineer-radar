import type { RankedItem } from "../types";
import { saveCanonicalItems } from "./canonicalItemsRepo";
import { listRankedItems, saveRankedItemScores } from "./itemScoresRepo";

export { countCanonicalItems, getCanonicalItemByUrl, listCanonicalItems, saveCanonicalItems } from "./canonicalItemsRepo";
export { countRawItems, getRawItemByUrl, listRawItems, saveRawItems } from "./rawItemsRepo";
export { countRankedItems, listRankedItems, saveItemScore, saveItemScores, saveRankedItemScores } from "./itemScoresRepo";
export { countSeenItems, isItemSeen, listSeenItems, markItemSeen } from "./seenItemsRepo";

export async function saveRankedItems(items: RankedItem[]): Promise<{ saved: number }> {
  await saveCanonicalItems(items);
  return saveRankedItemScores(items);
}

export async function listSavedRankedItems(options: Parameters<typeof listRankedItems>[0] = {}): Promise<RankedItem[]> {
  return listRankedItems(options);
}
