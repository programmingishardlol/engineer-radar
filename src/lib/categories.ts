import { UPDATE_CATEGORIES, type UpdateCategory } from "./types";

export const categoryDescriptions: Record<UpdateCategory, string> = {
  "AI Model Updates": "Model releases, pricing, context windows, multimodal changes, and benchmark shifts.",
  "AI Coding Tool Updates": "Codex, Cursor, Claude Code, Copilot, IDE agents, MCP tools, and agent workflows.",
  "Hardware and Computing": "GPUs, CPUs, accelerators, memory, networking, and compute infrastructure.",
  "Semiconductor and Manufacturing": "Foundries, process nodes, packaging, HBM, chiplets, fabs, and export controls.",
  "Fast-Growing Startups": "Technical startups with useful signals for builders, students, and founders.",
  "Big Tech Company Updates": "Major product, org, platform, infrastructure, and hiring moves from large tech companies.",
  "Engineering Career and Skill Signals": "Skills, job market signals, frameworks, and learning paths worth watching.",
  "Open Source and Developer Infrastructure": "Repos, databases, observability, security, build, testing, and local AI tools."
};

export function getOrderedCategories(): UpdateCategory[] {
  return [...UPDATE_CATEGORIES];
}
