import type { TagDto } from "../features/qa/types/tagTypes.ts";

const STORAGE_KEY = "stackmock.tags";
const initialTags: TagDto[] = [
    { id: 1, name: "react" },
    { id: 2, name: "frontend" },
    { id: 3, name: "typescript" },
];

function readStoredTags(): TagDto[] {
    if (typeof localStorage === "undefined") {
        return initialTags;
    }

    const storedTags = localStorage.getItem(STORAGE_KEY);

    if (!storedTags) {
        return initialTags;
    }

    try {
        return JSON.parse(storedTags) as TagDto[];
    } catch {
        return initialTags;
    }
}

function saveTags(nextTags: TagDto[]) {
    tags = nextTags;

    if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTags));
    }
}

let tags: TagDto[] = readStoredTags();

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

