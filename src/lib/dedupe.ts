import type { NormalizedUpdate } from "./types";

function isBetterCandidate(candidate: NormalizedUpdate, current: NormalizedUpdate): boolean {
  if (candidate.score !== current.score) {
    return candidate.score > current.score;
  }

  return new Date(candidate.publishedAt).getTime() > new Date(current.publishedAt).getTime();
}

export function dedupeUpdates(updates: NormalizedUpdate[]): NormalizedUpdate[] {
  const deduped: NormalizedUpdate[] = [];

  for (const update of updates) {
    const existingIndex = deduped.findIndex(
      (item) => item.sourceUrl === update.sourceUrl || item.duplicateGroupId === update.duplicateGroupId
    );

    if (existingIndex === -1) {
      deduped.push(update);
      continue;
    }

    if (isBetterCandidate(update, deduped[existingIndex])) {
      deduped[existingIndex] = update;
    }
  }

  return deduped.sort((first, second) => {
    if (second.score !== first.score) {
      return second.score - first.score;
    }

    return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
  });
}
