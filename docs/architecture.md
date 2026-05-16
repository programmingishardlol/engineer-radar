# Architecture

Engineering Radar uses a database-first feed with a mock fixture fallback and strict shared contracts so parallel agents can move without inventing duplicate schemas.

## Source Of Truth

- `src/types/` is the only shared contract source of truth.
- `docs/api-contract.md` is the HTTP contract source of truth for `GET /api/feed`.
- `docs/data-flow.md` is the stage handoff source of truth.
- Runtime modules may add internal helpers, but cross-boundary payload shapes must come from `src/types/`.

## Ownership Boundaries

- Architect Agent
  - Owns `src/types/`
  - Owns `docs/architecture.md`, `docs/data-flow.md`, and `docs/api-contract.md`
  - Defines stable shared interfaces and handoff boundaries
- Collectors owner
  - Owns `src/collectors/`
  - Emits `RawItem[]`
  - Must not assign categories, summaries, scores, or API envelopes
- Pipeline owner
  - Owns `src/pipeline/`
  - Converts `RawItem[]` into `CanonicalItem[]`
  - Owns classification, entity extraction, normalization, and deduplication internals
- Ranking owner
  - Owns `src/ranking/`
  - Converts `CanonicalItem[]` into `RankedItem[]`
  - Owns scoring rules, ranking order, summary text, confidence, and suggested actions
- Server owner
  - Owns `src/server/` and `src/app/api/`
  - Converts ranked items into `FeedResponse`
  - Owns query parsing, filtering, and error serialization
- Frontend owner
  - Owns `src/components/` and `src/app/`
  - Consumes `FeedResponse` read-only through HTTP
  - Must not import server internals
- Database owner
  - Owns `src/db/` and `prisma/`
  - Persists raw, canonical, ranked, and source records without redefining shared transport types
- Testing owner
  - Owns `tests/`
  - Verifies contract imports and endpoint compatibility against `src/types/`

## Layer Map

- `src/types/`: shared contracts for all agents
- `src/mocks/`: stable mock fixtures for raw, canonical, and ranked stages
- `src/collectors/`: source-specific collectors that output `RawItem[]`
- `src/pipeline/`: normalization and deduplication from raw to canonical items
- `src/ranking/`: deterministic scoring and ranking of canonical items
- `src/server/`: feed orchestration and ingest job scaffolding
- `src/db/`: Prisma client and repository scaffolding
- `src/app/api/`: Next.js API routes
- `src/components/` and `src/app/`: dashboard UI

## Boundary Rules

- Implementation layers import shared contracts from `src/types/`.
- Frontend fetches `GET /api/feed`; it does not import `src/server/`.
- Backend orchestration composes collectors, pipeline, dedupe, and ranking modules.
- Database persistence is downstream of collectors and ranking and must not redefine transport contracts.
- Mock/demo status is data behavior, not a separate alternate schema.

## Vertical Slice

`RSS collectors -> normalizeRawItems -> deduplicateCanonicalItems -> rankItems -> persist SQLite rows -> getFeed -> GET /api/feed -> dashboard`

Mock fixtures remain available through explicit mock mode and as the empty-database fallback. They should not be saved as if they were live news.
