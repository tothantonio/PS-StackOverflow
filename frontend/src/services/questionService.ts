import type { CreateQuestionRequest, QuestionDto } from "../features/qa/types/questionTypes.ts";
import questionsData from "../features/qa/data/questions.json";
import { getCurrentUser } from "./userService.ts";

function saveQuestions(nextQuestions: QuestionDto[]) {
    questions = nextQuestions;
}

let questions: QuestionDto[] = questionsData as QuestionDto[];
const questionVotesByUser: Record<string, number> = {};

export function getQuestions(): QuestionDto[] {
    return [...questions].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getQuestionById(id: number): QuestionDto | undefined {
    return questions.find((question) => question.id === id);
}

export function searchQuestions(search: string): QuestionDto[] {
    const text = search.trim().toLowerCase();

    if (!text) {
        return getQuestions();
    }

    return getQuestions().filter((question) =>
        question.title.toLowerCase().includes(text)
    );
}

export function getMyQuestions(userId: number): QuestionDto[] {
    return getQuestions().filter((question) => question.author.id === userId);
}

export function createQuestion(data: CreateQuestionRequest): QuestionDto {
    const currentUser = getCurrentUser();
    const newQuestion: QuestionDto = {
        id: Date.now(),
        title: data.title,
        body: data.body,
        tags: data.tags ?? [],
        createdAt: new Date().toISOString(),
        status: "RECEIVED",
        voteCount: 0,
        picture: data.picture,
        author: currentUser,
    };

    saveQuestions([newQuestion, ...questions]);

    return newQuestion;
}

export function deleteQuestion(id: number): void {
    saveQuestions(questions.filter((question) => question.id !== id));
}

export function updateQuestion(
    id: number,
    data: CreateQuestionRequest
): QuestionDto | undefined {
    let updatedQuestion: QuestionDto | undefined;

    const nextQuestions = questions.map((question) => {
        if (question.id === id) {
            const nextQuestion: QuestionDto = {
                ...question,
                title: data.title,
                body: data.body,
                tags: data.tags ?? question.tags,
                picture: data.picture ?? question.picture,
            };
            updatedQuestion = nextQuestion;
            return nextQuestion;
        }

        return question;
    });

    saveQuestions(nextQuestions);

    return updatedQuestion;
}

export function setQuestionStatus(id: number, status: string): QuestionDto | undefined {
    let updatedQuestion: QuestionDto | undefined;

    const nextQuestions = questions.map((question) => {
        if (question.id === id) {
            updatedQuestion = {
                ...question,
                status,
            };
            return updatedQuestion;
        }

        return question;
    });

    saveQuestions(nextQuestions);

    return updatedQuestion;
}

export function voteQuestion(id: number, userId: number, direction: 1 | -1): QuestionDto | undefined {
    let updatedQuestion: QuestionDto | undefined;
    const voteKey = `stackoverflow.questionVote.${id}.${userId}`;

    const nextQuestions = questions.map((question) => {
        if (question.id !== id || question.author.id === userId) {
            return question;
        }

        const previousVote = questionVotesByUser[voteKey] ?? 0;
        const voteDelta = direction - previousVote;
        questionVotesByUser[voteKey] = direction;

        updatedQuestion = {
            ...question,
            voteCount: question.voteCount + voteDelta,
        };

        return updatedQuestion;
    });

    saveQuestions(nextQuestions);

    return updatedQuestion;
}

