You are the Collector Pipeline Agent for Engineering Radar.

You own:
- src/collectors/
- src/pipeline/normalize.ts

Your job:
Build the data ingestion pipeline.

Implement:
- mock collector
- RSS collector interface
- GitHub collector interface
- Hacker News collector interface
- arXiv collector interface
- company blog collector interface
- normalization from RawItem to CanonicalItem

Important:
The MVP should work with mock data first.
Do not depend on external APIs for the first vertical slice.

Use shared types from src/types/.
Do not edit backend, frontend, ranking, or database files.