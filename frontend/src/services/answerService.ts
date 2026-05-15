import answersData from "../features/qa/mockData/answers.json";
import type {AnswerDto, CreateAnswerRequest} from "../features/qa/types/answerTypes.ts";
import { getCurrentUser } from "./userService.ts";

const STORAGE_KEY = "stackmock.answers";

function readStoredAnswers(): AnswerDto[] {//cit answers din local storage
    const storedAnswers = localStorage.getItem(STORAGE_KEY); //local storage ul e ca un dictionar(cheie-valoare)

    if (!storedAnswers) {
        return answersData as AnswerDto[]; //daca nu avem nmc in local strg ia din json
    }

    try {
        return JSON.parse(storedAnswers) as AnswerDto[]; //tr din string in array real
    } catch {
        return answersData as AnswerDto[];//err->date din json
    }
}

function saveAnswers(nextAnswers: AnswerDto[]) {
    answers = nextAnswers;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers));
}

let answers: AnswerDto[] = readStoredAnswers();

export function getAnswersByQuestionId(questionId: number): AnswerDto[] {
    return answers
        .filter((answer) => answer.questionId === questionId)// ia toate answerurile pentru o intrebare
        .sort((first, second) => {
            return second.voteCount - first.voteCount; //daca s egale fac sortare descrescatoare dupa voturi
        });
}

//creez answer nou
export function createAnswer(data: CreateAnswerRequest): AnswerDto {
    const currentUser = getCurrentUser();
    const newAnswer: AnswerDto = {
        id: Math.max(0, ...answers.map((answer) => answer.id)) + 1,//// ia cel mai mare id si adauga +1
        // ... scoate valorile din array
        questionId: data.questionId,
        body: data.body.trim(),
        picture: data.picture,
        createdAt: new Date().toISOString(),
        voteCount: 0,
        accepted: false,
        author: currentUser,
    };

    saveAnswers([newAnswer, ...answers]);

    return newAnswer;
}

export function deleteAnswersForQuestion(questionId: number): void {
    saveAnswers(answers.filter((answer) => answer.questionId !== questionId));
}

export function deleteAnswer(id: number): void {
    saveAnswers(answers.filter((answer) => answer.id !== id));
}

export function updateAnswer(id: number, data: { body: string; picture?: string | null }): AnswerDto | undefined {
    let updatedAnswer: AnswerDto | undefined;
    const nextAnswers = answers.map((answer) => {
        if (answer.id === id) {// gasesc answerul care trebuie modificat
            const nextAnswer: AnswerDto = {
                ...answer, // copiez toate valorile vechi
                body: data.body.trim(),  // pun body nou
                picture: data.picture ?? answer.picture,
            };
            updatedAnswer = nextAnswer;
            return nextAnswer;
        }

        return answer;  // restul answerurilor raman la fel
    });

    saveAnswers(nextAnswers);

    return updatedAnswer;
}

//Pune accepted: true doar pe answerul ales si pune accepted: false pe celelalte answers de la aceeasi intr
export function acceptAnswer(id: number, questionId: number): AnswerDto | undefined {
    let acceptedAnswer: AnswerDto | undefined;

    const nextAnswers = answers.map((answer) => {
        if (answer.questionId !== questionId) {
            return answer;//nu schimb daca answeru nu apart intr curente
        }

        const nextAnswer = {
            ...answer, //copiez answeru vechi
            accepted: answer.id === id,//modific campu accepted daca e intr cu id vrut
        };

        if (nextAnswer.accepted) {
            acceptedAnswer = nextAnswer;//salvez answeru acceptat
        }

        return nextAnswer;//pune answeru modificat inv noul array
    });

    saveAnswers(nextAnswers);

    return acceptedAnswer;
}

export function voteAnswer(id: number, userId: number, direction: 1 | -1): AnswerDto | undefined {
    let updatedAnswer: AnswerDto | undefined;
    const voteKey = `stackmock.answerVote.${id}.${userId}`;//cheie unica pt vot

    const nextAnswers = answers.map((answer) => { //trece prin toate answers si creeaza o lista noua
        if (answer.id !== id || answer.author.id === userId) {//answeru crrt nu e cel modif sau useru incearca sa voteze propriul answer
            return answer;
        }

        const previousVote = Number(localStorage.getItem(voteKey) ?? 0);//votu anterior nu exista
        const voteDelta = direction - previousVote;//calc cu cat trb modif scoru
        localStorage.setItem(voteKey, String(direction));

        updatedAnswer = {
            ...answer,
            voteCount: answer.voteCount + voteDelta,
        };

        return updatedAnswer;
    });

    saveAnswers(nextAnswers);

    return updatedAnswer;
}
//
// // sterge toate answerurile pentru o intrebare
// export function deleteAnswersForQuestion(questionId: number): void {
//
//     answers = answers.filter(
//         (answer) => answer.questionId !== questionId
//     );
// }

