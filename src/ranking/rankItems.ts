import type { CanonicalItem, RankedItem } from "../types";
import { rankItem } from "./rankItem";

export function rankItems(items: CanonicalItem[]): RankedItem[] {
  return items
    .map(rankItem)
    .sort((first, second) => {
      if (second.score.finalScore !== first.score.finalScore) {
        return second.score.finalScore - first.score.finalScore;
      }

      const publishedDelta = new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();

      if (publishedDelta !== 0) {
        return publishedDelta;
      }

      return first.id.localeCompare(second.id);
    });
}
