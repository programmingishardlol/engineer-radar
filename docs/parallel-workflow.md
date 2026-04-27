# Parallel Workflow

This project supports parallel subagent development through Git branches and worktrees. Each subagent works only in its ownership area from `AGENTS.md`.

## Create Worktrees

From the repository root:

```bash
mkdir -p ../engineering-radar-agents
git worktree add ../engineering-radar-agents/architect -b agent/architect
git worktree add ../engineering-radar-agents/backend-db -b agent/backend-db
git worktree add ../engineering-radar-agents/collector-pipeline -b agent/collector-pipeline
git worktree add ../engineering-radar-agents/ranking-dedupe -b agent/ranking-dedupe
git worktree add ../engineering-radar-agents/frontend -b agent/frontend
git worktree add ../engineering-radar-agents/testing -b agent/testing
```

Optional product-manager and integration worktrees:

```bash
git worktree add ../engineering-radar-agents/product-manager -b agent/product-manager
git worktree add ../engineering-radar-agents/integration -b agent/integration
```

## Suggested Agent Prompts

In each worktree, tell the subagent to read:

- `AGENTS.md`
- `memory.md`
- its file in `agents/`
- relevant docs under `docs/`

Then ask it to work only inside owned files.

## Check Ownership

Use:

```bash
python3 tools/run_subagents.py check agent/architect main
```

Replace `agent/architect` with the branch to inspect.

## Recommended Merge Order

1. `agent/architect`
2. `agent/product-manager`
3. `agent/collector-pipeline`
4. `agent/ranking-dedupe`
5. `agent/backend-db`
6. `agent/frontend`
7. `agent/testing`
8. `agent/integration`

## Merge Commands

```bash
git checkout main
git merge --no-ff agent/architect
npm test

git merge --no-ff agent/product-manager
npm test
```

Continue in the recommended merge order. Run `npm test` after every major merge and `npm run build` before declaring integration done.

## Conflict Rules

- Keep shared contracts from the Architect branch unless a later integration request explicitly changes them.
- Do not resolve conflicts by expanding an agent ownership area.
- Record unresolved or cross-boundary issues in `docs/integration-requests.md`.
