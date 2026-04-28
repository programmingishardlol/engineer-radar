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

### Request: Add explicit feed error envelope handling

- Requester: Architect Agent
- Requested owner: Server owner
- Affected files: `src/app/api/feed/route.ts`, `src/server/feedService.ts`
- Urgency: medium
- Reason: `docs/api-contract.md` now defines a stable non-2xx JSON error envelope, but the current route only returns the happy-path feed response and relies on framework defaults on failures.
- Proposed change: Catch feed construction failures and return `{ error: { code, message } }` with an explicit non-2xx status.
- Status: open

### Request: Add API contract coverage for GET /api/feed

- Requester: Architect Agent
- Requested owner: Testing owner
- Affected files: `tests/`
- Urgency: medium
- Reason: Current tests validate pipeline and ranking internals, but there is no direct test that the public feed endpoint matches `FeedResponse`.
- Proposed change: Add endpoint-level tests for query parsing, category filtering, and response shape compatibility with `src/types/`.
- Status: open

## Resolved Requests

No resolved requests yet.
