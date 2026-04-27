type ImpactBadgeProps = {
  score: number;
};

export function ImpactBadge({ score }: ImpactBadgeProps) {
  const label = score >= 4 ? "High impact" : score >= 3 ? "Medium impact" : "Low impact";

  return (
    <span className="rounded-full bg-[#d9ece5] px-2.5 py-1 text-xs font-semibold text-[#234c3b]">
      {label}: {score.toFixed(2)}
    </span>
  );
}
