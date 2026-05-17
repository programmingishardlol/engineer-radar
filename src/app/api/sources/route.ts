import { NextRequest, NextResponse } from "next/server";
import { listAdminSources, updateSourceEnabled } from "../../../server/sourceService";

export const dynamic = "force-dynamic";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    {
      error: {
        code,
        message
      }
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function GET() {
  try {
    const sources = await listAdminSources();

    return NextResponse.json(
      { sources },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return errorResponse(500, "internal_error", "Unable to load sources.");
  }
}

export async function PATCH(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_request", "Expected JSON body with string url and boolean enabled.");
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { url?: unknown }).url !== "string" ||
    typeof (body as { enabled?: unknown }).enabled !== "boolean"
  ) {
    return errorResponse(400, "invalid_request", "Expected JSON body with string url and boolean enabled.");
  }

  try {
    const source = await updateSourceEnabled((body as { url: string }).url, (body as { enabled: boolean }).enabled);

    return NextResponse.json(
      { source },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return errorResponse(500, "internal_error", "Unable to update source.");
  }
}
