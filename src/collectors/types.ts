import type { RawItem, SourceRegistryItem } from "../types";

export type CollectorFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type CollectorContext = {
  source?: SourceRegistryItem;
  fetch?: CollectorFetch;
  now?: () => Date;
};

export type Collector = (context?: CollectorContext) => Promise<RawItem[]>;
