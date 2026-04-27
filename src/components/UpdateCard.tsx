import { ExternalLink } from "lucide-react";
import type { NormalizedUpdate } from "@/lib/types";

type UpdateCardProps = {
  update: NormalizedUpdate;
};

export function UpdateCard({ update }: UpdateCardProps) {
  const published = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(update.publishedAt));

  return (
    <article className="flex h-full flex-col gap-4 rounded-md border border-[#cbd6cf] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {update.isMock ? (
          <span className="rounded-full bg-[#f4e1a6] px-2.5 py-1 text-xs font-semibold text-[#594713]">
            Mock data
          </span>
        ) : null}
        <span className="rounded-full bg-[#d9ece5] px-2.5 py-1 text-xs font-semibold text-[#234c3b]">
          Score {update.score.toFixed(2)}
        </span>
        {update.scoreDetails ? (
          <span className="rounded-full bg-[#e7e8f5] px-2.5 py-1 text-xs font-semibold text-[#363a69]">
            {update.scoreDetails.label}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="text-lg font-semibold leading-7 text-[#16231e]">{update.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#43544d]">{update.summary}</p>
      </div>

      <dl className="grid gap-3 text-sm">
        <Field label="Why it matters" value={update.whyItMatters} />
        <Field label="Who should care" value={update.whoShouldCare} />
        <Field label="Category" value={update.category} />
        <Field label="Published" value={published} />
      </dl>

      <div className="mt-auto flex flex-col gap-3 border-t border-[#edf1ef] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#607168]">
          Source: <span className="font-medium text-[#26352f]">{update.sourceName}</span>
        </div>
        <a
          href={update.sourceUrl}
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
