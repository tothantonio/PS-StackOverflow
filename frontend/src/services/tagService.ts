import type { TagDto } from "../features/qa/types/tagTypes.ts";

let tags: TagDto[] = [
    { id: 1, name: "react" },
    { id: 2, name: "frontend" },
    { id: 3, name: "java" },
];

export function getTags(): TagDto[] {
    return tags;
}

export function createTag(name: string): TagDto {
    const newTag: TagDto = {
        id: Date.now(),
        name,
    };

    tags = [...tags, newTag];
    return newTag;
}
