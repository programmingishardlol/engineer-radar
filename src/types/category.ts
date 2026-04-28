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
  ai_models: "AI Model Updates",
  developer_tools: "AI Coding Tool Updates",
  hardware: "Hardware and Computing",
  startups: "Fast-Growing Startups",
  open_source: "Open Source and Developer Infrastructure",
  security: "Security",
  cloud_infrastructure: "Cloud Infrastructure",
  research: "Research",
  company_moves: "Big Tech Company Updates",
  career_skills: "Engineering Career and Skill Signals"
};
