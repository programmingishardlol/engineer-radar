import { categories, categoryLabels, type Category } from "../types";

type CategoryFilterProps = {
  selectedCategory: Category | "all";
  onChange: (category: Category | "all") => void;
};

export function CategoryFilter({ selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-[#26352f]">Category</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={buttonClass(selectedCategory === "all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
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
    "min-h-9 rounded-md border px-3 py-1.5 text-sm font-medium transition",
    active
      ? "border-[#174936] bg-[#174936] text-white"
      : "border-[#c6d4cd] bg-white text-[#315446] hover:bg-[#eef6f1]"
  ].join(" ");
}
