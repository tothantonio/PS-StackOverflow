import type { AnswerDto, CreateAnswerRequest } from "../features/qa/types/answerTypes.ts";
import answersData from "../features/qa/mockData/answers.json";

let answers: AnswerDto[] = answersData as unknown as AnswerDto[];

export function getAnswers(): AnswerDto[] {
    return answers.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getAnswersByQuestionId(_questionId: number): AnswerDto[] {
    return getAnswers();
}

export function createAnswer(data: CreateAnswerRequest): AnswerDto {
    const newAnswer: AnswerDto = {
        id: Date.now(),
        body: data.body,
        createdAt: new Date().toISOString(),
        author: {
            id: 1,
            username: "alex",
        },
    };

    answers = [newAnswer, ...answers];
    return newAnswer;
}
