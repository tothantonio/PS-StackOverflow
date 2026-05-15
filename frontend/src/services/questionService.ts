import type { CreateQuestionRequest, QuestionDto } from "../features/qa/types/questionTypes.ts";
import questionsData from "../features/qa/data/questions.json";
import { getCurrentUser } from "./userService.ts";

const STORAGE_KEY = "stackoverflow.questions";

function readStoredQuestions(): QuestionDto[] {
    if (typeof localStorage === "undefined") {
        return questionsData as QuestionDto[];
    }

    const storedQuestions = localStorage.getItem(STORAGE_KEY);

    if (!storedQuestions) {
        return questionsData as QuestionDto[];
    }

    try {
        return JSON.parse(storedQuestions) as QuestionDto[];
    } catch {
        return questionsData as QuestionDto[];
    }
}

function saveQuestions(nextQuestions: QuestionDto[]) {
    questions = nextQuestions;

    if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextQuestions));
    }
}

let questions: QuestionDto[] = readStoredQuestions();

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

        const previousVote = Number(localStorage.getItem(voteKey) ?? 0);
        const voteDelta = direction - previousVote;
        localStorage.setItem(voteKey, String(direction));

        updatedQuestion = {
            ...question,
            voteCount: question.voteCount + voteDelta,
        };

        return updatedQuestion;
    });

    saveQuestions(nextQuestions);

    return updatedQuestion;
}

