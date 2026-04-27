import type { Category } from "../types";

export type UserPreferenceRecord = {
  preferredCategories: Category[];
  mutedCategories: Category[];
  minScore: number;
};

export async function getDefaultPreferences(): Promise<UserPreferenceRecord> {
  return {
    preferredCategories: [],
    mutedCategories: [],
    minScore: 0
  };
}
