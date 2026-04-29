import type { Category, RankedItem, ScoreBreakdown } from "../types";
import { prisma } from "./client";
import { mapDbRankedItem } from "./mappers";

export type ItemScoreInput = {
  canonicalItemId: string;
  score: ScoreBreakdown;
  summary?: string;
  whyEngineersCare?: string;
  whoShouldCare?: string;
  suggestedAction?: string;
  confidence?: number;
};

export type RankedItemListOptions = {
  category?: Category;
  minScore?: number;
  limit?: number;
};

type DbRankedRow = Awaited<ReturnType<typeof findRankedRows>>[number] & {
  score: NonNullable<Awaited<ReturnType<typeof findRankedRows>>[number]["score"]>;
};

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 100;
  }

  return Math.max(1, Math.min(500, Math.floor(limit)));
}

function scoreData(input: ItemScoreInput) {
  return {
    engineeringImpact: input.score.engineeringImpact,
    novelty: input.score.novelty,
    careerRelevance: input.score.careerRelevance,
    credibility: input.score.credibility,
    urgency: input.score.urgency,
    hypeRisk: input.score.hypeRisk,
    finalScore: input.score.finalScore,
    summary: input.summary ?? "",
    whyEngineersCare: input.whyEngineersCare ?? "",
    whoShouldCare: input.whoShouldCare ?? "",
    suggestedAction: input.suggestedAction ?? "",
    confidence: input.confidence ?? 0
  };
}

function rankedWhere(options: RankedItemListOptions = {}) {
  return {
    ...(options.category ? { category: options.category } : {}),
    score: {
      is: {
        finalScore: {
          gte: options.minScore ?? 0
        }
      }
    }
  };
}

async function findRankedRows(options: RankedItemListOptions = {}) {
  return prisma.canonicalItem.findMany({
    where: rankedWhere(options),
    include: { score: true },
    orderBy: [{ score: { finalScore: "desc" } }, { publishedAt: "desc" }],
    take: parseLimit(options.limit)
  });
}

export async function countRankedItems(options: Omit<RankedItemListOptions, "limit"> = {}): Promise<number> {
  return prisma.canonicalItem.count({
    where: rankedWhere(options)
  });
}

export async function saveItemScore(input: ItemScoreInput): Promise<{ saved: number }> {
  const data = scoreData(input);

  await prisma.itemScore.upsert({
    where: { canonicalItemId: input.canonicalItemId },
    create: {
      canonicalItemId: input.canonicalItemId,
      ...data
    },
    update: data
  });

  return { saved: 1 };
}

export async function saveItemScores(inputs: ItemScoreInput[]): Promise<{ saved: number }> {
  if (inputs.length === 0) {
    return { saved: 0 };
  }

  await prisma.$transaction(
    inputs.map((input) =>
      prisma.itemScore.upsert({
        where: { canonicalItemId: input.canonicalItemId },
        create: {
          canonicalItemId: input.canonicalItemId,
          ...scoreData(input)
        },
        update: scoreData(input)
      })
    )
  );

  return { saved: inputs.length };
}

export async function saveRankedItemScores(items: RankedItem[]): Promise<{ saved: number }> {
  if (items.length === 0) {
    return { saved: 0 };
  }

  const canonicalItems = await prisma.canonicalItem.findMany({
    where: {
      url: { in: items.map((item) => item.url) }
    },
    select: { id: true, url: true }
  });
  const idByUrl = new Map(canonicalItems.map((item) => [item.url, item.id]));
  const inputs = items.flatMap((item): ItemScoreInput[] => {
    const canonicalItemId = idByUrl.get(item.url);
    if (!canonicalItemId) {
      return [];
    }

    return [
      {
        canonicalItemId,
        score: item.score,
        summary: item.summary,
        whyEngineersCare: item.whyEngineersCare,
        whoShouldCare: item.whoShouldCare,
        suggestedAction: item.suggestedAction,
        confidence: item.confidence
      }
    ];
  });

  return saveItemScores(inputs);
}

export async function listRankedItems(options: RankedItemListOptions = {}): Promise<RankedItem[]> {
  const rows = await findRankedRows(options);
  const rankedRows = rows.filter((row): row is DbRankedRow => row.score !== null);

  return rankedRows.map(mapDbRankedItem);
}
