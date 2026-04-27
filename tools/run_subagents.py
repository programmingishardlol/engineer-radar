#!/usr/bin/env python3
"""Print worktree commands and check branch ownership boundaries."""

from __future__ import annotations

import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Agent:
    name: str
    branch: str
    worktree: str
    owned_paths: tuple[str, ...]


AGENTS: tuple[Agent, ...] = (
    Agent("product-manager", "agent/product-manager", "../engineering-radar-agents/product-manager", ("docs/product-spec.md", "docs/mvp-scope.md", "docs/user-stories.md")),
    Agent("architect", "agent/architect", "../engineering-radar-agents/architect", ("docs/architecture.md", "docs/data-flow.md", "docs/api-contract.md", "src/types/")),
    Agent("backend-db", "agent/backend-db", "../engineering-radar-agents/backend-db", ("prisma/", "src/db/", "src/server/", "src/app/api/")),
    Agent("collector-pipeline", "agent/collector-pipeline", "../engineering-radar-agents/collector-pipeline", ("src/collectors/", "src/pipeline/normalize.ts", "src/mocks/rawItems.ts")),
    Agent("ranking-dedupe", "agent/ranking-dedupe", "../engineering-radar-agents/ranking-dedupe", ("src/ranking/", "src/pipeline/deduplicate.ts", "src/mocks/canonicalItems.ts", "src/mocks/rankedItems.ts")),
    Agent("frontend", "agent/frontend", "../engineering-radar-agents/frontend", ("src/app/", "src/components/")),
    Agent("testing", "agent/testing", "../engineering-radar-agents/testing", ("tests/", "vitest.config.ts")),
    Agent("integration", "agent/integration", "../engineering-radar-agents/integration", ("package.json", "package-lock.json", "README.md", "docs/integration-requests.md")),
)


def run(command: list[str]) -> str:
    return subprocess.check_output(command, text=True).strip()


def print_worktree_commands() -> None:
    print("mkdir -p ../engineering-radar-agents")
    for agent in AGENTS:
      print(f"git worktree add {agent.worktree} -b {agent.branch}")


def find_agent(branch: str) -> Agent:
    for agent in AGENTS:
        if agent.branch == branch or agent.name == branch:
            return agent
    raise SystemExit(f"Unknown agent or branch: {branch}")


def is_owned(path: str, owned_paths: tuple[str, ...]) -> bool:
    return any(path == owned or path.startswith(owned) for owned in owned_paths)


def check_ownership(branch: str, base: str = "main") -> int:
    agent = find_agent(branch)
    changed = run(["git", "diff", "--name-only", f"{base}...{agent.branch}"]).splitlines()
    violations = [path for path in changed if path and not is_owned(path, agent.owned_paths)]

    print(f"Agent: {agent.name}")
    print(f"Branch: {agent.branch}")
    print("Owned paths:")
    for path in agent.owned_paths:
        print(f"  - {path}")

    if not changed:
        print("No changed files.")
        return 0

    print("Changed files:")
    for path in changed:
        print(f"  - {path}")

    if violations:
        print("Ownership violations:")
        for path in violations:
            print(f"  - {path}")
        return 1

    print("No ownership violations found.")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) == 1 or argv[1] in {"commands", "worktrees"}:
        print_worktree_commands()
        return 0

    if argv[1] == "check":
        if len(argv) < 3:
            raise SystemExit("Usage: tools/run_subagents.py check <agent-or-branch> [base]")
        return check_ownership(argv[2], argv[3] if len(argv) > 3 else "main")

    raise SystemExit("Usage: tools/run_subagents.py [commands|check <agent-or-branch> [base]]")


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
