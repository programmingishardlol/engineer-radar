import { mockRawItems } from "../mocks/rawItems";
import type { RawItem } from "../types";

export async function collectMockRawItems(): Promise<RawItem[]> {
  return mockRawItems;
}
