"use client";

import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { CategorySection } from "@/components/CategorySection";
import { getOrderedCategories } from "@/lib/categories";
import type { NormalizedUpdate, Source, UpdateCategory } from "@/lib/types";

type RefreshResponse = {
  mode: "mock";
  message: string;
  generatedAt: string;
  sourceCount: number;
  updates: NormalizedUpdate[];
};

type DashboardProps = {
  initialUpdates: NormalizedUpdate[];
  sources: Source[];
};

export function Dashboard({ initialUpdates, sources }: DashboardProps) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupedUpdates = useMemo(() => {
    return getOrderedCategories().map((category) => ({
      category,
      updates: updates.filter((update) => update.category === category)
    }));
  }, [updates]);

  const topScore = updates[0]?.score.toFixed(2) ?? "0.00";
  const enabledSourceCount = sources.filter((source) => source.enabled).length;

  async function refreshUpdates() {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/refresh", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const payload = (await response.json()) as RefreshResponse;
      setUpdates(payload.updates);
      setLastRefresh(payload.generatedAt);
    } catch {
      setError("Refresh failed. Mock data is still available below.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 text-[#18201d] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-[#cbd6cf] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-[#b9c7c0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#315446]">
              Mock data mode
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-[#15201c] sm:text-5xl">
              Engineer Radar
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#4c5d55]">
              A first-pass dashboard for updates engineers should know. These cards are sample data until
              real source fetching is implemented.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={refreshUpdates}
              disabled={isRefreshing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#174936] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#123b2c] disabled:cursor-not-allowed disabled:bg-[#81938b]"
            >
              <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </button>
            <div className="text-sm text-[#52645c]">
              {lastRefresh ? `Last refreshed ${new Date(lastRefresh).toLocaleTimeString()}` : "Ready to refresh"}
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Dashboard summary">
          <SummaryStat label="Mock updates" value={updates.length.toString()} />
          <SummaryStat label="Enabled sources" value={enabledSourceCount.toString()} />
          <SummaryStat label="Top score" value={`${topScore} / 5`} />
        </section>

        {error ? (
          <div className="rounded-md border border-[#e2b15d] bg-[#fff7e8] px-4 py-3 text-sm text-[#6d4a0f]" role="status">
            {error}
          </div>
        ) : null}

        <section className="rounded-md border border-[#9db5ab] bg-[#eef6f1] px-4 py-3 text-sm leading-6 text-[#315446]">
          Refresh currently calls <code className="rounded bg-white px-1.5 py-0.5">/api/refresh</code> and returns
          normalized, deduped, scored mock updates. No paid APIs, live crawling, or invented live news are used.
        </section>

        <div className="flex flex-col gap-5">
          {groupedUpdates.map(({ category, updates: categoryUpdates }) => (
            <CategorySection key={category} category={category as UpdateCategory} updates={categoryUpdates} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#cbd6cf] bg-white px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6c7d75]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[#16231e]">{value}</div>
    </div>
  );
}
