import type { CreateQuestionRequest, QuestionDto } from "../features/qa/types/questionTypes.ts";
import { getCurrentUser } from "./userService.ts";
import { apiClient } from "./apiClient.ts";
import {
    normalizeQuestion,
    normalizeQuestions,
    type ApiQuestion,
} from "../features/qa/mappers/questionMapper.ts";

export async function getQuestions(): Promise<QuestionDto[]> {
    try {
        const questions = await apiClient.questions.getAll();
        return normalizeQuestions(questions as ApiQuestion[]);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getQuestionById(id: number): Promise<QuestionDto | undefined> {
    try {
        const question = await apiClient.questions.getById(id);
        return normalizeQuestion(question as ApiQuestion);
    } catch (error) {
        console.error("Failed to fetch question:", error);
        return undefined;
    }
}

export async function searchQuestions(search: string): Promise<QuestionDto[]> {
    try {
        if (!search.trim()) {
            return getQuestions();
        }
        const results = await apiClient.questions.search(search);
        return normalizeQuestions(results as ApiQuestion[]);
    } catch (error) {
        console.error("Failed to search questions:", error);
        return [];
    }
}

export async function getMyQuestions(userId: number): Promise<QuestionDto[]> {
    try {
        const results = await apiClient.questions.getByAuthor(userId);
        return normalizeQuestions(results as ApiQuestion[]);
    } catch (error) {
        console.error("Failed to fetch my questions:", error);
        return [];
    }
}

export async function getQuestionsByTag(tagName: string): Promise<QuestionDto[]> {
    try {
        const results = await apiClient.questions.filterByTag(tagName);
        return normalizeQuestions(results as ApiQuestion[]);
    } catch (error) {
        console.error("Failed to filter by tag:", error);
        return [];
    }
}

export async function getQuestionsByTags(tagNames: string[]): Promise<QuestionDto[]> {
    try {
        if (!tagNames.length) {
            return getQuestions();
        }
        const results = await apiClient.questions.filterByTags(tagNames);
        return normalizeQuestions(results as ApiQuestion[]);
    } catch (error) {
        console.error("Failed to filter by tags:", error);
        return [];
    }
}

export async function createQuestion(data: CreateQuestionRequest): Promise<QuestionDto> {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error("User not logged in");
    }

    const newQuestion = await apiClient.questions.create(
        {
            title: data.title,
            body: data.body,
            imageUrl: data.picture ?? undefined,
            tags: data.tags,
        },
        currentUser.id
    );

    return normalizeQuestion(newQuestion as ApiQuestion);
}

export async function deleteQuestion(id: number): Promise<void> {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error("User not logged in");
    }

    await apiClient.questions.delete(id, currentUser.id);
}

export async function updateQuestion(
    id: number,
    data: CreateQuestionRequest
): Promise<QuestionDto | undefined> {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error("User not logged in");
    }

    const updatedQuestion = await apiClient.questions.update(
        id,
        {
            title: data.title,
            body: data.body,
            imageUrl: data.picture ?? undefined,
            tags: data.tags,
        },
        currentUser.id
    );

    return normalizeQuestion(updatedQuestion as ApiQuestion);
}

export async function voteQuestion(
    id: number,
    userId: number,
    direction: 1 | -1
) {
    try {
        return await apiClient.votes.voteQuestion(id, userId, direction);
    } catch (error) {
        console.error("Failed to vote on question:", error);
        throw error;
    }
}

/** Client-side filter combining search, tags, author, and "my questions". */
export function filterQuestions(
    questions: QuestionDto[],
    options: {
        searchQuery?: string;
        tagNames?: string[];
        authorId?: number;
        mineOnly?: boolean;
        currentUserId?: number;
    }
): QuestionDto[] {
    let result = [...questions];

    const search = options.searchQuery?.trim().toLowerCase();
    if (search) {
        result = result.filter((question) =>
            question.title.toLowerCase().includes(search)
        );
    }

    if (options.tagNames && options.tagNames.length > 0) {
        result = result.filter((question) =>
            options.tagNames!.some((tag) => question.tags.includes(tag))
        );
    }

    if (options.authorId != null) {
        result = result.filter((question) => question.author.id === options.authorId);
    }

    if (options.mineOnly && options.currentUserId != null) {
        result = result.filter((question) => question.author.id === options.currentUserId);
    }

    return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
