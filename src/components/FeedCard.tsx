import { ExternalLink } from "lucide-react";
import { categoryLabels, type RankedItem } from "../types";
import { ImpactBadge } from "./ImpactBadge";

type FeedCardProps = {
  item: RankedItem;
};

export function FeedCard({ item }: FeedCardProps) {
  const publishedAt = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(item.publishedAt));

  return (
    <article className="flex h-full flex-col gap-4 rounded-md border border-[#cbd6d0] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f4e1a6] px-2.5 py-1 text-xs font-semibold text-[#594713]">
          Mock/demo
        </span>
        <span className="rounded-full bg-[#e6eee9] px-2.5 py-1 text-xs font-semibold text-[#315446]">
          {categoryLabels[item.category]}
        </span>
        <ImpactBadge score={item.score.finalScore} />
      </div>

      <div>
        <h2 className="text-lg font-semibold leading-7 text-[#16231e]">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#43544d]">{item.summary}</p>
      </div>

      <dl className="grid gap-3 text-sm">
        <Field label="Why engineers care" value={item.whyEngineersCare} />
        <Field label="Who should care" value={item.whoShouldCare} />
        <Field label="Suggested action" value={item.suggestedAction} />
        <Field label="Confidence" value={`${Math.round(item.confidence * 100)}%`} />
      </dl>

      <div className="mt-auto flex flex-col gap-3 border-t border-[#edf1ef] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#607168]">
          {item.source} · {publishedAt}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#b8c7c0] px-3 py-2 text-sm font-semibold text-[#174936] transition hover:bg-[#eef6f1]"
        >
          Source
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6c7d75]">{label}</dt>
      <dd className="mt-1 leading-6 text-[#26352f]">{value}</dd>
    </div>
  );
}
