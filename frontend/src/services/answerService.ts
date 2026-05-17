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
    questionId: number,
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
            currentUser.id,
            questionId
        );
        return normalizeAnswer(updated as ApiAnswer, questionId);
    } catch (error) {
        console.error("Failed to update answer:", error);
        throw error;
    }
}

export async function acceptAnswer(id: number, questionId: number): Promise<AnswerDto | undefined> {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error("User not logged in");
        }

        const accepted = await apiClient.answers.accept(id, currentUser.id, questionId);
        return normalizeAnswer(accepted as ApiAnswer, questionId);
    } catch (error) {
        console.error("Failed to accept answer:", error);
        throw error;
    }
}

export async function voteAnswer(
    id: number,
    userId: number,
    direction: 1 | -1
): Promise<number | undefined> {
    try {
        const result = await apiClient.votes.voteAnswer(id, userId, direction);
        return result.voteCount;
    } catch (error) {
        console.error("Failed to vote on answer:", error);
        throw error;
    }
}
