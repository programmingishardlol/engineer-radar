# memory.md

## Purpose

This file records project decisions, mistakes to avoid, source reliability notes, ranking lessons, integration lessons, and subagent coordination lessons for Engineering Radar.

Agents must read this file before making changes. If an agent discovers a repeated mistake, coordination issue, or architectural lesson, it should update this file only if `memory.md` is inside its assigned task scope; otherwise it should request the update in `docs/integration-requests.md`.

## Project Decisions

- Build the mock vertical slice before real ingestion.
- Use Next.js, TypeScript, Tailwind, Prisma, SQLite, and Vitest.
- Do not require OpenAI APIs for the MVP.
- Use SQLite locally through Prisma for the database scaffold.
- Keep real collectors as typed stubs until mock pipeline contracts are stable.
- Shared contracts live in `src/types/`.
- Frontend calls API routes and consumes API response contracts.

## Known Mistakes To Avoid

- Do not let agents invent duplicate schemas.
- Do not let frontend import backend internals.
- Do not let backend depend on real external APIs before mock collectors work.
- Do not introduce paid API dependencies into the MVP.
- Do not treat social sources as final truth without a stronger source.
- Do not rank by popularity alone; rank by engineering usefulness.
- Do not create large cross-cutting changes in subagent branches.

## Source Reliability Notes

- Highest trust: official company blogs, official release notes, GitHub releases, research papers, security advisories.
- Medium trust: reputable technical publications, startup launch pages, curated newsletters.
- Discovery only: Hacker News, Reddit, X, LinkedIn, Product Hunt.
- Social signals should be confirmed before display as real news.

## Ranking Lessons

- Engineering impact and credibility should matter more than hype.
- Hype risk should subtract from final score.
- Mock data must be clearly labeled as mock/demo.
- Security and infrastructure items can be highly urgent even without broad popularity.
- Startup items need technical defensibility signals, not invented funding or founder details.

## Integration Lessons

- Integration agent should merge in small steps and run tests after each major merge.
- Keep mock data stable so frontend, ranking, and backend can advance independently.
- Record cross-boundary requests in `docs/integration-requests.md`.
- Prefer adapters over direct imports across ownership boundaries.

## Subagent Coordination Lessons

- Build mock vertical slice before real ingestion.
- Never let agents invent duplicate schemas.
- Shared types must live in `src/types/`.
- Frontend should consume API contracts, not internal backend functions.
- Backend should work with mocked collector data before real external APIs.
- Integration agent should merge in small steps and run tests after each major merge.
