import { prisma } from "./client";

export type SeenItemRecord = {
  id: string;
  canonicalItemId: string;
  seenAt: string;
};

function mapSeenItem(item: { id: string; canonicalItemId: string; seenAt: Date }): SeenItemRecord {
  return {
    id: item.id,
    canonicalItemId: item.canonicalItemId,
    seenAt: item.seenAt.toISOString()
  };
}

export async function countSeenItems(): Promise<number> {
  return prisma.seenItem.count();
}

export async function listSeenItems(): Promise<SeenItemRecord[]> {
  const items = await prisma.seenItem.findMany({
    orderBy: { seenAt: "desc" }
  });

  return items.map(mapSeenItem);
}

export async function isItemSeen(canonicalItemId: string): Promise<boolean> {
  const item = await prisma.seenItem.findUnique({ where: { canonicalItemId } });
  return item !== null;
}

export async function markItemSeen(canonicalItemId: string): Promise<SeenItemRecord> {
  const item = await prisma.seenItem.upsert({
    where: { canonicalItemId },
    create: { canonicalItemId },
    update: { seenAt: new Date() }
  });

  return mapSeenItem(item);
}
