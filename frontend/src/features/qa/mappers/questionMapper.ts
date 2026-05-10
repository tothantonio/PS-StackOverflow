import type {QuestionDto} from "../types/questionTypes.ts";

export function mapQuestion(dto: QuestionDto){
    return {
        id: dto.id,
        title: dto.title,
        body: dto.body,
        createdAt: dto.createdAt,
        status: dto.status,
        author: dto.author.username,
        tags: dto.tags,

    };
}