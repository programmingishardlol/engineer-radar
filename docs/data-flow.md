# Data Flow

1. Collector returns `RawItem[]`.
2. Normalizer converts raw items to `CanonicalItem[]`.
3. Deduplicator removes exact URL duplicates and preserves supporting URLs.
4. Ranker converts canonical items to `RankedItem[]`.
5. Feed service filters by query options and returns `FeedResponse`.
6. API route serializes `FeedResponse` as JSON.
7. Frontend fetches `/api/feed` and renders feed cards.

## Future Persistent Flow

1. Save raw items to `RawItem`.
2. Save normalized records to `CanonicalItem`.
3. Save scores to `ItemScore`.
4. Track displayed/read items in `SeenItem`.
5. Use `UserPreference` for later personalization.
