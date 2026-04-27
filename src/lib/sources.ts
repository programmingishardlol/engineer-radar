import type { Source } from "./types";

export const sourceRegistry: Source[] = [
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    url: "https://openai.com/news/",
    category: "AI Model Updates",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "anthropic-news",
    name: "Anthropic News",
    url: "https://www.anthropic.com/news",
    category: "AI Model Updates",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "cursor-changelog",
    name: "Cursor Changelog",
    url: "https://cursor.com/changelog",
    category: "AI Coding Tool Updates",
    type: "release_notes",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    url: "https://github.blog/",
    category: "AI Coding Tool Updates",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "nvidia-blog",
    name: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/",
    category: "Hardware and Computing",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "tsmc-news",
    name: "TSMC Newsroom",
    url: "https://pr.tsmc.com/english/news",
    category: "Semiconductor and Manufacturing",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "yc-companies",
    name: "YC Companies",
    url: "https://www.ycombinator.com/companies",
    category: "Fast-Growing Startups",
    type: "startup_database",
    trustScore: 4,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "microsoft-devblogs",
    name: "Microsoft Developer Blogs",
    url: "https://devblogs.microsoft.com/",
    category: "Big Tech Company Updates",
    type: "official_blog",
    trustScore: 5,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "github-trending",
    name: "GitHub Trending",
    url: "https://github.com/trending",
    category: "Open Source and Developer Infrastructure",
    type: "github_release",
    trustScore: 4,
    fetchMethod: "html",
    enabled: true
  },
  {
    id: "hn",
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    category: "Engineering Career and Skill Signals",
    type: "social_signal",
    trustScore: 3,
    fetchMethod: "html",
    enabled: true
  }
];
