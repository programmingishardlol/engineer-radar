import type { SourceRegistryItem } from "../types";

const lowSignalExcludes = [
  "webinar",
  "customer story",
  "case study",
  "generic event",
  "conference",
  "summit",
  "hiring",
  "career opportunity",
  "partner",
  "sponsored",
  "sales",
  "promotion"
];

export const defaultRssSources: SourceRegistryItem[] = [
  {
    id: "openai-news",
    name: "OpenAI News",
    url: "https://openai.com/news/rss.xml",
    category: "ai_models",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 100,
    includeKeywords: ["model", "api", "agent", "coding", "developer", "research", "inference", "multimodal"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "anthropic-news",
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss.xml",
    category: "ai_models",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 98,
    includeKeywords: ["claude", "model", "api", "agent", "coding", "developer", "research", "safety"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "hugging-face-blog",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "ai_models",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 4,
    enabled: true,
    priority: 86,
    includeKeywords: ["model", "dataset", "transformers", "inference", "agents", "open-source", "benchmark"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "github-changelog",
    name: "GitHub Changelog",
    url: "https://github.blog/changelog/feed/",
    category: "developer_tools",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 96,
    includeKeywords: ["copilot", "actions", "codespaces", "api", "security", "repository", "code scanning", "developer"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "visual-studio-code-updates",
    name: "Visual Studio Code Updates",
    url: "https://code.visualstudio.com/feed.xml",
    category: "developer_tools",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 88,
    includeKeywords: ["release", "debug", "extension", "terminal", "typescript", "copilot", "agent", "editor"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "typescript-blog",
    name: "TypeScript Blog",
    url: "https://devblogs.microsoft.com/typescript/feed/",
    category: "developer_tools",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 84,
    includeKeywords: ["typescript", "release", "compiler", "language service", "javascript", "developer"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "nvidia-technical-blog",
    name: "NVIDIA Technical Blog",
    url: "https://developer.nvidia.com/blog/feed/",
    category: "hardware",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 94,
    includeKeywords: ["gpu", "cuda", "inference", "training", "accelerated", "hpc", "robotics", "datacenter"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "serve-the-home",
    name: "ServeTheHome",
    url: "https://www.servethehome.com/feed/",
    category: "hardware",
    sourceType: "rss",
    fetchMethod: "rss",
    credibility: 4,
    enabled: true,
    priority: 78,
    includeKeywords: ["gpu", "cpu", "server", "networking", "accelerator", "memory", "storage", "datacenter"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "google-security-blog",
    name: "Google Security Blog",
    url: "https://security.googleblog.com/feeds/posts/default",
    category: "security",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 92,
    includeKeywords: ["security", "vulnerability", "exploit", "supply chain", "malware", "patch", "cve"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "kubernetes-cve-feed",
    name: "Kubernetes CVE Feed",
    url: "https://k8s.io/docs/reference/issues-security/official-cve-feed/feed.xml",
    category: "security",
    sourceType: "rss",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 90,
    includeKeywords: ["cve", "vulnerability", "security", "kubernetes", "patch"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "aws-news",
    name: "AWS News Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "cloud_infrastructure",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 90,
    includeKeywords: ["ec2", "lambda", "s3", "database", "kubernetes", "serverless", "gpu", "infrastructure"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "cloudflare-blog",
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss/",
    category: "cloud_infrastructure",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 88,
    includeKeywords: ["workers", "security", "network", "database", "storage", "serverless", "observability", "infrastructure"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "google-cloud-blog",
    name: "Google Cloud Blog",
    url: "https://cloud.google.com/blog/rss",
    category: "cloud_infrastructure",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 82,
    includeKeywords: ["cloud", "kubernetes", "database", "security", "ai infrastructure", "gpu", "serverless"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "kubernetes-blog",
    name: "Kubernetes Blog",
    url: "https://kubernetes.io/feed.xml",
    category: "open_source",
    sourceType: "rss",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 86,
    includeKeywords: ["release", "kubernetes", "security", "api", "container", "scheduler", "networking"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "cncf-blog",
    name: "CNCF Blog",
    url: "https://www.cncf.io/feed/",
    category: "open_source",
    sourceType: "rss",
    fetchMethod: "rss",
    credibility: 4,
    enabled: true,
    priority: 74,
    includeKeywords: ["kubernetes", "observability", "runtime", "security", "open source", "cloud native", "release"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "google-research",
    name: "Google Research Blog",
    url: "https://research.google/blog/rss/",
    category: "research",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 82,
    includeKeywords: ["ai", "machine learning", "model", "benchmark", "dataset", "robotics", "systems", "paper"],
    excludeKeywords: lowSignalExcludes
  },
  {
    id: "arxiv-cs-ai",
    name: "arXiv cs.AI",
    url: "https://export.arxiv.org/rss/cs.AI",
    category: "research",
    sourceType: "arxiv",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true,
    priority: 76,
    includeKeywords: ["agent", "llm", "reasoning", "planning", "benchmark", "evaluation", "robotics", "learning"],
    excludeKeywords: lowSignalExcludes
  }
];

export function listEnabledRssSources(sources: SourceRegistryItem[] = defaultRssSources): SourceRegistryItem[] {
  return sources
    .filter((source) => source.enabled && source.fetchMethod === "rss")
    .sort((first, second) => (second.priority ?? 0) - (first.priority ?? 0) || first.name.localeCompare(second.name));
}
