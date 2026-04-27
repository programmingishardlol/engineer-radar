# MVP Scope

## Included

- Shared TypeScript contracts in `src/types/`
- Mock collectors and mock data
- Normalization, deduplication, and ranking scaffolds
- Feed service and `GET /api/feed`
- Prisma SQLite schema scaffold
- Frontend dashboard consuming the feed API
- Vitest coverage for the vertical slice
- Worktree-based parallel-agent workflow docs

## Excluded

- Real RSS/GitHub/Hacker News/arXiv/company blog ingestion
- Background jobs
- Authentication
- Saved preferences UI
- Email or Slack digest
- Paid API usage
- LLM summarization

## MVP Quality Bar

- Mock data is clearly labeled as mock/demo.
- No external network calls are required for the feed.
- Contracts are stable enough for agents to code against.
- Tests cover the contract pipeline from mock collection to ranked feed.
