# API Contract

## GET `/api/feed`

Returns a ranked engineering update feed.

### Query Params

- `category`: optional `Category`
- `minScore`: optional number
- `limit`: optional integer

### Response

```ts
type FeedResponse = {
  items: RankedItem[];
  total: number;
  generatedAt: string;
};
```

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

### Current Mode

The MVP endpoint uses mock/demo data only. It must not imply live source fetching.
