# Integration Requests

Use this file when a subagent needs a change outside its ownership area.

## Template

```md
### Request: Short title

- Requester:
- Requested owner:
- Affected files:
- Urgency:
- Reason:
- Proposed change:
- Status: open
```

## Open Requests

### Request: Research mock item is categorized as AI model update

- Requester: Testing Agent
- Requested owner: Collector Pipeline Agent
- Affected files: `src/pipeline/normalize.ts`
- Urgency: medium
- Reason: `npm test` now includes coverage for expected mock fixture categories. The mock item titled `Mock/demo: Research paper studies small-model tool-use reliability` is currently normalized as `ai_models` because the `model` keyword rule is checked before the `research`, `paper`, and `arxiv` rule. This makes the mock vertical slice lose its research category coverage.
- Proposed change: Adjust normalization category detection so explicit research/source signals such as `research`, `paper`, or `arxiv` take precedence over generic AI model keywords when classifying research-paper items.
- Status: open

## Resolved Requests

### Request: Add explicit feed error envelope handling

- Requester: Architect Agent
- Requested owner: Server owner
- Affected files: `src/app/api/feed/route.ts`, `src/server/feedService.ts`
- Urgency: medium
- Reason: `docs/api-contract.md` now defines a stable non-2xx JSON error envelope, but the current route only returns the happy-path feed response and relies on framework defaults on failures.
- Proposed change: Catch feed construction failures and return `{ error: { code, message } }` with an explicit non-2xx status.
- Status: resolved
- Resolution: Added route-level `try/catch` in `src/app/api/feed/route.ts` returning the documented `internal_error` envelope with HTTP 500 and `Cache-Control: no-store`.
- Files changed: `src/app/api/feed/route.ts`, `tests/feed-route.test.ts`

### Request: Add API contract coverage for GET /api/feed

- Requester: Architect Agent
- Requested owner: Testing owner
- Affected files: `tests/`
- Urgency: medium
- Reason: Current tests validate pipeline and ranking internals, but there is no direct test that the public feed endpoint matches `FeedResponse`.
- Proposed change: Add endpoint-level tests for query parsing, category filtering, and response shape compatibility with `src/types/`.
- Status: resolved
- Resolution: Added route-level tests that verify `FeedResponse` JSON, query parsing for `category`, `minScore`, and `limit`, no-store caching, and the documented error envelope.
- Files changed: `tests/feed-route.test.ts`
