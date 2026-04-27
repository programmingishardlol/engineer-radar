# Product Spec

Engineering Radar is a high-signal dashboard for engineers who want to understand which technology updates matter without reading dozens of feeds.

## Target User

- Software engineers
- AI engineers
- Hardware and systems engineers
- Engineering students
- Technical founders

## Core Problem

Important updates are scattered across company blogs, release notes, GitHub, research papers, Hacker News, arXiv, cloud providers, security feeds, and startup launch pages. Generic news feeds are too broad and often miss why an update matters to an engineer.

## MVP Features

- Mock-data vertical slice
- Category-filtered dashboard
- Feed API returning ranked items
- Normalization from raw items to canonical items
- Exact URL deduplication
- Deterministic ranking
- SQLite/Prisma scaffold for persistence
- Parallel-agent workflow and ownership rules

## Non-Goals

- No real scraping yet
- No paid APIs
- No authentication
- No personalization
- No vector search
- No generated summaries from LLMs

## Success Metrics

- A new developer can run the app locally.
- `GET /api/feed` returns ranked mock items.
- The dashboard displays the ranked feed.
- Subagents can work from clear ownership boundaries without creating duplicate contracts.
