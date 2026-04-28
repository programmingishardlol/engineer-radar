import type { RawItem } from "../types";
import { prisma } from "./client";
import { mapDbRawItem } from "./mappers";

export type RawItemListOptions = {
  limit?: number;
};

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 100;
  }

  return Math.max(1, Math.min(500, Math.floor(limit)));
}

export async function countRawItems(): Promise<number> {
  return prisma.rawItem.count();
}

export async function getRawItemByUrl(url: string): Promise<RawItem | null> {
  const item = await prisma.rawItem.findUnique({ where: { url } });
  return item ? mapDbRawItem(item) : null;
}

export async function listRawItems(options: RawItemListOptions = {}): Promise<RawItem[]> {
  const items = await prisma.rawItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: parseLimit(options.limit)
  });

  return items.map(mapDbRawItem);
}

export async function saveRawItems(items: RawItem[]): Promise<{ saved: number }> {
  if (items.length === 0) {
    return { saved: 0 };
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.rawItem.upsert({
        where: { url: item.url },
        create: {
          externalId: item.id,
          title: item.title,
          url: item.url,
          sourceName: item.source,
          sourceType: item.sourceType,
          publishedAt: new Date(item.publishedAt),
          rawText: item.rawText,
          metadata: item.metadata
        },
        update: {
          externalId: item.id,
          title: item.title,
          sourceName: item.source,
          sourceType: item.sourceType,
          publishedAt: new Date(item.publishedAt),
          rawText: item.rawText,
          metadata: item.metadata
        }
      })
    )
  );

  return { saved: items.length };
}
