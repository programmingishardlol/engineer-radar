type ImpactBadgeProps = {
  score: number;
};

export function ImpactBadge({ score }: ImpactBadgeProps) {
  const label = score >= 4 ? "High" : score >= 3 ? "Medium" : "Low";
  const colorClass =
    score >= 4
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : score >= 3
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colorClass}`}>
      {label} impact · {score.toFixed(2)}
    </span>
  );
}
