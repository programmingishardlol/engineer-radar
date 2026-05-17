import { defaultRssSources, listEnabledRssSources } from "../collectors/sourceRegistry";
import { listSources, listSourceStats, setSourceEnabled, syncSources } from "../db/sourcesRepo";
import type { SourceAdminItem, SourceRegistryItem, SourceStats } from "../types";

function mergeWithPersistedSources(defaultSources: SourceRegistryItem[], persistedSources: SourceRegistryItem[]) {
  const persistedByUrl = new Map(persistedSources.map((source) => [source.url, source]));

  return defaultSources.map((source) => {
    const persisted = persistedByUrl.get(source.url);

    return persisted
      ? {
          ...source,
          id: persisted.id,
          name: persisted.name,
          category: persisted.category,
          sourceType: persisted.sourceType,
          fetchMethod: persisted.fetchMethod,
          credibility: persisted.credibility,
          enabled: persisted.enabled
        }
      : source;
  });
}

function statsBySourceName(stats: SourceStats[]) {
  return new Map(stats.map((stat) => [stat.sourceName, stat]));
}

function toAdminItem(source: SourceRegistryItem, stats?: SourceStats): SourceAdminItem {
  return {
    ...source,
    stats: {
      savedItemCount: stats?.savedItemCount ?? 0,
      latestPublishedAt: stats?.latestPublishedAt,
      lastSavedAt: stats?.lastSavedAt
    }
  };
}

export async function listAdminSources(defaultSources: SourceRegistryItem[] = defaultRssSources): Promise<SourceAdminItem[]> {
  try {
    await syncSources(defaultSources);
    const [persistedSources, stats] = await Promise.all([listSources(), listSourceStats()]);
    const statsByName = statsBySourceName(stats);

    return mergeWithPersistedSources(defaultSources, persistedSources).map((source) =>
      toAdminItem(source, statsByName.get(source.name))
    );
  } catch {
    return defaultSources.map((source) => toAdminItem(source));
  }
}

export async function getConfiguredRssSources(
  defaultSources: SourceRegistryItem[] = defaultRssSources
): Promise<SourceRegistryItem[]> {
  try {
    await syncSources(defaultSources);
    const persistedSources = await listSources();
    return listEnabledRssSources(mergeWithPersistedSources(defaultSources, persistedSources));
  } catch {
    return listEnabledRssSources(defaultSources);
  }
}

export async function updateSourceEnabled(url: string, enabled: boolean): Promise<SourceAdminItem> {
  const updatedSource = await setSourceEnabled(url, enabled);
  const stats = await listSourceStats();
  const matchingStats = statsBySourceName(stats).get(updatedSource.name);

  return toAdminItem(updatedSource, matchingStats);
}
