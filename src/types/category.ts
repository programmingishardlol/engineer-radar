export const categories = [
  "ai_models",
  "developer_tools",
  "hardware",
  "startups",
  "open_source",
  "security",
  "cloud_infrastructure",
  "research",
  "company_moves",
  "career_skills"
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  ai_models: "AI Models",
  developer_tools: "Developer Tools",
  hardware: "Hardware",
  startups: "Startups",
  open_source: "Open Source",
  security: "Security",
  cloud_infrastructure: "Cloud Infrastructure",
  research: "Research",
  company_moves: "Company Moves",
  career_skills: "Career Skills"
};
