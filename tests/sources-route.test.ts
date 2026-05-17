import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SourceAdminItem } from "../src/types";

const { listAdminSourcesMock, updateSourceEnabledMock } = vi.hoisted(() => ({
  listAdminSourcesMock: vi.fn(),
  updateSourceEnabledMock: vi.fn()
}));

vi.mock("../src/server/sourceService", () => ({
  listAdminSources: listAdminSourcesMock,
  updateSourceEnabled: updateSourceEnabledMock
}));

const { GET, PATCH } = await import("../src/app/api/sources/route");

const adminSource: SourceAdminItem = {
  id: "source-a",
  name: "Source A",
  url: "https://example.com/feed.xml",
  category: "developer_tools",
  sourceType: "rss",
  fetchMethod: "rss",
  credibility: 5,
  enabled: true,
  priority: 90,
  includeKeywords: ["api"],
  excludeKeywords: ["webinar"],
  stats: {
    savedItemCount: 3,
    latestPublishedAt: "2026-05-15T12:00:00.000Z",
    lastSavedAt: "2026-05-15T12:05:00.000Z"
  }
};

function request(body?: unknown): NextRequest {
  return new NextRequest("http://localhost/api/sources", {
    method: body ? "PATCH" : "GET",
    body: body ? JSON.stringify(body) : undefined
  });
}

describe("/api/sources route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listAdminSourcesMock.mockResolvedValue([adminSource]);
    updateSourceEnabledMock.mockResolvedValue({ ...adminSource, enabled: false });
  });

  it("returns source admin rows", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ sources: [adminSource] });
  });

  it("updates source enabled state", async () => {
    const response = await PATCH(request({ url: adminSource.url, enabled: false }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(updateSourceEnabledMock).toHaveBeenCalledWith(adminSource.url, false);
    expect(json.source.enabled).toBe(false);
  });

  it("rejects invalid update payloads", async () => {
    const response = await PATCH(request({ url: adminSource.url, enabled: "false" }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: {
        code: "invalid_request",
        message: "Expected JSON body with string url and boolean enabled."
      }
    });
  });
});
