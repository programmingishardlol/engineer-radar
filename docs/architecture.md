# Architecture

Engineering Radar uses a mock-first vertical slice with clear module boundaries.

## Layers

- `src/types/`: shared contracts for all agents.
- `src/mocks/`: stable mock data for raw, canonical, and ranked items.
- `src/collectors/`: source-specific collectors that output `RawItem[]`.
- `src/pipeline/`: normalization and deduplication from raw to canonical items.
- `src/ranking/`: deterministic scoring and ranking of canonical items.
- `src/server/`: feed orchestration and ingest job scaffolding.
- `src/db/`: Prisma client and repository scaffolding.
- `src/app/api/`: Next.js API routes.
- `src/components/` and `src/app/`: dashboard UI.

## Boundary Rules

- Implementation layers import shared contracts from `src/types/`.
- Frontend fetches `/api/feed`; it does not import `src/server/`.
- Backend service composes collector, pipeline, dedupe, and ranking modules.
- Database is scaffolded but not required for the first mock feed.

## Vertical Slice

`mockCollector -> normalizeRawItems -> deduplicateCanonicalItems -> rankItems -> getFeed -> GET /api/feed -> dashboard`.
