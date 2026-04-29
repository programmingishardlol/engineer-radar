import type { CanonicalItem, Category } from "../types";
import { prisma } from "./client";
import { mapDbCanonicalItem, stringifyStringArray } from "./mappers";

export type CanonicalItemListOptions = {
  category?: Category;
  limit?: number;
};

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 100;
  }

  return Math.max(1, Math.min(500, Math.floor(limit)));
}

export async function countCanonicalItems(): Promise<number> {
  return prisma.canonicalItem.count();
}

export async function getCanonicalItemByUrl(url: string): Promise<CanonicalItem | null> {
  const item = await prisma.canonicalItem.findUnique({ where: { url } });
  return item ? mapDbCanonicalItem(item) : null;
}

export async function listCanonicalItems(options: CanonicalItemListOptions = {}): Promise<CanonicalItem[]> {
  const items = await prisma.canonicalItem.findMany({
    where: options.category ? { category: options.category } : undefined,
    orderBy: { publishedAt: "desc" },
    take: parseLimit(options.limit)
  });

  return items.map(mapDbCanonicalItem);
}

export async function saveCanonicalItems(items: CanonicalItem[]): Promise<{ saved: number }> {
  if (items.length === 0) {
    return { saved: 0 };
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.canonicalItem.upsert({
        where: { url: item.url },
        create: {
          id: item.id,
          title: item.title,
          url: item.url,
          source: item.source,
          sourceType: item.sourceType,
          publishedAt: new Date(item.publishedAt),
          category: item.category,
          entitiesJson: stringifyStringArray(item.entities),
          summaryCandidateText: item.summaryCandidateText,
          supportingUrlsJson: stringifyStringArray(item.supportingUrls)
        },
        update: {
          title: item.title,
          source: item.source,
          sourceType: item.sourceType,
          publishedAt: new Date(item.publishedAt),
          category: item.category,
          entitiesJson: stringifyStringArray(item.entities),
          summaryCandidateText: item.summaryCandidateText,
          supportingUrlsJson: stringifyStringArray(item.supportingUrls)
        }
      })
    )
  );

  return { saved: items.length };
}
