import type { CanonicalItem } from "../types";

export function normalizeItemUrl(url: string): string {
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

export function getTitleSimilarityPlaceholder(firstTitle: string, secondTitle: string): number {
  return firstTitle.toLowerCase() === secondTitle.toLowerCase() ? 1 : 0;
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
        supportingUrls: [normalizedUrl]
      });
      continue;
    }

    byUrl.set(normalizedUrl, {
      ...existing,
      supportingUrls: Array.from(new Set([...existing.supportingUrls.map(normalizeItemUrl), normalizedUrl]))
    });
  }

  return Array.from(byUrl.values());
}
