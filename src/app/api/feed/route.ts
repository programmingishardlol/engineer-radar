import { NextRequest, NextResponse } from "next/server";
import { getFeed, isCategory } from "../../../server/feedService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryParam = searchParams.get("category") ?? undefined;
  const minScoreParam = searchParams.get("minScore");
  const limitParam = searchParams.get("limit");
  const modeParam = searchParams.get("mode");

  try {
    const feed = await getFeed({
      category: isCategory(categoryParam) ? categoryParam : undefined,
      minScore: minScoreParam ? Number(minScoreParam) : undefined,
      limit: limitParam ? Number(limitParam) : undefined,
      mode: modeParam === "mock" ? "mock" : "auto"
    });

    return NextResponse.json(feed, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: "Unable to build the feed."
        }
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
