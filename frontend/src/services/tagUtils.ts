export function parseTags(value: string): string[] {
    return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
}

export function formatTags(tags: string[]): string {
    return tags.join(", ");
}

