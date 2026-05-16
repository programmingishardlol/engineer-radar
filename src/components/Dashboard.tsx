"use client";

import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { FeedCard } from "./FeedCard";
import { SourceList } from "./SourceList";
import { categoryLabels, type Category, type FeedResponse, type RankedItem, type RefreshResponse } from "../types";

export function Dashboard() {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  const sources = useMemo(() => {
    const uniqueSources = new Set(feed?.items.map((item) => item.source) ?? []);
    return Array.from(uniqueSources);
  }, [feed]);

  async function loadFeed(category: Category | "all" = selectedCategory) {
    const hasExistingFeed = feed !== null;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: "24" });
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
      setRefreshStatus(null);
    } catch {
      setError(
        hasExistingFeed
          ? "Feed reload failed. The last loaded feed is still shown."
          : "Could not load the feed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshFeed() {
    const hasExistingFeed = feed !== null;
    setIsLoading(true);
    setError(null);
    setRefreshStatus(null);

    try {
      const params = new URLSearchParams({ limit: "24" });
      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }

      const response = await fetch(`/api/refresh?${params.toString()}`, {
        method: "POST",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Refresh request failed");
      }

      const refresh = (await response.json()) as RefreshResponse;
      setFeed(refresh.feed);
      setRefreshStatus(
        refresh.usedFallback
          ? `RSS fetch returned no items; showing ${refresh.fetched} mock fallback updates.`
          : `Fetched ${refresh.fetched} RSS/Atom updates from ${refresh.sourceCount} sources; saved ${refresh.saved}.`
      );
    } catch {
      setError(
        hasExistingFeed
          ? "Refresh failed. The last loaded feed is still shown."
          : "Could not refresh the feed."
      );
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

  function clearCategory() {
    handleCategoryChange("all");
  }

  const items: RankedItem[] = feed?.items ?? [];
  const hasInitialLoad = feed !== null;
  const isInitialLoading = isLoading && !hasInitialLoad;
  const activeCategoryLabel = selectedCategory === "all" ? "All categories" : categoryLabels[selectedCategory];
  const generatedAt = feed?.generatedAt ? new Date(feed.generatedAt) : null;
  const dataSourceLabel =
    feed?.dataSource === "database"
      ? "Live saved feed"
      : feed?.dataSource === "mock"
        ? "Mock demo mode"
        : feed?.dataSource === "transient"
          ? "Live unsaved refresh"
          : "Loading feed";
  const dataSourceDescription =
    feed?.dataSource === "database"
      ? "Reading persisted RSS/Atom updates from SQLite."
      : feed?.dataSource === "mock"
        ? "Showing clearly marked fixture updates because no saved live items are available or mock mode was requested."
        : feed?.dataSource === "transient"
          ? "Showing freshly fetched items that were not saved to SQLite."
          : "Loading the public feed API.";

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
                  {dataSourceLabel}
                </span>
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  API: /api/feed
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Engineering Radar</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A ranked MVP dashboard for engineering updates from free RSS/Atom sources. {dataSourceDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refreshFeed()}
              disabled={isLoading}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing" : "Refresh feed"}
            </button>
          </div>

          <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <StatusStat label="Visible updates" value={isInitialLoading ? "..." : items.length.toString()} />
            <StatusStat label="Active filter" value={activeCategoryLabel} />
            <StatusStat
              label="Generated"
              value={generatedAt ? generatedAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "..."}
            />
          </dl>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
              resultCount={items.length}
              isLoading={isLoading}
              dataSource={feed?.dataSource}
            />
          </div>
          <SourceList
            sources={sources}
            generatedAt={feed?.generatedAt}
            itemCount={items.length}
            dataSource={feed?.dataSource}
          />
        </section>

        {error ? (
          <div className="flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadFeed()}
              className="inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-md border border-amber-400 bg-white px-3 py-1.5 font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : null}

        {refreshStatus ? (
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
            {refreshStatus}
          </div>
        ) : null}

        {isInitialLoading ? (
          <section className="grid gap-4 lg:grid-cols-2" aria-label="Loading engineering updates">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </section>
        ) : items.length > 0 ? (
          <section className="grid gap-4 lg:grid-cols-2" aria-label="Ranked engineering updates">
            {items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-10 text-center shadow-sm">
            <p className="text-base font-semibold text-slate-950">No updates found for {activeCategoryLabel}.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              The feed endpoint returned an empty result for this filter. Clear the category filter or refresh live
              sources to try again.
            </p>
            {selectedCategory !== "all" ? (
              <button
                type="button"
                onClick={clearCategory}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Show all categories
              </button>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 h-6 w-4/5 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 space-y-2">
        <div className="h-4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-md bg-slate-100" />
        <div className="h-20 animate-pulse rounded-md bg-slate-100" />
      </div>
    </div>
  );
}
