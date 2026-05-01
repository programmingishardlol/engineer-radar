import type { SourceRegistryItem } from "../types";

export const defaultRssSources: SourceRegistryItem[] = [
  {
    id: "openai-news",
    name: "OpenAI News",
    url: "https://openai.com/news/rss.xml",
    category: "ai_models",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "github-changelog",
    name: "GitHub Changelog",
    url: "https://github.blog/changelog/feed/",
    category: "developer_tools",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "open_source",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "aws-news",
    name: "AWS News Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "cloud_infrastructure",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "cloudflare-blog",
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss/",
    category: "security",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "google-research",
    name: "Google Research Blog",
    url: "https://research.google/blog/rss/",
    category: "research",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  },
  {
    id: "nvidia-blog",
    name: "NVIDIA Technical Blog",
    url: "https://developer.nvidia.com/blog/feed/",
    category: "hardware",
    sourceType: "company_blog",
    fetchMethod: "rss",
    credibility: 5,
    enabled: true
  }
];

export function listEnabledRssSources(sources: SourceRegistryItem[] = defaultRssSources): SourceRegistryItem[] {
  return sources.filter((source) => source.enabled && source.fetchMethod === "rss");
}
