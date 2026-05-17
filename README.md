# Engineering Radar

Engineering Radar is a high-signal tech update dashboard for engineers. It is designed to collect engineering-relevant updates from AI model releases, developer tools, hardware/chips, startups, open-source projects, security advisories, cloud infrastructure, research papers, Hacker News, GitHub, RSS feeds, arXiv, and company blogs.

The MVP is now database-first with mock fixtures retained as a clearly labeled fallback. It proves the contracts, RSS ingestion, pipeline, ranking, persistence, API, and dashboard without paid APIs.

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
RSS/Atom raw items
-> normalize to canonical items
-> deduplicate exact URLs
-> rank deterministically
-> persist to SQLite
-> GET /api/feed
-> dashboard fetches and renders saved feed
```

The feed service reads persisted ranked items from SQLite first. Mock/demo data is used only when the database has no saved non-mock items or when `GET /api/feed?mode=mock` is explicitly requested.

RSS ingestion is wired for safe, free source fetching. Other external collectors are typed stubs until their source-specific implementations are added.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

`npm install` runs `prisma generate` through `postinstall`. If the Prisma schema changes while you are developing, run `npm run prisma:generate` again.

Open [http://localhost:3000](http://localhost:3000).

The dashboard calls `/api/feed`. The refresh button calls `POST /api/refresh`, which fetches RSS/Atom sources, saves non-mock items to SQLite, then reloads the feed from the database.

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
- `mode=mock` for explicit demo fixtures

Example:

```bash
curl "http://localhost:3000/api/feed?category=developer_tools&limit=5"
```

Successful responses match `FeedResponse` from `src/types/`. Non-2xx route failures return:

```json
{
  "error": {
    "code": "internal_error",
    "message": "Unable to build the feed."
  }
}
```

`GET /api/sources`

Returns source registry rows with lightweight saved-item stats:

```bash
curl "http://localhost:3000/api/sources"
```

`PATCH /api/sources`

Enable or disable a source by URL:

```bash
curl -X PATCH "http://localhost:3000/api/sources" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://blog.cloudflare.com/rss/","enabled":false}'
```

Refresh uses the persisted enabled state, so disabled sources are skipped.

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

- `npm audit` may report dependency vulnerabilities from the current framework/tooling tree. Do not run `npm audit fix --force` casually because it may introduce breaking upgrades.
- In the Codex sandbox, `npm run build` may fail when Turbopack tries to spawn/bind an internal process. The same build passed outside the sandbox.
- Git worktrees do not share ignored local files. If you run the app from a feature worktree, it needs its own `.env` and `prisma/dev.db`.
- GitHub, Hacker News, arXiv, and company-blog HTML collectors are compile-safe stubs unless they are backed by RSS/Atom sources.
