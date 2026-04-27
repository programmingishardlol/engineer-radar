# Engineer Radar

Engineer Radar is a Next.js MVP scaffold for a dashboard that helps engineers scan important technical updates.

This first version runs in mock data mode only. It does not fetch live news, use paid APIs, add authentication, or perform vector search.

## What Exists

- Next.js App Router, TypeScript, and Tailwind CSS
- Homepage dashboard grouped by category
- Update cards with summary, why it matters, audience, source, publish date, and score
- Refresh button that calls `/api/refresh`
- Mock update data clearly marked as mock
- Source registry for future free/source-owned fetching
- Scoring, normalization, and dedupe utilities
- Unit tests for scoring, normalization, dedupe, and source registry

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Mock Data Mode

The dashboard and `/api/refresh` return sample updates from `src/lib/mockUpdates.ts`.

Mock items are intentionally labeled and use `example.com` URLs. They are placeholders for UI, scoring, normalization, and dedupe behavior only.

## Project Structure

```txt
src/app/                  Next.js app routes
src/app/api/refresh/      Mock refresh API route
src/components/           Dashboard, category section, and update card UI
src/lib/                  Types, sources, scoring, normalization, dedupe, mock data
tests/                    Vitest utility tests
```

## Next Steps

1. Add a database and persisted viewed/processed update history.
2. Implement free source fetching, starting with RSS or official changelog pages.
3. Store raw fetched items before normalization.
4. Add API route tests and empty-state tests.
5. Add category filters and viewed-state controls.
