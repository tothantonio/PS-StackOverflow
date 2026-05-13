import answersData from "../features/qa/mockData/answers.json";
import type {AnswerDto, CreateAnswerRequest} from "../features/qa/types/answerTypes.ts";

let answers: AnswerDto[] = answersData as AnswerDto[];

export function getAnswersByQuestionId(questionId: number): AnswerDto[] {
    return answers
        .filter((answer) => answer.questionId === questionId)
        .sort((first, second) => {
            if (first.accepted !== second.accepted) {
                return first.accepted ? -1 : 1;
            }

            return second.voteCount - first.voteCount;
        });
}

export function createAnswer(data: CreateAnswerRequest): AnswerDto {
    const newAnswer: AnswerDto = {
        id: Math.max(0, ...answers.map((answer) => answer.id)) + 1,
        questionId: data.questionId,
        body: data.body.trim(),
        createdAt: new Date().toISOString(),
        voteCount: 0,
        accepted: false,
        author: {
            id: 1,
            username: "you",
        },
    };

    answers = [newAnswer, ...answers];

    return newAnswer;
}
