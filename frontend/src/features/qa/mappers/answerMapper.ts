import type {AnswerDto} from "../types/answerTypes.ts";

export function mspAnswer(dto : AnswerDto){
    return{
        id : dto.id,
        authorName: dto.author.username,
        body : dto.body,
        createdAt : dto.createdAt,
    }
}