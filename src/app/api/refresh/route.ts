import { NextRequest, NextResponse } from "next/server";
import { getFeed, isCategory } from "../../../server/feedService";
import { runIngestJob } from "../../../server/jobs/ingestJob";
import type { Category, FeedResponse, RankedItem } from "../../../types";

export const dynamic = "force-dynamic";

function parseLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 20;
  }

  return Math.max(1, Math.min(50, Math.floor(limit)));
}

function buildFeedFromIngestedItems(
  items: RankedItem[],
  query: { category?: Category; minScore?: number; limit?: number }
): FeedResponse {
  const minScore = query.minScore ?? 0;
  const filteredItems = items
    .filter((item) => !query.category || item.category === query.category)
    .filter((item) => item.score.finalScore >= minScore);

  return {
    items: filteredItems.slice(0, parseLimit(query.limit)),
    total: filteredItems.length,
    generatedAt: new Date().toISOString()
  };
}

async function refreshFeed(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryParam = searchParams.get("category") ?? undefined;
  const minScoreParam = searchParams.get("minScore");
  const limitParam = searchParams.get("limit");
  const query = {
    category: isCategory(categoryParam) ? categoryParam : undefined,
    minScore: minScoreParam ? Number(minScoreParam) : undefined,
    limit: limitParam ? Number(limitParam) : undefined
  };

  const ingestResult = await runIngestJob({ persist: true });
  const feed =
    ingestResult.stats.saved > 0 ? await getFeed(query) : buildFeedFromIngestedItems(ingestResult.rankedItems, query);

  return NextResponse.json(
    {
      fetched: ingestResult.stats.fetched,
      saved: ingestResult.stats.saved,
      usedFallback: ingestResult.stats.usedFallback,
      sourceCount: ingestResult.stats.sourceCount,
      feed
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export const GET = refreshFeed;
export const POST = refreshFeed;
