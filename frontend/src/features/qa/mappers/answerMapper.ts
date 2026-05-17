import type { AnswerDto } from "../types/answerTypes.ts";

export type ApiAnswer = AnswerDto & {
    imageUrl?: string | null;
    question?: { id: number };
};

export function normalizeAnswer(raw: ApiAnswer, questionId?: number): AnswerDto {
    return {
        id: raw.id,
        questionId: raw.questionId ?? questionId ?? raw.question?.id ?? 0,
        body: raw.body,
        createdAt: raw.createdAt,
        author: raw.author,
        voteCount: raw.voteCount ?? 0,
        accepted: raw.accepted ?? false,
        picture: raw.picture ?? raw.imageUrl ?? null,
    };
}

export function normalizeAnswers(rawList: ApiAnswer[], questionId?: number): AnswerDto[] {
    return rawList.map((raw) => normalizeAnswer(raw, questionId));
}

export function mapAnswer(dto: AnswerDto) {
    return {
        id: dto.id,
        questionId: dto.questionId,
        authorName: dto.author.username,
        body: dto.body,
        createdAt: dto.createdAt,
        voteCount: dto.voteCount,
        accepted: dto.accepted,
    };
}

export const mspAnswer = mapAnswer;

