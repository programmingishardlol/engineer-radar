"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { FeedCard } from "./FeedCard";
import { SourceList } from "./SourceList";
import type { Category, FeedResponse, RankedItem } from "../types";

export function Dashboard() {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sources = useMemo(() => {
    const uniqueSources = new Set(feed?.items.map((item) => item.source) ?? []);
    return Array.from(uniqueSources);
  }, [feed]);

  async function loadFeed(category: Category | "all" = selectedCategory) {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: "20" });
      if (category !== "all") {
        params.set("category", category);
      }

      const response = await fetch(`/api/feed?${params.toString()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Feed request failed");
      }

      setFeed((await response.json()) as FeedResponse);
    } catch {
      setError("Could not load the mock feed.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Initial client fetch is intentional: the dashboard consumes the public feed API contract.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFeed("all");
    // Run once on mount; category changes are handled explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCategoryChange(category: Category | "all") {
    setSelectedCategory(category);
    void loadFeed(category);
  }

  const items: RankedItem[] = feed?.items ?? [];

  return (
    <main className="min-h-screen px-4 py-6 text-[#17211d] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-[#d3ddd8] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-[#b8c9c0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#315446]">
              Mock vertical slice
            </p>
            <h1 className="text-4xl font-semibold text-[#14201b] sm:text-5xl">Engineering Radar</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#50635a]">
              Ranked demo updates for engineers. The feed is mock data until collector agents wire real sources.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadFeed()}
            disabled={isLoading}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-[#174936] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#123b2c] disabled:cursor-not-allowed disabled:bg-[#87978f]"
          >
            <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        <section className="grid gap-3 md:grid-cols-[1fr_280px]">
          <div className="rounded-md border border-[#cbd6d0] bg-white p-4">
            <CategoryFilter selectedCategory={selectedCategory} onChange={handleCategoryChange} />
          </div>
          <SourceList sources={sources} generatedAt={feed?.generatedAt} />
        </section>

        {error ? (
          <div className="rounded-md border border-[#e0b45d] bg-[#fff8e8] px-4 py-3 text-sm text-[#6b4b12]">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-md border border-dashed border-[#bdcbc4] bg-white/70 px-4 py-8 text-sm text-[#607168]">
            Loading mock feed...
          </div>
        ) : items.length > 0 ? (
          <section className="grid gap-4 lg:grid-cols-2" aria-label="Ranked engineering updates">
            {items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <div className="rounded-md border border-dashed border-[#bdcbc4] bg-white/70 px-4 py-8 text-sm text-[#607168]">
            No mock items match this filter.
          </div>
        )}
      </div>
    </main>
  );
}
