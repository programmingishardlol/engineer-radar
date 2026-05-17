import type { SourceRegistryItem, SourceStats } from "../types";
import { prisma } from "./client";
import { mapDbSource } from "./mappers";

export type SourceInput = Omit<SourceRegistryItem, "id" | "enabled"> & {
  id?: string;
  enabled?: boolean;
};

function sourceData(input: SourceRegistryItem) {
  return {
    name: input.name,
    url: input.url,
    category: input.category,
    sourceType: input.sourceType,
    fetchMethod: input.fetchMethod,
    credibility: input.credibility
  };
}

export async function listSources(): Promise<SourceRegistryItem[]> {
  const sources = await prisma.source.findMany({
    orderBy: [{ enabled: "desc" }, { name: "asc" }]
  });

  return sources.map(mapDbSource);
}

export async function getSourceByUrl(url: string): Promise<SourceRegistryItem | null> {
  const source = await prisma.source.findUnique({ where: { url } });
  return source ? mapDbSource(source) : null;
}

export async function upsertSource(input: SourceInput): Promise<SourceRegistryItem> {
  const source = await prisma.source.upsert({
    where: { url: input.url },
    create: {
      id: input.id,
      name: input.name,
      url: input.url,
      category: input.category,
      sourceType: input.sourceType,
      fetchMethod: input.fetchMethod,
      credibility: input.credibility,
      enabled: input.enabled ?? true
    },
    update: {
      name: input.name,
      category: input.category,
      sourceType: input.sourceType,
      fetchMethod: input.fetchMethod,
      credibility: input.credibility,
      ...(typeof input.enabled === "boolean" ? { enabled: input.enabled } : {})
    }
  });

  return mapDbSource(source);
}

export async function syncSources(inputs: SourceRegistryItem[]): Promise<{ synced: number }> {
  if (inputs.length === 0) {
    return { synced: 0 };
  }

  await prisma.$transaction(
    inputs.map((input) =>
      prisma.source.upsert({
        where: { url: input.url },
        create: {
          id: input.id,
          ...sourceData(input),
          enabled: input.enabled
        },
        update: sourceData(input)
      })
    )
  );

  return { synced: inputs.length };
}

export async function setSourceEnabled(url: string, enabled: boolean): Promise<SourceRegistryItem> {
  const source = await prisma.source.update({
    where: { url },
    data: { enabled }
  });

  return mapDbSource(source);
}

export async function listSourceStats(): Promise<SourceStats[]> {
  const stats = await prisma.rawItem.groupBy({
    by: ["sourceName"],
    _count: {
      _all: true
    },
    _max: {
      publishedAt: true,
      createdAt: true
    }
  });

  return stats.map((stat) => ({
    sourceName: stat.sourceName,
    savedItemCount: stat._count._all,
    latestPublishedAt: stat._max.publishedAt?.toISOString(),
    lastSavedAt: stat._max.createdAt?.toISOString()
  }));
}
