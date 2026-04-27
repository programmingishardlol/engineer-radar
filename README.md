# Engineering Radar

Engineering Radar is a high-signal tech update dashboard for engineers. It is designed to collect engineering-relevant updates from AI model releases, developer tools, hardware/chips, startups, open-source projects, security advisories, cloud infrastructure, research papers, Hacker News, GitHub, RSS feeds, arXiv, and company blogs.

The MVP is mock-first. It proves the contracts, pipeline, ranking, API, and dashboard before real ingestion.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local MVP
- Vitest
- No required OpenAI API dependency

## MVP Status

Current vertical slice:

```txt
mock raw items
-> normalize to canonical items
-> deduplicate exact URLs
-> rank deterministically
-> GET /api/feed
-> dashboard fetches and renders feed
```

Real external collectors are typed stubs. They intentionally return empty arrays until the collector agents wire safe, free source ingestion.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
npm run prisma:generate
npm run prisma:migrate
```

## API

`GET /api/feed`

Optional query params:

- `category`
- `minScore`
- `limit`

Example:

```bash
curl "http://localhost:3000/api/feed?category=developer_tools&limit=5"
```

## Parallel Subagent Workflow

Read these first:

- `AGENTS.md`
- `memory.md`
- the relevant file in `agents/`
- `docs/parallel-workflow.md`

Create worktrees:

```bash
mkdir -p ../engineering-radar-agents
git worktree add ../engineering-radar-agents/architect -b agent/architect
git worktree add ../engineering-radar-agents/backend-db -b agent/backend-db
git worktree add ../engineering-radar-agents/collector-pipeline -b agent/collector-pipeline
git worktree add ../engineering-radar-agents/ranking-dedupe -b agent/ranking-dedupe
git worktree add ../engineering-radar-agents/frontend -b agent/frontend
git worktree add ../engineering-radar-agents/testing -b agent/testing
git worktree add ../engineering-radar-agents/product-manager -b agent/product-manager
git worktree add ../engineering-radar-agents/integration -b agent/integration
```

Or print commands:

```bash
python3 tools/run_subagents.py commands
```

Check branch ownership:

```bash
python3 tools/run_subagents.py check agent/architect main
```

## Merge Order

1. `agent/architect`
2. `agent/product-manager`
3. `agent/collector-pipeline`
4. `agent/ranking-dedupe`
5. `agent/backend-db`
6. `agent/frontend`
7. `agent/testing`
8. `agent/integration`

Run `npm test` after major merges and `npm run build` before final integration.

## Ownership Summary

- Product Manager: `docs/product-spec.md`, `docs/mvp-scope.md`, `docs/user-stories.md`
- Architect: `docs/architecture.md`, `docs/data-flow.md`, `docs/api-contract.md`, `src/types/`
- Backend + Database: `prisma/`, `src/db/`, `src/server/`, `src/app/api/`
- Collector Pipeline: `src/collectors/`, `src/pipeline/normalize.ts`, `src/mocks/rawItems.ts`
- Ranking + Deduplication: `src/ranking/`, `src/pipeline/deduplicate.ts`, `src/mocks/canonicalItems.ts`, `src/mocks/rankedItems.ts`
- Frontend Dashboard: `src/app/`, `src/components/`
- Testing: `tests/`, `vitest.config.ts`
- Integration: `package.json`, `package-lock.json`, `README.md`, `docs/integration-requests.md`, final wiring

## What Each Subagent Should Do Next

- Product Manager: refine success metrics and user stories without touching code.
- Architect: review and stabilize `src/types/` plus API docs before other agents expand implementation.
- Collector Pipeline: replace typed stubs with safe free-source collectors, starting with RSS.
- Ranking + Deduplication: improve title similarity and scoring evidence while preserving deterministic tests.
- Backend + Database: wire Prisma repositories behind the existing feed service without breaking mock mode.
- Frontend Dashboard: improve filters, empty states, and source display while consuming only `/api/feed`.
- Testing: add API route and component-level tests.
- Integration: merge branches in order, resolve small wiring issues, and keep `docs/integration-requests.md` current.

## Known Issues

- `npm install` reports moderate vulnerabilities from dependencies. Do not run `npm audit fix --force` casually because it may introduce breaking upgrades.
- Prisma schema is scaffolded but not yet wired into the feed API.
- External collectors are compile-safe stubs, not real ingestion.
