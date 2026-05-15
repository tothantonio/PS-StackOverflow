import type { TagDto } from "../features/qa/types/tagTypes.ts";

const initialTags: TagDto[] = [
    { id: 1, name: "react" },
    { id: 2, name: "frontend" },
    { id: 3, name: "typescript" },
];

function saveTags(nextTags: TagDto[]) {
    tags = nextTags;
}

let tags: TagDto[] = initialTags;

function normalizeTagName(name: string): string {
    return name.trim().toLowerCase();
}

export function getTags(): TagDto[] {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
}

export function createTag(name: string): TagDto | undefined {
    const normalizedName = normalizeTagName(name);

    if (!normalizedName) {
        return undefined;
    }

    const existingTag = tags.find((tag) => tag.name === normalizedName);

    if (existingTag) {
        return existingTag;
    }

    const newTag: TagDto = {
        id: Date.now(),
        name: normalizedName,
    };

    saveTags([...tags, newTag]);

    return newTag;
}

export function getTagNames(): string[] {
    return getTags().map((tag) => tag.name);
}

