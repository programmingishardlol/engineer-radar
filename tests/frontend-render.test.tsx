import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CategoryFilter } from "../src/components/CategoryFilter";
import { FeedCard } from "../src/components/FeedCard";
import { ImpactBadge } from "../src/components/ImpactBadge";
import { SourceList } from "../src/components/SourceList";
import { mockRankedItems } from "../src/mocks/rankedItems";
import { categoryLabels } from "../src/types";

describe("frontend presentational rendering", () => {
  it("renders a feed card from a ranked item contract", () => {
    const item = mockRankedItems[0];
    const html = renderToStaticMarkup(<FeedCard item={item} />);

    expect(html).toContain(item.title);
    expect(html).toContain(item.summary);
    expect(html).toContain(categoryLabels[item.category]);
    expect(html).toContain("Mock/demo");
    expect(html).toContain("Open source");
  });

  it("renders all category filter options with the selected category marked active", () => {
    const html = renderToStaticMarkup(
      <CategoryFilter
        selectedCategory="developer_tools"
        onChange={() => undefined}
        resultCount={3}
        isLoading={false}
      />
    );

    expect(html).toContain("All");
    expect(html).toContain("AI Coding Tool Updates");
    expect(html).toContain("AI Model Updates");
    expect(html).toContain("bg-slate-950");
  });

  it("renders source list fallback and generated timestamp content", () => {
    const emptyHtml = renderToStaticMarkup(<SourceList sources={[]} itemCount={0} />);
    const populatedHtml = renderToStaticMarkup(
      <SourceList sources={["Mock AI Lab Blog"]} generatedAt="2026-04-22T12:00:00.000Z" itemCount={1} />
    );

    expect(emptyHtml).toContain("No sources loaded.");
    expect(populatedHtml).toContain("Mock AI Lab Blog");
    expect(populatedHtml).toContain("Generated");
  });

  it("labels impact levels from score thresholds", () => {
    expect(renderToStaticMarkup(<ImpactBadge score={4.2} />)).toContain("High impact · 4.20");
    expect(renderToStaticMarkup(<ImpactBadge score={3.2} />)).toContain("Medium impact · 3.20");
    expect(renderToStaticMarkup(<ImpactBadge score={2.8} />)).toContain("Low impact · 2.80");
  });
});
