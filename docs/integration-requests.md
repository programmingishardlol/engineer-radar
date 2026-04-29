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

No resolved requests yet.
