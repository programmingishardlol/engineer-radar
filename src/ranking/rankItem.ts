import type { CanonicalItem, RankedItem } from "../types";
import { scoreCanonicalItem } from "./scoringRules";

function audienceForCategory(category: CanonicalItem["category"]): string {
  switch (category) {
    case "ai_models":
      return "AI engineers, software engineers, and students using AI tools";
    case "developer_tools":
      return "Developers, students, and teams using coding assistants";
    case "hardware":
      return "AI infrastructure, systems, and hardware engineers";
    case "security":
      return "Backend, platform, and security engineers";
    case "cloud_infrastructure":
      return "Platform, backend, and DevOps engineers";
    default:
      return "Engineers tracking technical industry changes";
  }
}

export function rankItem(item: CanonicalItem): RankedItem {
  const score = scoreCanonicalItem(item);

  return {
    ...item,
    score,
    summary: `Mock/demo item: ${item.summaryCandidateText}`,
    whyEngineersCare:
      "This mock item exercises the ranking and dashboard contracts without claiming live news or external ingestion.",
    whoShouldCare: audienceForCategory(item.category),
    suggestedAction: "Use this as a contract fixture until the owning agent wires real source ingestion.",
    confidence: item.sourceType === "mock" ? 0.72 : 0.82
  };
}
