import { ExternalLink, Target, Users } from "lucide-react";
import type { ReactNode } from "react";
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
  const confidencePercent = Math.round(item.confidence * 100);

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
          Mock/demo
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {categoryLabels[item.category]}
        </span>
        <ImpactBadge score={item.score.finalScore} />
      </div>

      <div>
        <h2 className="text-lg font-semibold leading-7 text-slate-950">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
      </div>

      <dl className="grid gap-3 text-sm">
        <Field label="Why engineers care" value={item.whyEngineersCare} />
        <div className="grid gap-3 sm:grid-cols-2">
          <IconField
            icon={<Users aria-hidden="true" className="h-4 w-4" />}
            label="Who should care"
            value={item.whoShouldCare}
          />
          <IconField
            icon={<Target aria-hidden="true" className="h-4 w-4" />}
            label="Suggested action"
            value={item.suggestedAction}
          />
        </div>
      </dl>

      <div className="mt-auto grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-1 text-sm text-slate-600">
          <span>
            {item.source} · {publishedAt}
          </span>
          <span className="text-xs font-semibold text-slate-500">Confidence {confidencePercent}%</span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Open source
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 leading-6 text-slate-800">{value}</dd>
    </div>
  );
}

function IconField({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        <span className="text-sky-700">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 leading-6 text-slate-800">{value}</dd>
    </div>
  );
}
