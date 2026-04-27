# AGENTS.md

## Project Name

Engineer Radar

## Mission

Build a software product that automatically gathers, ranks, summarizes, and displays important updates across the hardware, software, AI, semiconductor, startup, developer tooling, and engineering job market.

The goal is to help engineers stay aware of important changes without manually checking many websites every day.

This product should answer:

> “What should an engineer know today that could affect their skills, career, tools, or understanding of the tech industry?”

---

## Product Vision

Engineer Radar is not just a news app.

It is a personalized intelligence dashboard for engineers.

It should track:

1. New AI model releases
2. Hardware breakthroughs
3. Semiconductor and GPU updates
4. Developer tool updates
5. Codex / Cursor / Claude Code / AI coding assistant updates
6. Fast-growing startups
7. Big tech company movement
8. Layoffs, hiring, and org changes
9. New engineering skills worth learning
10. Open-source tools gaining traction
11. Research papers that may become products
12. Startup funding and acquisition news
13. Infrastructure, cloud, database, and security updates
14. Major product launches from companies engineers care about

---

## Target User

The primary user is an engineering student, software engineer, hardware engineer, AI engineer, or technical founder who wants to stay ahead of industry changes.

The user does not want long articles.

The user wants:

- Clear summaries
- Why it matters
- Who is affected
- What skill/tool/action to pay attention to
- Links to sources
- No duplicate stories
- No low-quality clickbait
- No overwhelming feed

---

## MVP Goal

The MVP should fetch and display the most important engineering-related updates in a structured dashboard.

The MVP should prioritize quality over quantity.

The first version should support:

- A refresh button
- Fetching new updates
- Avoiding duplicate shown updates
- Saving viewed or processed updates to a database
- Displaying updates by category
- Showing a short summary and “why it matters”
- Linking to the original source
- Basic scoring/ranking
- Basic memory file for mistakes and improvement

---

## Core Categories

Use these categories in the product.

### 1. AI Model Updates

Examples:

- New models from OpenAI, Anthropic, Google DeepMind, Meta, Mistral, xAI, Cohere, Alibaba, DeepSeek, etc.
- Model capability improvements
- New context windows
- New multimodal features
- New open-source models
- Pricing changes
- Benchmark improvements
- Agentic coding model updates

For each item, explain:

- What changed
- Why engineers should care
- Whether it affects coding, research, product building, or deployment
- Whether it is available now

---

### 2. AI Coding Tool Updates

Examples:

- Codex updates
- Cursor updates
- Claude Code updates
- Windsurf updates
- GitHub Copilot updates
- Devin-like agent updates
- MCP server/tool updates
- IDE agent plugins
- Agent workflow improvements
- Coding benchmark results
- New debugging, testing, or code-review tools

For each item, explain:

- What the tool does
- What changed recently
- How it helps developers
- Whether it improves speed, debugging, refactoring, testing, or code understanding
- Whether a student or solo builder can use it

---

### 3. Hardware and Computing

Examples:

- New GPU, TPU, NPU, CPU, ASIC, FPGA, RISC-V, memory, storage, networking, or optical computing updates
- NVIDIA, AMD, Intel, Apple Silicon, Qualcomm, TSMC, Samsung, Broadcom, Cerebras, Groq, Tenstorrent, etc.
- Faster chips
- Better power efficiency
- New AI accelerator hardware
- New server architecture
- New datacenter infrastructure

For each item, explain:

- What hardware changed
- What makes it faster, cheaper, smaller, or more efficient
- What workloads benefit
- Why engineers should care

---

### 4. Semiconductor and Manufacturing

Examples:

- TSMC, Samsung, Intel Foundry updates
- New process nodes
- Packaging updates
- HBM memory updates
- Chiplet architecture
- Supply chain shifts
- Fab construction
- Export controls
- Equipment maker updates from ASML, Applied Materials, Lam Research, KLA, etc.

For each item, explain:

- What changed
- Which companies are affected
- Why it matters for AI, hardware, or computing cost

---

### 5. Fast-Growing Startups

Examples:

- YC startups
- Recently funded technical startups
- Infrastructure startups
- AI agent startups
- DevTool startups
- Robotics startups
- Semiconductor startups
- Security startups
- Data/infra startups

For each startup, include:

- Company name
- What problem they solve
- Their solution in simple words
- Founder background if available
- Funding if available
- Why engineers should watch it
- Possible market size or opportunity
- Whether the idea looks technically defensible

Use simple language that non-experts can understand.

---

### 6. Big Tech Company Updates

Examples:

- Google, Meta, Microsoft, Apple, Amazon, NVIDIA, Tesla, OpenAI, Anthropic, xAI, Oracle, Salesforce, etc.
- Product launches
- Strategy shifts
- Hiring freezes
- Layoffs
- Reorganizations
- Acquisitions
- Cloud infrastructure updates
- AI lab changes

For each item, explain:

- What happened
- Why it matters
- Which engineers may be affected
- Whether this signals a market trend

---

### 7. Engineering Career and Skill Signals

Examples:

- Skills becoming more valuable
- New frameworks or libraries gaining adoption
- New infrastructure patterns
- AI agent engineering
- CUDA, GPU programming, distributed systems, RAG, evals, MCP, robotics, embedded systems, verification, security, etc.
- Job market changes
- Internship or hiring trend signals

For each item, explain:

- What skill is becoming important
- Why now
- What kind of engineer should learn it
- Suggested learning path if useful

---

### 8. Open Source and Developer Infrastructure

Examples:

- Trending GitHub repos
- New databases
- New frameworks
- New observability tools
- Security tools
- Build tools
- Testing tools
- Local AI tooling
- Agent frameworks
- MCP servers
- Browser automation tools

For each item, explain:

- What it does
- Why it is gaining traction
- Whether it is production-ready
- Who should use it

---

## MVP Information Types to Gather

For every update, the system should try to gather:

- title
- source name
- source URL
- publish date
- category
- company or organization
- short summary
- why it matters
- affected audience
- technical keywords
- importance score
- novelty score
- confidence score
- duplicate group ID
- first seen date
- last seen date
- viewed status

---

## Ranking Logic

Rank updates using a simple scoring model first.

Score each item from 1 to 5 on:

### Importance

Does this matter to engineers?

5 = major industry shift  
4 = important technical update  
3 = useful but narrow  
2 = mildly interesting  
1 = low value

### Novelty

Is this actually new?

5 = announced today or very recently  
4 = recent and not widely known  
3 = already covered but still useful  
2 = older update  
1 = stale or repeated

### Technical Depth

Does this contain real technical information?

5 = deep technical change  
4 = clear engineering detail  
3 = product-level information  
2 = vague business update  
1 = mostly marketing

### Career Relevance

Can this affect what engineers should learn, build, or watch?

5 = strongly affects career direction  
4 = useful skill/tool signal  
3 = somewhat relevant  
2 = weak relevance  
1 = not useful for engineers

### Source Trust

Is the source credible?

5 = official company/research/source  
4 = reputable tech publication  
3 = known newsletter/blog  
2 = social media only  
1 = unclear or low-quality source

Final score can be:

importance * 0.35 +
novelty * 0.20 +
technical_depth * 0.20 +
career_relevance * 0.15 +
source_trust * 0.10

---

## Summary Format

Every update shown to the user should follow this format:

```txt
Title:
One-sentence summary:
Why it matters:
Who should care:
Category:
Source:
Published:
Score: