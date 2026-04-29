import type { CanonicalItem, Category, SourceType } from "../types";

const likelyTitleDuplicateThreshold = 0.82;

const trackingParams = new Set([
  "_hsenc",
  "_hsmi",
  "fbclid",
  "gclid",
  "igshid",
  "mkt_tok",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "s_cid",
  "spm",
  "trk",
  "vero_id"
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

const categoryCompatibilityGroups: Category[][] = [
  ["ai_models", "research", "developer_tools"],
  ["developer_tools", "open_source", "career_skills"],
  ["security", "cloud_infrastructure", "open_source"],
  ["hardware", "cloud_infrastructure", "research"],
  ["startups", "company_moves"]
];

const sourceTypeQuality: Record<SourceType, number> = {
  company_blog: 6,
  github: 5,
  arxiv: 5,
  rss: 4,
  manual: 3,
  hacker_news: 2,
  mock: 1
};

export function normalizeItemUrl(url: string): string {
  const trimmedUrl = url.trim();

  try {
    const parsed = new URL(trimmedUrl);
    parsed.hash = "";

    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    for (const key of Array.from(parsed.searchParams.keys())) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey.startsWith("utm_") || normalizedKey.startsWith("utm-") || trackingParams.has(normalizedKey)) {
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

function normalizedSourceName(source: string): string {
  return source
    .toLowerCase()
    .replace(/\b(blog|changelog|feed|mirror|news|rss)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getUrlHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
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

function categoriesAreCompatible(first: Category, second: Category): boolean {
  if (first === second) {
    return true;
  }

  return categoryCompatibilityGroups.some((group) => group.includes(first) && group.includes(second));
}

function entitiesOverlap(first: CanonicalItem, second: CanonicalItem): boolean {
  const firstEntities = new Set(first.entities.map((entity) => entity.toLowerCase()));
  return second.entities.some((entity) => firstEntities.has(entity.toLowerCase()));
}

function sourcesAreCompatible(first: CanonicalItem, second: CanonicalItem): boolean {
  const firstSource = normalizedSourceName(first.source);
  const secondSource = normalizedSourceName(second.source);
  const firstHost = getUrlHost(first.url);
  const secondHost = getUrlHost(second.url);

  return (
    firstSource === secondSource ||
    first.sourceType === second.sourceType ||
    Boolean(firstHost && firstHost === secondHost) ||
    entitiesOverlap(first, second)
  );
}

function itemsAreLikelyTitleDuplicates(first: CanonicalItem, second: CanonicalItem): boolean {
  if (!categoriesAreCompatible(first.category, second.category) || !sourcesAreCompatible(first, second)) {
    return false;
  }

  return getTitleSimilarity(first.title, second.title) >= likelyTitleDuplicateThreshold;
}

function primaryScore(item: CanonicalItem): number {
  const publishedAtMs = Date.parse(item.publishedAt);
  const recencyScore = Number.isNaN(publishedAtMs) ? 0 : publishedAtMs / 1_000_000_000_000;
  const summaryScore = Math.min(item.summaryCandidateText.length / 500, 1);
  const supportScore = Math.min(item.supportingUrls.length, 3) * 0.1;

  return sourceTypeQuality[item.sourceType] + recencyScore + summaryScore + supportScore;
}

function choosePrimary(first: CanonicalItem, second: CanonicalItem): CanonicalItem {
  const firstScore = primaryScore(first);
  const secondScore = primaryScore(second);

  if (firstScore !== secondScore) {
    return firstScore > secondScore ? first : second;
  }

  return first.id.localeCompare(second.id) <= 0 ? first : second;
}

function mergeItems(first: CanonicalItem, second: CanonicalItem): CanonicalItem {
  const primary = choosePrimary(first, second);
  const secondary = primary.id === first.id ? second : first;
  const supportingUrls = Array.from(
    new Set([...getNormalizedSupportingUrls(primary), ...getNormalizedSupportingUrls(secondary)])
  );

  return {
    ...primary,
    url: normalizeItemUrl(primary.url),
    entities: Array.from(new Set([...primary.entities, ...secondary.entities])),
    supportingUrls
  };
}

function deduplicateByUrl(items: CanonicalItem[]): CanonicalItem[] {
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

    byUrl.set(normalizedUrl, mergeItems(existing, item));
  }

  return Array.from(byUrl.values());
}

export function deduplicateCanonicalItems(items: CanonicalItem[]): CanonicalItem[] {
  const exactUrlDeduped = deduplicateByUrl(items);
  const deduped: CanonicalItem[] = [];

  for (const item of exactUrlDeduped) {
    const duplicateIndex = deduped.findIndex((existing) => itemsAreLikelyTitleDuplicates(existing, item));

    if (duplicateIndex === -1) {
      deduped.push(item);
      continue;
    }

    deduped[duplicateIndex] = mergeItems(deduped[duplicateIndex], item);
  }

  return deduped;
}
