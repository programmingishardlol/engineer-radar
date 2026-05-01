import { collectMockRawItems } from "../../collectors/mockCollector";
import { collectRssItems } from "../../collectors/rssCollector";
import { defaultRssSources, listEnabledRssSources } from "../../collectors/sourceRegistry";
import type { CollectorFetch } from "../../collectors/types";
import { normalizeRawItems } from "../../pipeline/normalize";
import { deduplicateCanonicalItems } from "../../pipeline/deduplicate";
import { rankItems } from "../../ranking/rankItems";
import { saveCanonicalItems, saveRankedItemScores, saveRawItems } from "../../db/itemsRepo";
import type { RawItem, SourceRegistryItem } from "../../types";

export type MockIngestJobOptions = {
  persist?: boolean;
};

export type IngestJobOptions = MockIngestJobOptions & {
  sources?: SourceRegistryItem[];
  fetch?: CollectorFetch;
  now?: () => Date;
};

export type IngestJobResult = Awaited<ReturnType<typeof buildIngestResult>>;

function createDefaultFetch(): CollectorFetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8");
    headers.set("User-Agent", "EngineeringRadar/0.1 RSS collector");

    try {
      return await fetch(input, {
        ...init,
        signal: init?.signal ?? controller.signal,
        headers
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}

async function collectRssSourceItems(options: IngestJobOptions): Promise<RawItem[]> {
  const sources = listEnabledRssSources(options.sources ?? defaultRssSources);
  const rssFetch = options.fetch ?? createDefaultFetch();
  const results = await Promise.all(
    sources.map((source) =>
      collectRssItems({
        source,
        fetch: rssFetch,
        now: options.now
      })
    )
  );

  return results.flat();
}

async function buildIngestResult(rawItems: RawItem[], options: IngestJobOptions, usedFallback: boolean) {
  const canonicalItems = deduplicateCanonicalItems(normalizeRawItems(rawItems));
  const rankedItems = rankItems(canonicalItems);
  const shouldPersist = options.persist === true && Boolean(process.env.DATABASE_URL);
  const persisted = shouldPersist
    ? {
        rawItems: await saveRawItems(rawItems),
        canonicalItems: await saveCanonicalItems(canonicalItems),
        rankedItems: await saveRankedItemScores(rankedItems)
      }
    : undefined;

  return {
    rawItems,
    canonicalItems,
    rankedItems,
    persisted,
    stats: {
      fetched: rawItems.length,
      saved: persisted?.rankedItems.saved ?? 0,
      usedFallback,
      sourceCount: listEnabledRssSources(options.sources ?? defaultRssSources).length
    }
  };
}

export async function runIngestJob(options: IngestJobOptions = {}) {
  const rssItems = await collectRssSourceItems(options);
  const usedFallback = rssItems.length === 0;
  const rawItems = usedFallback ? await collectMockRawItems() : rssItems;

  return buildIngestResult(rawItems, options, usedFallback);
}

export async function runMockIngestJob(options: MockIngestJobOptions = {}) {
  const rawItems = await collectMockRawItems();
  return buildIngestResult(rawItems, options, true);
}
