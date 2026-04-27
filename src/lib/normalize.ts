import { calculateUpdateScore } from "./scoring";
import type { NormalizedUpdate, RawUpdateInput } from "./types";

function stableHash(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createDuplicateGroupId(update: Pick<RawUpdateInput, "title" | "category" | "company">): string {
  const companyKey = update.company ? normalizeTitle(update.company) : "unknown";
  return `${update.category}:${companyKey}:${normalizeTitle(update.title)}`;
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("utm_content");
    parsed.searchParams.delete("utm_term");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

export function normalizeUpdate(input: RawUpdateInput): NormalizedUpdate {
  const normalizedTitle = normalizeTitle(input.title);
  const duplicateGroupId = createDuplicateGroupId(input);
  const now = new Date().toISOString();
  const scoreDetails = input.scoreDimensions ? calculateUpdateScore(input.scoreDimensions) : undefined;
  const score = input.score ?? scoreDetails?.finalScore ?? 3;

  return {
    ...input,
    id: input.id ?? `mock-${stableHash(`${duplicateGroupId}:${input.sourceUrl}`)}`,
    sourceUrl: normalizeUrl(input.sourceUrl),
    normalizedTitle,
    duplicateGroupId,
    technicalKeywords: Array.from(
      new Set(input.technicalKeywords.map((keyword) => keyword.trim().toLowerCase()).filter(Boolean))
    ),
    score,
    scoreDetails,
    firstSeenAt: now,
    lastSeenAt: now,
    isMock: input.isMock ?? false,
    viewed: input.viewed ?? false
  };
}

export function normalizeUpdates(inputs: RawUpdateInput[]): NormalizedUpdate[] {
  return inputs.map(normalizeUpdate);
}
