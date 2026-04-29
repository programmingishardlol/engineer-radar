import { NextRequest, NextResponse } from "next/server";
import { getFeed, isCategory } from "../../../server/feedService";
import { runMockIngestJob } from "../../../server/jobs/ingestJob";

export const dynamic = "force-dynamic";

async function refreshFeed(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryParam = searchParams.get("category") ?? undefined;
  const minScoreParam = searchParams.get("minScore");
  const limitParam = searchParams.get("limit");

  await runMockIngestJob({ persist: true });

  const feed = await getFeed({
    category: isCategory(categoryParam) ? categoryParam : undefined,
    minScore: minScoreParam ? Number(minScoreParam) : undefined,
    limit: limitParam ? Number(limitParam) : undefined
  });

  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export const GET = refreshFeed;
export const POST = refreshFeed;
