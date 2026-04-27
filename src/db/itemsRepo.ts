import type { CanonicalItem, RankedItem } from "../types";

export async function saveCanonicalItems(_items: CanonicalItem[]) {
  void _items;
  // TODO: Backend + Database Agent will wire Prisma persistence.
  return { saved: 0 };
}

export async function saveRankedItems(_items: RankedItem[]) {
  void _items;
  // TODO: Backend + Database Agent will wire Prisma persistence.
  return { saved: 0 };
}
