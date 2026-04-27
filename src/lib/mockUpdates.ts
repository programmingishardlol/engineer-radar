import { dedupeUpdates } from "./dedupe";
import { normalizeUpdates } from "./normalize";
import type { NormalizedUpdate, RawUpdateInput } from "./types";

export const mockRawUpdates: RawUpdateInput[] = [
  {
    title: "Mock: Longer-context coding model release note",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/longer-context-coding-model",
    publishedAt: "2026-04-26",
    category: "AI Model Updates",
    company: "Mock AI Lab",
    summary: "A mock model update shows how Engineer Radar will summarize capability changes without claiming live news.",
    whyItMatters:
      "Longer context can help engineers work across larger repositories, but this card is sample data only.",
    whoShouldCare: "Software engineers, AI engineers, students testing coding agents",
    technicalKeywords: ["context window", "coding agents", "model release"],
    scoreDimensions: {
      importance: 4,
      novelty: 4,
      technicalDepth: 3,
      careerRelevance: 4,
      sourceTrust: 3
    },
    isMock: true
  },
  {
    title: "Mock: IDE agent adds repo memory controls",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/ide-agent-memory",
    publishedAt: "2026-04-25",
    category: "AI Coding Tool Updates",
    company: "Mock DevTools",
    summary: "A mock coding tool update demonstrates the card format for agent workflow improvements.",
    whyItMatters:
      "Project memory can reduce repeated instructions and make agent-assisted refactors more consistent.",
    whoShouldCare: "Students, solo builders, and teams using AI coding assistants",
    technicalKeywords: ["ide agent", "project memory", "refactoring"],
    scoreDimensions: {
      importance: 4,
      novelty: 4,
      technicalDepth: 3,
      careerRelevance: 5,
      sourceTrust: 3
    },
    isMock: true
  },
  {
    title: "Mock: New accelerator memory bandwidth example",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/accelerator-memory-bandwidth",
    publishedAt: "2026-04-24",
    category: "Hardware and Computing",
    company: "Mock Compute",
    summary: "A mock hardware item illustrates how compute and memory updates will be explained.",
    whyItMatters:
      "Memory bandwidth often limits AI inference and training, so engineers should track hardware bottlenecks.",
    whoShouldCare: "AI infrastructure engineers, hardware engineers, systems students",
    technicalKeywords: ["accelerator", "memory bandwidth", "inference"],
    scoreDimensions: {
      importance: 4,
      novelty: 3,
      technicalDepth: 4,
      careerRelevance: 4,
      sourceTrust: 3
    },
    isMock: true
  },
  {
    title: "Mock: Chiplet packaging capacity signal",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/chiplet-packaging",
    publishedAt: "2026-04-23",
    category: "Semiconductor and Manufacturing",
    company: "Mock Foundry",
    summary: "A mock semiconductor card shows how manufacturing updates will connect to compute cost.",
    whyItMatters:
      "Advanced packaging can affect GPU availability, accelerator performance, and cloud hardware pricing.",
    whoShouldCare: "Hardware engineers, AI infrastructure teams, semiconductor watchers",
    technicalKeywords: ["chiplets", "advanced packaging", "foundry"],
    scoreDimensions: {
      importance: 4,
      novelty: 3,
      technicalDepth: 4,
      careerRelevance: 3,
      sourceTrust: 3
    },
    isMock: true
  },
  {
    title: "Mock: Technical startup builds eval tooling",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/eval-tooling-startup",
    publishedAt: "2026-04-22",
    category: "Fast-Growing Startups",
    company: "Mock Eval Co",
    summary: "A mock startup profile demonstrates simple language for a developer infrastructure company.",
    whyItMatters:
      "Evaluation tooling is becoming more important as teams ship AI features that must be measured.",
    whoShouldCare: "AI engineers, technical founders, students building AI products",
    technicalKeywords: ["evals", "developer tooling", "startup"],
    scoreDimensions: {
      importance: 3,
      novelty: 3,
      technicalDepth: 3,
      careerRelevance: 4,
      sourceTrust: 3
    },
    isMock: true
  },
  {
    title: "Mock: Open-source observability tool gains traction",
    sourceName: "Mock Source",
    sourceUrl: "https://example.com/mock/observability-tool",
    publishedAt: "2026-04-21",
    category: "Open Source and Developer Infrastructure",
    company: "Mock OSS",
    summary: "A mock open-source item shows how repo traction will be displayed before live GitHub fetching exists.",
    whyItMatters:
      "Better observability helps engineers debug distributed systems and production AI services.",
    whoShouldCare: "Backend engineers, platform engineers, AI infrastructure teams",
    technicalKeywords: ["observability", "open source", "debugging"],
    scoreDimensions: {
      importance: 3,
      novelty: 3,
      technicalDepth: 4,
      careerRelevance: 4,
      sourceTrust: 3
    },
    isMock: true
  }
];

export function getMockUpdates(): NormalizedUpdate[] {
  return dedupeUpdates(normalizeUpdates(mockRawUpdates));
}
