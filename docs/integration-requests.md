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

No open requests.

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
