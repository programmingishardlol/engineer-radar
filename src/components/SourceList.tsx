import type { FeedDataSource } from "../types";

type SourceListProps = {
  sources: string[];
  generatedAt?: string;
  itemCount: number;
  dataSource?: FeedDataSource;
};

export function SourceList({ sources, generatedAt, itemCount, dataSource }: SourceListProps) {
  const generatedLabel = generatedAt
    ? new Date(generatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : null;
  const sourceLabel =
    dataSource === "database" ? "Saved feed" : dataSource === "mock" ? "Mock demo" : "Live fetch";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Source snapshot</h2>
          <p className="mt-1 text-xs text-slate-500">
            {itemCount} item{itemCount === 1 ? "" : "s"} from {sources.length} source
            {sources.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-800">
          {sourceLabel}
        </span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700 lg:block lg:space-y-2">
        {sources.length > 0 ? (
          sources.map((source) => (
            <li key={source} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 lg:rounded-md">
              {source}
            </li>
          ))
        ) : (
          <li className="text-slate-500">No sources loaded.</li>
        )}
      </ul>
      {generatedLabel ? (
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Generated {generatedLabel}</p>
      ) : null}
    </aside>
  );
}
