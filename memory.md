
---

## 2. `memory.md`

```md
# memory.md

## Purpose

This file helps Codex and future agents learn from mistakes while building Engineer Radar.

Before making changes, agents must read this file and apply the lessons.

After finding a bug, bad assumption, or repeated mistake, agents must update this file.

---

## Current Product Direction

Engineer Radar is a dashboard for engineers to track important updates across:

- AI models
- AI coding tools
- hardware
- semiconductors
- startups
- big tech
- engineering skills
- open source tools
- developer infrastructure
- layoffs and hiring changes

The product should not become a generic news app.

It should focus on updates that matter to engineers.

---

## Important User Preferences

- Use simple language.
- Explain why something matters.
- Avoid hype.
- Prioritize real technical and career value.
- Make the product useful for students, engineers, and technical founders.
- Include Codex, Cursor, Claude Code, and other AI coding tools.
- Include hardware and software industry news.
- Include fast-growing startups.
- Avoid repeated news.
- Prefer refresh-button behavior over automatic feed spam.
- Store viewed/processed items in a database.

---

## Mistakes to Avoid

### Mistake 1: Making the product too broad

Do not build a generic tech news feed.

Bad:

- celebrity tech news
- random product announcements
- consumer gadget rumors
- crypto price movement
- low-quality reposts

Good:

- new AI model release
- important chip update
- developer tool improvement
- engineering job market signal
- technical startup with traction
- open-source tool gaining adoption

---

### Mistake 2: Showing updates without explaining why they matter

Every update needs a “why it matters” field.

Bad:

> NVIDIA announced a new GPU.

Good:

> NVIDIA announced a new GPU. This matters because it could reduce training or inference cost for AI workloads and may influence what cloud hardware engineers use next year.

---

### Mistake 3: Too much jargon

The product should be useful even when the user is not an expert in that category.

Bad:

> The model improves long-context multi-agentic inference with tool-use orchestration.

Good:

> The model can handle longer tasks and use tools better, which may make AI coding agents more useful for real software projects.

---

### Mistake 4: No duplicate prevention

Do not show the same update again and again.

Always check:

- URL
- normalized title
- company
- product
- date
- summary similarity

---

### Mistake 5: Treating social media as truth

Social media can be a signal, but not the final source.

If an update is found on X, Reddit, Hacker News, or LinkedIn, try to confirm it with:

- official blog
- GitHub release
- company announcement
- trusted publication
- research paper
- filing

---

### Mistake 6: Overbuilding before MVP

Do not start with complex multi-agent architecture, vector search, personalized ranking, or paid APIs unless the MVP already works.

Build first:

- source list
- fetch updates
- normalize
- dedupe
- score
- display
- save viewed items

---

### Mistake 7: Fake or hallucinated startup info

For startup profiles, do not invent founder background, funding, or market size.

If unknown, use:

```txt
Unknown from available sources.
```

---

### Mistake 8: Assuming the local project has complete scaffolding

The initial workspace may not be a Git repository, and some planning docs can be partial or truncated.

Before making changes:

- Check whether `.git` exists before relying on git commands.
- Read the actual file contents instead of assuming all schema and scoring details are complete.
- Keep runtime types and utilities explicit in `src/lib` until the database schema docs are expanded.
