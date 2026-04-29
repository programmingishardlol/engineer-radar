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
    case "open_source":
      return "Engineers evaluating libraries, tools, and infrastructure";
    case "research":
      return "AI, systems, and product engineers watching applied research";
    case "career_skills":
      return "Students and engineers deciding what to learn next";
    default:
      return "Engineers tracking technical industry changes";
  }
}

function whyEngineersCareForCategory(item: CanonicalItem): string {
  if (item.sourceType === "mock") {
    return "This mock item exercises the ranking and dashboard contracts without claiming live news or external ingestion.";
  }

  switch (item.category) {
    case "ai_models":
      return "This may affect model choice, product capabilities, or AI-assisted engineering workflows.";
    case "developer_tools":
      return "This may affect how developers write, debug, test, or review code.";
    case "hardware":
      return "This may affect compute cost, performance, or workload planning.";
    case "security":
      return "This may require engineers to review dependencies, systems, or deployment risk.";
    case "cloud_infrastructure":
      return "This may affect backend architecture, reliability, latency, or operating cost.";
    case "career_skills":
      return "This is a signal about skills engineers may want to learn or refresh.";
    default:
      return "This may be useful context for engineering decisions and industry awareness.";
  }
}

function suggestedActionForCategory(category: CanonicalItem["category"]): string {
  switch (category) {
    case "security":
      return "Check whether your projects or dependencies are affected.";
    case "developer_tools":
    case "open_source":
      return "Skim the source and decide whether the tool is worth trying in a small workflow.";
    case "career_skills":
      return "Map the signal to one concrete learning or portfolio project.";
    case "cloud_infrastructure":
    case "hardware":
      return "Note the workloads or systems that could benefit from the change.";
    default:
      return "Read the source if the topic matches your current work or learning goals.";
  }
}

export function rankItem(item: CanonicalItem): RankedItem {
  const score = scoreCanonicalItem(item);
  const summaryPrefix = item.sourceType === "mock" ? "Mock/demo item: " : "";

  return {
    ...item,
    score,
    summary: `${summaryPrefix}${item.summaryCandidateText}`,
    whyEngineersCare: whyEngineersCareForCategory(item),
    whoShouldCare: audienceForCategory(item.category),
    suggestedAction: item.sourceType === "mock" ? "Use this as a contract fixture for the mock vertical slice." : suggestedActionForCategory(item.category),
    confidence: item.sourceType === "mock" ? 0.72 : 0.82
  };
}
