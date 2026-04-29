import { ExternalLink, Target, Users } from "lucide-react";
import type { ReactNode } from "react";
import { categoryLabels, type RankedItem, type ScoreBreakdown } from "../types";
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
  const isHighImpact = item.score.finalScore >= 4;

  return (
    <article
      className={[
        "flex h-full flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md",
        isHighImpact
          ? "border-emerald-300 ring-1 ring-emerald-100 hover:border-emerald-400"
          : "border-slate-200 hover:border-slate-300"
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
          Mock/demo
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {categoryLabels[item.category]}
        </span>
        <ImpactBadge score={item.score.finalScore} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_128px]">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-slate-950">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
        </div>
        <ScoreTile score={item.score.finalScore} confidencePercent={confidencePercent} />
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

      <ScoreBreakdownList score={item.score} />

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

function ScoreTile({ score, confidencePercent }: { score: number; confidencePercent: number }) {
  const scoreTone =
    score >= 4
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : score >= 3
        ? "border-sky-200 bg-sky-50 text-sky-950"
        : "border-slate-200 bg-slate-50 text-slate-950";

  return (
    <div className={`rounded-lg border p-3 text-center ${scoreTone}`}>
      <div className="text-xs font-semibold uppercase text-slate-500">Final score</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{score.toFixed(2)}</div>
      <div className="mt-1 text-xs font-semibold text-slate-600">{confidencePercent}% confidence</div>
    </div>
  );
}

const scoreBreakdownFields: Array<{
  key: keyof Omit<ScoreBreakdown, "finalScore">;
  label: string;
  inverse?: boolean;
}> = [
  { key: "engineeringImpact", label: "Impact" },
  { key: "novelty", label: "Novelty" },
  { key: "careerRelevance", label: "Career" },
  { key: "credibility", label: "Trust" },
  { key: "urgency", label: "Urgency" },
  { key: "hypeRisk", label: "Hype risk", inverse: true }
];

function ScoreBreakdownList({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase text-slate-500">Score breakdown</h3>
        <span className="text-xs text-slate-500">1 to 5 scale</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {scoreBreakdownFields.map((field) => {
          const value = score[field.key];
          const filledBlocks = Math.max(0, Math.min(5, Math.round(value)));
          const blockColor = field.inverse ? "bg-amber-400" : "bg-slate-700";

          return (
            <div key={field.key} className="grid grid-cols-[72px_1fr_32px] items-center gap-2 text-xs">
              <span className="font-medium text-slate-600">{field.label}</span>
              <span className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 rounded-full ${index < filledBlocks ? blockColor : "bg-slate-100"}`}
                  />
                ))}
              </span>
              <span className="text-right font-semibold tabular-nums text-slate-700">{value.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    </div>
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
