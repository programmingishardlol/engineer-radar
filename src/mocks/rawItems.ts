import type { RawItem } from "../types";

export const mockRawItems: RawItem[] = [
  {
    id: "mock-raw-ai-model",
    title: "Mock/demo: AI lab posts a longer-context model release note",
    url: "https://example.com/mock/ai-model-context",
    source: "Mock AI Lab Blog",
    sourceType: "mock",
    publishedAt: "2026-04-20T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A model release note describes longer context and improved tool use for engineering tasks.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-dev-tool",
    title: "Mock/demo: Coding agent adds safer repository memory controls",
    url: "https://example.com/mock/coding-agent-memory",
    source: "Mock DevTool Changelog",
    sourceType: "mock",
    publishedAt: "2026-04-21T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A developer tool update describes repo memory controls for Codex, Claude Code, or Cursor style workflows.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-chip",
    title: "Mock/demo: GPU vendor explains new memory bandwidth design",
    url: "https://example.com/mock/gpu-memory-bandwidth",
    source: "Mock Hardware Blog",
    sourceType: "mock",
    publishedAt: "2026-04-19T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A hardware post explains how higher memory bandwidth may affect AI inference and training workloads.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-startup",
    title: "Mock/demo: YC-style startup builds testing tools for AI agents",
    url: "https://example.com/mock/startup-agent-testing",
    source: "Mock Startup Directory",
    sourceType: "mock",
    publishedAt: "2026-04-18T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A startup profile describes evaluation and regression testing tools for teams shipping AI agents.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-open-source",
    title: "Mock/demo: GitHub trending project improves local observability",
    url: "https://example.com/mock/github-observability",
    source: "Mock GitHub Trending",
    sourceType: "mock",
    publishedAt: "2026-04-17T12:00:00.000Z",
    rawText:
      "Mock/demo item only. An open-source tool helps engineers inspect local services and debug distributed workflows.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-security",
    title: "Mock/demo: Security advisory highlights dependency confusion risk",
    url: "https://example.com/mock/security-dependency-confusion?utm_source=demo",
    source: "Mock Security Advisory",
    sourceType: "mock",
    publishedAt: "2026-04-22T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A security advisory describes dependency confusion mitigations for package managers.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-cloud",
    title: "Mock/demo: Cloud provider previews lower-latency serverless queues",
    url: "https://example.com/mock/cloud-serverless-queues",
    source: "Mock Cloud Blog",
    sourceType: "mock",
    publishedAt: "2026-04-16T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A cloud infrastructure update describes lower-latency queues for event-driven systems.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-research",
    title: "Mock/demo: Research paper studies small-model tool-use reliability",
    url: "https://example.com/mock/research-small-model-tools",
    source: "Mock arXiv Feed",
    sourceType: "mock",
    publishedAt: "2026-04-15T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A research paper studies evaluation methods for small models using tools.",
    metadata: { demo: true }
  },
  {
    id: "mock-raw-security-duplicate",
    title: "Mock/demo: Security advisory highlights dependency confusion risk",
    url: "https://example.com/mock/security-dependency-confusion",
    source: "Mock Security Advisory Mirror",
    sourceType: "mock",
    publishedAt: "2026-04-22T13:00:00.000Z",
    rawText: "Mock/demo duplicate used to validate exact URL deduplication.",
    metadata: { demo: true, duplicate: true }
  }
];
