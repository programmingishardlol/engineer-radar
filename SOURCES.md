
---

## 4. `SOURCES.md`

```md
# SOURCES.md

## Purpose

This file defines the source strategy for Engineer Radar.

The product should gather important engineering-related updates from reliable sources.

---

## Source Priority

Use this priority order:

1. Official company blogs
2. Official release notes
3. GitHub releases
4. Research papers
5. Startup databases
6. Reputable tech publications
7. Engineering blogs
8. Newsletters
9. Hacker News / Reddit / X only as discovery signals

---

## Source Types

### official_blog

Company or organization blog.

Examples:

- OpenAI blog
- Anthropic news
- Google DeepMind blog
- Meta AI blog
- NVIDIA blog
- AMD blog
- Intel newsroom
- TSMC newsroom
- GitHub blog
- Microsoft developer blog

Trust score: high

---

### release_notes

Official changelog or product update page.

Examples:

- Cursor changelog
- Claude Code release notes
- GitHub Copilot release notes
- VS Code release notes
- Next.js releases
- Vercel changelog
- Supabase changelog

Trust score: high

---

### github_release

GitHub releases or trending repos.

Examples:

- popular open-source AI tools
- developer infrastructure repos
- MCP servers
- agent frameworks
- databases
- build tools

Trust score: medium to high

---

### research_paper

Research paper or technical report.

Examples:

- arXiv papers
- company research papers
- benchmark papers

Trust score: medium to high

Important: research papers should be summarized carefully. Do not overstate real-world impact.

---

### tech_publication

Reputable tech news publication.

Examples:

- The Verge
- TechCrunch
- The Information
- IEEE Spectrum
- SemiAnalysis
- Ars Technica
- VentureBeat
- MIT Technology Review

Trust score: medium

---

### startup_database

Startup discovery source.

Examples:

- Y Combinator company directory
- funding announcements
- company launch pages
- Crunchbase-like data if available
- Product Hunt only as weak signal

Trust score: medium

---

### social_signal

Discovery-only sources.

Examples:

- Hacker News
- Reddit
- X/Twitter
- LinkedIn

Trust score: low to medium

Rule: Try to confirm social signals with a stronger source before showing.

---

## Suggested Initial Source Registry

Start with a small list.

```ts
const sources = [
  {
    name: "OpenAI Blog",
    category: "AI Models",
    type: "official_blog",
    url: "https://openai.com/news/",
    trustScore: 5,
    enabled: true
  },
  {
    name: "Anthropic News",
    category: "AI Models",
    type: "official_blog",
    url: "https://www.anthropic.com/news",
    trustScore: 5,
    enabled: true
  },
  {
    name: "Google DeepMind Blog",
    category: "AI Models",
    type: "official_blog",
    url: "https://deepmind.google/discover/blog/",
    trustScore: 5,
    enabled: true
  },
  {
    name: "NVIDIA Blog",
    category: "Hardware",
    type: "official_blog",
    url: "https://blogs.nvidia.com/",
    trustScore: 5,
    enabled: true
  },
  {
    name: "GitHub Blog",
    category: "Developer Tools",
    type: "official_blog",
    url: "https://github.blog/",
    trustScore: 5,
    enabled: true
  },
  {
    name: "YC Companies",
    category: "Startups",
    type: "startup_database",
    url: "https://www.ycombinator.com/companies",
    trustScore: 4,
    enabled: true
  }
]