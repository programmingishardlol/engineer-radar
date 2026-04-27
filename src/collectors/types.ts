import type { RawItem, SourceRegistryItem } from "../types";

export type CollectorContext = {
  source?: SourceRegistryItem;
};

export type Collector = (context?: CollectorContext) => Promise<RawItem[]>;
