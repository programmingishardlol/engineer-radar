import { categoryDescriptions } from "@/lib/categories";
import type { NormalizedUpdate, UpdateCategory } from "@/lib/types";
import { UpdateCard } from "./UpdateCard";

type CategorySectionProps = {
  category: UpdateCategory;
  updates: NormalizedUpdate[];
};

export function CategorySection({ category, updates }: CategorySectionProps) {
  return (
    <section className="border-t border-[#cbd6cf] pt-5" aria-labelledby={`category-${category}`}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`category-${category}`} className="text-xl font-semibold text-[#18201d]">
            {category}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[#607168]">{categoryDescriptions[category]}</p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-[#c9d6d0] bg-white px-3 py-1 text-xs font-semibold text-[#4a5f55]">
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {updates.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-[#c6d4cd] bg-white/70 px-4 py-5 text-sm text-[#607168]">
          No mock updates in this category yet.
        </div>
      )}
    </section>
  );
}
