import type { AnswerDto, CreateAnswerRequest } from "../features/qa/types/answerTypes.ts";
import { getCurrentUser } from "./userService.ts";
import { apiClient } from "./apiClient.ts";
import {
    normalizeAnswer,
    normalizeAnswers,
    type ApiAnswer,
} from "../features/qa/mappers/answerMapper.ts";

export async function getAnswersByQuestionId(questionId: number): Promise<AnswerDto[]> {
    try {
        const answers = await apiClient.answers.getByQuestion(questionId);
        return normalizeAnswers(answers as ApiAnswer[], questionId).sort(
            (first, second) => second.voteCount - first.voteCount
        );
    } catch (error) {
        console.error("Failed to fetch answers:", error);
        return [];
    }
}

export async function createAnswer(data: CreateAnswerRequest): Promise<AnswerDto> {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error("User not logged in");
        }

        const newAnswer = await apiClient.answers.create(
            {
                questionId: data.questionId,
                body: data.body.trim(),
                imageUrl: data.picture ?? undefined,
            },
            currentUser.id
        );

        return normalizeAnswer(newAnswer as ApiAnswer, data.questionId);
    } catch (error) {
        console.error("Failed to create answer:", error);
        throw error;
    }
}

export async function deleteAnswer(id: number): Promise<void> {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error("User not logged in");
        }

        await apiClient.answers.delete(id, currentUser.id);
    } catch (error) {
        console.error("Failed to delete answer:", error);
        throw error;
    }
}

export async function updateAnswer(
    id: number,
    data: { body: string; picture?: string | null }
): Promise<AnswerDto | undefined> {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error("User not logged in");
        }

        const updated = await apiClient.answers.update(
            id,
            {
                body: data.body.trim(),
                imageUrl: data.picture ?? undefined,
            },
            currentUser.id
        );
        return normalizeAnswer(updated as ApiAnswer);
    } catch (error) {
        console.error("Failed to update answer:", error);
        throw error;
    }
}

export async function acceptAnswer(id: number, questionId: number): Promise<AnswerDto | undefined> {
    // This functionality will be implemented with the voting feature
    // For now, just return the answer
    try {
        const answers = await getAnswersByQuestionId(questionId);
        return answers.find(a => a.id === id);
    } catch (error) {
        console.error("Failed to accept answer:", error);
        return undefined;
    }
}

export async function voteAnswer(id: number, userId: number, direction: 1 | -1): Promise<AnswerDto | undefined> {
    // This functionality will be implemented with the voting feature
    try {
        return undefined;
    } catch (error) {
        console.error("Failed to vote on answer:", error);
        return undefined;
    }
}

// // sterge toate answerurile pentru o intrebare
// export function deleteAnswersForQuestion(questionId: number): void {
//
//     answers = answers.filter(
//         (answer) => answer.questionId !== questionId
//     );
// }

