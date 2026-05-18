import type { TagDto } from "../features/qa/types/tagTypes.ts";
import { apiClient } from "./apiClient.ts";

function normalizeTagName(name: string): string {
    return name.trim().toLowerCase();
}

export async function getTags(): Promise<TagDto[]> {
    try {
        const tags = await apiClient.tags.getAll();
        return [...tags].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return [];
    }
}

export async function createTag(name: string): Promise<TagDto | undefined> {
    const normalizedName = normalizeTagName(name);

    if (!normalizedName) {
        return undefined;
    }

    try {
        const existingTags = await getTags();
        const existing = existingTags.find((tag) => tag.name === normalizedName);
        if (existing) {
            return existing;
        }

        return await apiClient.tags.create(normalizedName);
    } catch (error) {
        console.error("Failed to create tag:", error);
        return undefined;
    }
}
