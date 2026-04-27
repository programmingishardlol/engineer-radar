import { NextResponse } from "next/server";
import { getMockUpdates } from "@/lib/mockUpdates";
import { sourceRegistry } from "@/lib/sources";

export const dynamic = "force-dynamic";

export async function GET() {
  const updates = getMockUpdates();

  return NextResponse.json(
    {
      mode: "mock",
      message: "Mock data only. Live source fetching is not implemented in this MVP scaffold.",
      generatedAt: new Date().toISOString(),
      sourceCount: sourceRegistry.length,
      updates
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
