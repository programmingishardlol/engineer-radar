import type { CanonicalItem } from "../types";

const trackingParams = new Set([
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "spm",
  "trk"
]);

const titleStopWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "for",
  "from",
  "in",
  "new",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with"
]);

export function normalizeItemUrl(url: string): string {
  const trimmedUrl = url.trim();

  try {
    const parsed = new URL(trimmedUrl);
    parsed.hash = "";

    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    for (const key of Array.from(parsed.searchParams.keys())) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey.startsWith("utm_") || trackingParams.has(normalizedKey)) {
        parsed.searchParams.delete(key);
      }
    }

    parsed.searchParams.sort();

    if (parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return trimmedUrl.toLowerCase().replace(/\/+$/, "");
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleTokens(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(" ")
      .filter((token) => token.length > 1 && !titleStopWords.has(token))
  );
}

export function getTitleSimilarity(firstTitle: string, secondTitle: string): number {
  const normalizedFirst = normalizeTitle(firstTitle);
  const normalizedSecond = normalizeTitle(secondTitle);

  if (!normalizedFirst || !normalizedSecond) {
    return 0;
  }

  if (normalizedFirst === normalizedSecond) {
    return 1;
  }

  const firstTokens = titleTokens(firstTitle);
  const secondTokens = titleTokens(secondTitle);

  if (firstTokens.size === 0 || secondTokens.size === 0) {
    return 0;
  }

  const intersectionSize = Array.from(firstTokens).filter((token) => secondTokens.has(token)).length;
  const unionSize = new Set([...firstTokens, ...secondTokens]).size;

  return Math.round((intersectionSize / unionSize) * 100) / 100;
}

export function getTitleSimilarityPlaceholder(firstTitle: string, secondTitle: string): number {
  return getTitleSimilarity(firstTitle, secondTitle);
}

function getNormalizedSupportingUrls(item: CanonicalItem): string[] {
  return Array.from(new Set([item.url, ...item.supportingUrls].map(normalizeItemUrl).filter(Boolean)));
}

export function deduplicateCanonicalItems(items: CanonicalItem[]): CanonicalItem[] {
  const byUrl = new Map<string, CanonicalItem>();

  for (const item of items) {
    const normalizedUrl = normalizeItemUrl(item.url);
    const existing = byUrl.get(normalizedUrl);

    if (!existing) {
      byUrl.set(normalizedUrl, {
        ...item,
        url: normalizedUrl,
        supportingUrls: getNormalizedSupportingUrls(item)
      });
      continue;
    }

    byUrl.set(normalizedUrl, {
      ...existing,
      entities: Array.from(new Set([...existing.entities, ...item.entities])),
      supportingUrls: Array.from(new Set([...existing.supportingUrls, ...getNormalizedSupportingUrls(item)]))
    });
  }

  return Array.from(byUrl.values());
}
