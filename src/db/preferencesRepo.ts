import { categories, type Category } from "../types";
import { prisma } from "./client";

export type UserPreferenceRecord = {
  id?: string;
  preferredCategories: Category[];
  mutedCategories: Category[];
  minScore: number;
};

function parseCategoriesJson(value: string): Category[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((item): item is Category => categories.includes(item as Category));
}

function stringifyCategories(categoriesToStore: Category[]): string {
  return JSON.stringify(categoriesToStore);
}

function defaultPreferences(): UserPreferenceRecord {
  return {
    preferredCategories: [],
    mutedCategories: [],
    minScore: 0
  };
}

export async function getDefaultPreferences(): Promise<UserPreferenceRecord> {
  const preference = await prisma.userPreference.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (!preference) {
    return defaultPreferences();
  }

  return {
    id: preference.id,
    preferredCategories: parseCategoriesJson(preference.preferredJson),
    mutedCategories: parseCategoriesJson(preference.mutedJson),
    minScore: preference.minScore
  };
}

export async function upsertDefaultPreferences(input: UserPreferenceRecord): Promise<UserPreferenceRecord> {
  const existing = await prisma.userPreference.findFirst({
    orderBy: { createdAt: "asc" }
  });
  const data = {
    preferredJson: stringifyCategories(input.preferredCategories),
    mutedJson: stringifyCategories(input.mutedCategories),
    minScore: input.minScore
  };
  const preference = existing
    ? await prisma.userPreference.update({
        where: { id: existing.id },
        data
      })
    : await prisma.userPreference.create({ data });

  return {
    id: preference.id,
    preferredCategories: parseCategoriesJson(preference.preferredJson),
    mutedCategories: parseCategoriesJson(preference.mutedJson),
    minScore: preference.minScore
  };
}
