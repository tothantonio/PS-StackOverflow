import answersData from "../features/qa/mockData/answers.json";
import type { AnswerDto, CreateAnswerRequest } from "../features/qa/types/answerTypes.ts";

const STORAGE_KEY = "stackmock.answers";

function readStoredAnswers(): AnswerDto[] {
    if (typeof localStorage === "undefined") {
        return answersData as AnswerDto[];
    }

    const storedAnswers = localStorage.getItem(STORAGE_KEY);

    if (!storedAnswers) {
        return answersData as AnswerDto[];
    }

    try {
        return JSON.parse(storedAnswers) as AnswerDto[];
    } catch {
        return answersData as AnswerDto[];
    }
}

function saveAnswers(nextAnswers: AnswerDto[]) {
    answers = nextAnswers;

    if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers));
    }
}

let answers: AnswerDto[] = readStoredAnswers();

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
            username: "alex",
        },
    };

    saveAnswers([newAnswer, ...answers]);

    return newAnswer;
}

export function deleteAnswersForQuestion(questionId: number): void {
    saveAnswers(answers.filter((answer) => answer.questionId !== questionId));
}
