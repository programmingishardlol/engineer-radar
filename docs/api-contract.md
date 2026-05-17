# API Contract

## GET `/api/feed`

Returns the ranked engineering update feed consumed by the dashboard.

### Query Params

- `category`: optional `Category`
- `minScore`: optional number from `0` to `5`
- `limit`: optional integer, clamped by the server
- `mode`: optional `"mock"` to explicitly request demo fixture data. Default behavior is database-first auto mode.

### Type Source

The contract types are exported from `src/types/index.ts`.

### Response

```ts
type FeedResponse = {
  items: RankedItem[];
  total: number;
  generatedAt: string;
  dataSource: "database" | "mock" | "transient";
  fallbackReason?: "database_empty" | "database_unavailable" | "explicit_mock_mode";
};
```

### Field Semantics

- `items` is already ordered for presentation.
- `total` is the number of matched items before the final slice in `items`.
- `generatedAt` is an ISO-8601 timestamp.
- `dataSource` tells the dashboard whether the response came from persisted SQLite rows, mock fixtures, or freshly fetched unsaved items.
- `fallbackReason` is present only when mock fixtures are used.
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

The MVP fetches a small registry of free RSS/Atom feeds. Refresh persists non-mock RSS/Atom items to SQLite and reloads the feed from `GET /api/feed`. If every feed fails or returns no entries, ingestion does not save mock/demo data; the returned feed falls back through the normal database-first feed service.

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

## GET `/api/sources`

Returns persisted source registry rows plus lightweight health stats derived from saved raw items.

```ts
type SourceAdminItem = SourceRegistryItem & {
  stats: {
    savedItemCount: number;
    latestPublishedAt?: string;
    lastSavedAt?: string;
  };
};
```

The route syncs the default RSS registry into SQLite before returning rows. Existing `enabled` values are preserved so disabled noisy sources stay disabled.

## PATCH `/api/sources`

Updates source enabled state.

Request:

```json
{
  "url": "https://example.com/feed.xml",
  "enabled": false
}
```

Response:

```json
{
  "source": {}
}
```

Invalid payloads return:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Expected JSON body with string url and boolean enabled."
  }
}
```
