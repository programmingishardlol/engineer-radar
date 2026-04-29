import { categories, categoryLabels, type Category } from "../types";

type CategoryFilterProps = {
  selectedCategory: Category | "all";
  onChange: (category: Category | "all") => void;
  resultCount: number;
  isLoading: boolean;
};

export function CategoryFilter({ selectedCategory, onChange, resultCount, isLoading }: CategoryFilterProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Category filter</h2>
          <p className="mt-1 text-xs text-slate-500">
            {isLoading ? "Loading mock results..." : `${resultCount} mock result${resultCount === 1 ? "" : "s"} shown`}
          </p>
        </div>
        {selectedCategory !== "all" ? (
          <button
            type="button"
            onClick={() => onChange("all")}
            className="inline-flex min-h-8 w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Clear filter
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Filter feed by category">
        <button
          type="button"
          onClick={() => onChange("all")}
          aria-pressed={selectedCategory === "all"}
          className={buttonClass(selectedCategory === "all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={selectedCategory === category}
            className={buttonClass(selectedCategory === category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
}

function buttonClass(active: boolean) {
  return [
    "min-h-9 rounded-md border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
    active
      ? "border-slate-950 bg-slate-950 text-white"
      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100"
  ].join(" ");
}
