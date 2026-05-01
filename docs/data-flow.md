# Data Flow

The MVP feed has four stable handoff stages. Each stage owns its own logic, but the objects crossing the boundary must match `src/types/`.

## Stage 1: Collection

- Owner: collectors
- Input: external sources or mock fixtures
- Output: `RawItem[]`

`RawItem` rules:

- `id`, `title`, `url`, `source`, `sourceType`, and `publishedAt` are required.
- `rawText` is optional extracted text for downstream normalization.
- `metadata` is optional source-specific context.
- No collector should emit category, scoring, ranking, or UI copy.

## Stage 2: Canonicalization

- Owner: pipeline
- Input: `RawItem[]`
- Output: `CanonicalItem[]`

`CanonicalItem` rules:

- Carries normalized feed-ready source fields.
- Adds exactly these cross-boundary fields: `category`, `entities`, `summaryCandidateText`, and `supportingUrls`.
- Deduplication may change `supportingUrls`, but it must not change the outward shape.

## Stage 3: Ranking

- Owner: ranking
- Input: `CanonicalItem[]`
- Output: `RankedItem[]`

`RankedItem` rules:

- `score` uses `ScoreBreakdown`.
- `summary`, `whyEngineersCare`, `whoShouldCare`, and `suggestedAction` are user-facing copy.
- `confidence` is a numeric confidence value between `0` and `1`.
- Ranking order is descending by the owning ranking logic before the feed service returns items.

## Stage 4: Feed Delivery

- Owner: server
- Input: `RankedItem[]`
- Output: `FeedResponse`

`FeedResponse` rules:

- `items` is the ordered feed payload.
- `total` is the count before `limit` truncation is removed from consideration by the server's chosen semantics.
- `generatedAt` is the response assembly timestamp in ISO-8601 form.
- Query filtering happens here, not in the frontend.

## Runtime Path

`collectRssItems(defaultRssSources) -> normalizeRawItems -> deduplicateCanonicalItems -> rankItems -> save to SQLite -> GET /api/feed -> Dashboard`

If RSS/Atom collection returns no items, the runtime path falls back to:

`collectMockRawItems -> normalizeRawItems -> deduplicateCanonicalItems -> rankItems -> optional save to SQLite -> GET /api/feed -> Dashboard`

## Future Persistent Flow

1. Add source health and per-source last-fetched timestamps.
2. Track displayed or read items separately from the feed contract.
3. Apply user preferences in the feed service without changing shared item shapes.
4. Add non-RSS collectors only after the RSS vertical slice remains stable.
