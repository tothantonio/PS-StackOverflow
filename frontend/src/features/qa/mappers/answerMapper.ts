import type {AnswerDto} from "../types/answerTypes.ts";

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
