# Product Spec

Engineer Radar is a high-signal engineering update dashboard. It helps engineers quickly understand which recent updates matter, why they matter, and what they may want to learn, test, or watch next.

The MVP is intentionally mock-first. The goal is to validate product usefulness before the team builds real ingestion, broader automation, or personalization.

## Product Goal

Answer one core question well:

> What should an engineer know today that could affect tools, skills, architecture choices, or career direction?

## Target Users

### Primary

- Software engineers
- AI engineers
- Hardware and systems engineers
- Engineering students
- Technical founders

### Secondary

- Integration developers building against the feed contract
- Technical product or engineering leads tracking major platform shifts

## Core Problem

Important updates are spread across company blogs, release notes, GitHub, research papers, cloud changelogs, security advisories, startup launch pages, and technical publications.

Most existing feeds fail in one of four ways:

- They are too broad and become generic tech news.
- They repeat the same story from multiple sources.
- They explain what happened but not why engineers should care.
- They mix strong sources with rumor or hype without clear confidence.

Engineer Radar should reduce that noise into a compact dashboard with clear summaries, trustworthy sources, and obvious engineering relevance.

## Product Principles

- High signal over high volume
- Simple language over jargon-heavy summaries
- Trusted sourcing over rumor-first aggregation
- Deduplicated events over repeated headlines
- Practical engineering relevance over generic business commentary
- Mock-first validation before expensive ingestion work

## MVP Features

### 1. Mock-first ranked dashboard

- Render a short ranked feed from mock/demo data.
- Keep the dashboard intentionally compact and scannable.
- Avoid infinite-feed behavior.

### 2. Category-aware browsing

- Support the shared category contract:
  - `ai_models`
  - `developer_tools`
  - `hardware`
  - `startups`
  - `open_source`
  - `security`
  - `cloud_infrastructure`
  - `research`
  - `company_moves`
  - `career_skills`
- Let users scan or filter by category without fragmenting the product into too many views.

### 3. Useful update cards

Each displayed item should clearly communicate:

- `title`
- `summary`
- `whyEngineersCare`
- `whoShouldCare`
- `suggestedAction`
- `confidence`
- `score`
- source and publish context from the shared item contract

### 4. Refresh-based discovery

- Support manual refresh instead of constant feed churn.
- Keep the UX aligned with intentional check-ins, not endless consumption.

### 5. Dedupe-aware surfacing

- Avoid showing multiple cards for the same underlying event.
- Prefer one strong item with supporting evidence over several near-identical entries.

### 6. Source-aware credibility

- Preserve source strength and confidence in the feed experience.
- Prefer official or otherwise trusted technical sources.

## Non-Goals

- No authentication
- No paid APIs
- No vector search
- No real scraping yet
- No background jobs or always-on collectors
- No personalization or recommendation engine
- No chat interface
- No email, Slack, or push notification workflows
- No production-grade startup enrichment

## Success Metrics

### Signal quality

- At least 70 percent of surfaced items should be judged useful or very useful in manual review.
- At least 80 percent of surfaced items should include a clear engineering takeaway, not just a headline rewrite.

### Dedupe quality

- Fewer than 10 percent of displayed items in a review batch should be obvious duplicates.
- Cross-source coverage of the same event should converge into one primary surfaced item.

### Source reliability

- At least 90 percent of surfaced items should cite an official or otherwise trusted source.
- Items based mainly on community discovery should carry lower confidence until confirmed.

### Dashboard usefulness

- A user should be able to identify the top 5 updates in under 3 minutes.
- A user should be able to explain why at least 3 surfaced items matter after one pass through the feed.

### Team usefulness

- A new contributor should be able to understand the mock-first product slice and shared contracts from the docs without redefining the MVP.

## Future Features

- Real source ingestion by category
- Database-backed viewed and processed history
- Better dedupe across rewritten headlines
- Feedback signals for useful or low-value items
- Ranking explanation UI
- Trend views across days and weeks
- Startup-specific enrichment once sourcing is reliable
- Lightweight personalization after the base dashboard proves useful
