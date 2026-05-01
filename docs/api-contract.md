# API Contract

## GET `/api/feed`

Returns the ranked engineering update feed consumed by the dashboard.

### Query Params

- `category`: optional `Category`
- `minScore`: optional number from `0` to `5`
- `limit`: optional integer, clamped by the server

### Type Source

The contract types are exported from `src/types/index.ts`.

### Response

```ts
type FeedResponse = {
  items: RankedItem[];
  total: number;
  generatedAt: string;
};
```

### Field Semantics

- `items` is already ordered for presentation.
- `total` is the number of matched items before the final slice in `items`.
- `generatedAt` is an ISO-8601 timestamp.
- `entities` is a string array in the current shared contract.
- `whoShouldCare` is a single user-facing string in the current shared contract.
- `confidence` is a number from `0` to `1`.
- `category` and `sourceType` must use values exported from `src/types/`.

### Ranked Item Fields

- `id`
- `title`
- `url`
- `source`
- `sourceType`
- `publishedAt`
- `category`
- `entities`
- `summaryCandidateText`
- `supportingUrls`
- `score`
- `summary`
- `whyEngineersCare`
- `whoShouldCare`
- `suggestedAction`
- `confidence`

## POST `/api/refresh`

Triggers RSS/Atom ingestion, persists ranked items when SQLite is configured, and returns the refreshed feed.

### Refresh Response

```ts
type RefreshResponse = {
  fetched: number;
  saved: number;
  usedFallback: boolean;
  sourceCount: number;
  feed: FeedResponse;
};
```

### Current Mode

The MVP fetches a small registry of free RSS/Atom feeds. If every feed fails or returns no entries, ingestion falls back to mock/demo data.

### Error Contract

Non-2xx responses should return JSON in this shape:

```json
{
  "error": {
    "code": "internal_error",
    "message": "Unable to build the feed."
  }
}
```

### Compatibility Rules

- Frontend should consume the HTTP contract, not server internals.
- Tests should validate `GET /api/feed` against `FeedResponse`.
- New feed fields must be added in `src/types/` before they are used by server or frontend code.
