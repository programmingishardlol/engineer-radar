# MVP Scope

## MVP Objective

Prove that a mock-first, high-signal dashboard is useful to engineers before building real collection and ranking infrastructure at scale.

The MVP is a vertical slice, not a full intelligence platform.

## In Scope

### Product scope

- A single dashboard for ranked engineering-relevant updates
- Manual refresh behavior
- Category-aware feed browsing using the shared category slugs
- Clear update cards with summary, why-it-matters context, audience, suggested action, confidence, and score
- Source and publish context preserved in the feed item data

### System scope

- Shared TypeScript contracts in `src/types/`
- Mock collectors and mock/demo data
- Normalization, deduplication, and deterministic ranking scaffolds
- Feed service and `GET /api/feed`
- Frontend dashboard that consumes the feed API
- SQLite/Prisma scaffold for later persistence
- Tests that cover the mock feed pipeline

### Quality scope

- Small, scannable feed rather than high-volume output
- Clear distinction between trusted sources and discovery-only sources
- Basic duplicate suppression
- Stable contracts so parallel agents can work independently

## Explicit Non-Goals

- No authentication
- No paid APIs
- No vector search
- No real scraping yet
- No background jobs
- No personalization
- No saved preferences UI
- No email or Slack digest
- No LLM-generated summaries requirement
- No external network dependency for the demo feed

## Release Quality Bar

- Mock data is clearly labeled as mock/demo.
- No external network calls are required for the feed.
- The dashboard renders the ranked feed from the shared API contract.
- Contracts are stable enough for agents to code against.
- The product clearly favors high-signal items over volume.
- The feed does not visibly repeat the same story across multiple cards.

## Product Acceptance Criteria

- The dashboard should feel like "here are the few updates engineers should know today."
- Each surfaced item should explain why the update matters, not just what happened.
- Students and non-specialists should be able to understand the summaries without excessive jargon.
- The feed should support future real ingestion without requiring PM docs to redefine the contracts.

## Deferred Until After MVP

- Real ingestion from RSS, GitHub, arXiv, Hacker News, or company sites
- Persistent viewed-state workflows
- Advanced dedupe logic across broader source sets
- Feedback loops and ranking personalization
- Trend views, alerts, and digests
- Rich startup research cards
