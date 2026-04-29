import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/feed/route";
import type { FeedResponse } from "../src/types";

function makeRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost/api/feed${query}`);
}

describe("GET /api/feed", () => {
  it("returns uncached JSON feed data for valid query params", async () => {
    const response = await GET(makeRequest("?category=security&limit=1&minScore=0"));
    const body = (await response.json()) as FeedResponse;

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.items).toHaveLength(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
    expect(body.items.every((item) => item.category === "security")).toBe(true);
    expect(Number.isNaN(Date.parse(body.generatedAt))).toBe(false);
  });

  it("ignores unknown categories instead of returning an invalid category feed", async () => {
    const invalidCategory: string = "semiconductors";
    const response = await GET(makeRequest(`?category=${invalidCategory}&limit=3`));
    const body = (await response.json()) as FeedResponse;

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(3);
    expect(body.items.some((item) => item.category !== invalidCategory)).toBe(true);
  });
});
