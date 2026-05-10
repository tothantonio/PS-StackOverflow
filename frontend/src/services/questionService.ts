import type {CreateQuestionRequest, QuestionDto} from "../features/qa/types/questionTypes.ts";
import questionsData from "../features/qa/mockData/questions.json";

// Folosim 'let' în loc de 'const' pentru a putea modifica array-ul
let questions: QuestionDto[] = questionsData as unknown as QuestionDto[];

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
    const text = search.toLowerCase();

    return getQuestions().filter((question) =>
        question.title.toLowerCase().includes(text) ||
        question.body.toLowerCase().includes(text) ||
        question.author.username.toLowerCase().includes(text) ||
        question.tags.some((tag) => tag.toLowerCase().includes(text))
    );
}

export function getMyQuestions(userId: number): QuestionDto[] {
    return getQuestions().filter((question) => question.author.id === userId);
}

export function createQuestion(data: CreateQuestionRequest): QuestionDto {
    const newQuestion: QuestionDto = {
        id: Date.now(),
        title: data.title,
        body: data.body,
        tags: data.tags ?? [],
        createdAt: new Date().toISOString(),
        status: "RECEIVED",
        voteCount: 0,
        author: { // Mock author
            id: 1,
            username: "alex"
        },
    };

    questions = [newQuestion, ...questions];

    return newQuestion;
}

export function deleteQuestion(id: number): void {
    questions = questions.filter((question) => question.id !== id);
}

export function updateQuestion(
    id: number,
    data: CreateQuestionRequest
): QuestionDto | undefined {
    let updatedQuestion: QuestionDto | undefined;
    questions = questions.map((question) => {
        if (question.id === id) {
            const nextQuestion: QuestionDto = {
                ...question,
                title: data.title,
                body: data.body,
                tags: data.tags ?? question.tags,
            };
            updatedQuestion = nextQuestion;
            return nextQuestion;
        }
        return question;
    });
    return updatedQuestion;
}
