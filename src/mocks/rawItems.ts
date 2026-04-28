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
      "Mock/demo item only. A model release note describes longer context, lower inference latency, and improved tool use for repository-scale engineering tasks.",
    metadata: {
      demo: true,
      category: "ai_models",
      entities: ["Mock AI Lab"],
      keywords: ["LLM", "context window", "tool use", "inference latency"]
    }
  },
  {
    id: "mock-raw-dev-tool",
    title: "Mock/demo: Coding agent adds safer repository memory controls",
    url: "https://example.com/mock/coding-agent-memory",
    source: "Mock DevTool Changelog",
    sourceType: "mock",
    publishedAt: "2026-04-21T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A developer tool update describes repo memory controls for Codex, Claude Code, or Cursor style workflows, including safer refactors and code-review checkpoints.",
    metadata: {
      demo: true,
      category: "developer_tools",
      entities: ["Mock DevTool"],
      keywords: ["Codex", "Claude Code", "Cursor", "code review", "refactoring"]
    }
  },
  {
    id: "mock-raw-chip",
    title: "Mock/demo: GPU vendor explains new memory bandwidth design",
    url: "https://example.com/mock/gpu-memory-bandwidth",
    source: "Mock Hardware Blog",
    sourceType: "mock",
    publishedAt: "2026-04-19T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A hardware post explains how higher HBM memory bandwidth in a GPU accelerator may affect AI inference and training workloads.",
    metadata: {
      demo: true,
      category: "hardware",
      entities: ["Mock Hardware Vendor"],
      keywords: ["GPU", "accelerator", "HBM", "memory bandwidth"]
    }
  },
  {
    id: "mock-raw-startup",
    title: "Mock/demo: YC-style startup builds testing tools for AI agents",
    url: "https://example.com/mock/startup-agent-testing",
    source: "Mock Startup Directory",
    sourceType: "mock",
    publishedAt: "2026-04-18T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A startup profile describes evaluation and regression testing tools for teams shipping AI agents. Founder and funding details are intentionally omitted because this is fixture data.",
    metadata: {
      demo: true,
      category: "startups",
      entities: ["Mock Agent Testing Co"],
      keywords: ["startup", "AI agents", "evals", "regression testing"]
    }
  },
  {
    id: "mock-raw-open-source",
    title: "Mock/demo: GitHub trending project improves local observability",
    url: "https://example.com/mock/github-observability",
    source: "Mock GitHub Trending",
    sourceType: "mock",
    publishedAt: "2026-04-17T12:00:00.000Z",
    rawText:
      "Mock/demo item only. An open-source GitHub project helps engineers inspect local services, trace requests, and debug distributed workflows.",
    metadata: {
      demo: true,
      category: "open_source",
      repository: "mock-org/mock-observe",
      entities: ["mock-org/mock-observe"],
      keywords: ["open source", "GitHub", "observability", "distributed systems"]
    }
  },
  {
    id: "mock-raw-security",
    title: "Mock/demo: Security advisory highlights dependency confusion risk",
    url: "https://example.com/mock/security-dependency-confusion?utm_source=demo",
    source: "Mock Security Advisory",
    sourceType: "mock",
    publishedAt: "2026-04-22T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A security advisory describes dependency confusion mitigations for package managers, CI workflows, and internal package registries.",
    metadata: {
      demo: true,
      category: "security",
      entities: ["Mock Security Advisory"],
      keywords: ["security", "dependency confusion", "supply chain", "CI"]
    }
  },
  {
    id: "mock-raw-cloud",
    title: "Mock/demo: Cloud provider previews lower-latency serverless queues",
    url: "https://example.com/mock/cloud-serverless-queues",
    source: "Mock Cloud Blog",
    sourceType: "mock",
    publishedAt: "2026-04-16T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A cloud infrastructure update describes lower-latency serverless queues for event-driven systems and autoscaled AI services.",
    metadata: {
      demo: true,
      category: "cloud_infrastructure",
      entities: ["Mock Cloud"],
      keywords: ["cloud", "serverless", "queues", "autoscaling"]
    }
  },
  {
    id: "mock-raw-research",
    title: "Mock/demo: Research paper studies small-model tool-use reliability",
    url: "https://example.com/mock/research-small-model-tools",
    source: "Mock arXiv Feed",
    sourceType: "mock",
    publishedAt: "2026-04-15T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A research paper studies evaluation methods for small models using tools, including benchmark tasks for reliability and recovery.",
    metadata: {
      demo: true,
      category: "research",
      entities: ["Mock University Lab"],
      keywords: ["research", "paper", "benchmark", "tool use"]
    }
  },
  {
    id: "mock-raw-company-move",
    title: "Mock/demo: Large tech company reorganizes AI infrastructure teams",
    url: "https://example.com/mock/company-ai-infra-reorg",
    source: "Mock Company Newsroom",
    sourceType: "mock",
    publishedAt: "2026-04-14T12:00:00.000Z",
    rawText:
      "Mock/demo item only. A fictional large technology company reorganizes AI infrastructure and developer platform teams. This is not reporting real layoffs, hiring, or org changes.",
    metadata: {
      demo: true,
      category: "company_moves",
      entities: ["Mock BigTech"],
      keywords: ["reorganization", "AI infrastructure", "developer platform"]
    }
  },
  {
    id: "mock-raw-career-skills",
    title: "Mock/demo: Engineering job posts emphasize CUDA and AI evaluation skills",
    url: "https://example.com/mock/career-skills-cuda-evals",
    source: "Mock Career Signal",
    sourceType: "mock",
    publishedAt: "2026-04-13T12:00:00.000Z",
    rawText:
      "Mock/demo item only. Fictional hiring notes highlight CUDA, distributed systems, and AI evaluation skills as useful learning signals for engineers.",
    metadata: {
      demo: true,
      category: "career_skills",
      entities: ["Mock Career Signal"],
      keywords: ["career", "skills", "CUDA", "distributed systems", "evals"]
    }
  },
  {
    id: "mock-raw-security-duplicate",
    title: "Mock/demo: Security advisory highlights dependency confusion risk",
    url: "https://example.com/mock/security-dependency-confusion",
    source: "Mock Security Advisory Mirror",
    sourceType: "mock",
    publishedAt: "2026-04-22T13:00:00.000Z",
    rawText: "Mock/demo duplicate used to validate exact URL deduplication.",
    metadata: {
      demo: true,
      duplicate: true,
      category: "security",
      entities: ["Mock Security Advisory"],
      keywords: ["security", "dependency confusion"]
    }
  }
];
