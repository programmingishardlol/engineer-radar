import type { SourceRegistryItem } from "../types";
import { prisma } from "./client";
import { mapDbSource } from "./mappers";

export type SourceInput = Omit<SourceRegistryItem, "id" | "enabled"> & {
  id?: string;
  enabled?: boolean;
};

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
      enabled: input.enabled ?? true
    }
  });

  return mapDbSource(source);
}

export async function setSourceEnabled(url: string, enabled: boolean): Promise<SourceRegistryItem> {
  const source = await prisma.source.update({
    where: { url },
    data: { enabled }
  });

  return mapDbSource(source);
}
