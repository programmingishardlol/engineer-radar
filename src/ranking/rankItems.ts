import type { CanonicalItem, RankedItem } from "../types";
import { rankItem } from "./rankItem";

export function rankItems(items: CanonicalItem[]): RankedItem[] {
  return items
    .map(rankItem)
    .sort((first, second) => {
      if (second.score.finalScore !== first.score.finalScore) {
        return second.score.finalScore - first.score.finalScore;
      }

      return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
    });
}
