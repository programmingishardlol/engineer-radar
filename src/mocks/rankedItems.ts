import { mockCanonicalItems } from "./canonicalItems";
import { deduplicateCanonicalItems } from "../pipeline/deduplicate";
import { rankItems } from "../ranking/rankItems";

export const mockRankedItems = rankItems(deduplicateCanonicalItems(mockCanonicalItems));
