import answersData from "../features/qa/mockData/answers.json";
import type {AnswerDto, CreateAnswerRequest} from "../features/qa/types/answerTypes.ts";

let answers: AnswerDto[] = answersData as AnswerDto[];

export function getAnswersByQuestionId(questionId: number): AnswerDto[] {
    return answers
        .filter((answer) => answer.questionId === questionId)// ia toate answerurile pentru o intrebare
        .sort((first, second) => {
            if (first.accepted !== second.accepted) {//accepted answer apare primu
                if (first.accepted) {
                    return -1;//first e inainte
                } else {
                    return 1;//first e dupa
                }
            }

            return second.voteCount - first.voteCount; //daca s egale fac sortare descrescatoare dupa voturi
        });
}

//creez answer nou
export function createAnswer(data: CreateAnswerRequest): AnswerDto {
    const newAnswer: AnswerDto = {
        id: Math.max(0, ...answers.map((answer) => answer.id)) + 1,//// ia cel mai mare id si adauga +1
        // ... scoate valorile din array
        questionId: data.questionId,
        body: data.body.trim(),
        picture: data.picture ?? "",  // daca picture nu exista pune string gol
        createdAt: new Date().toISOString(),
        voteCount: 0,
        accepted: false,
        author: { // user temporar
            id: 1,
            username: "you",
        },
    };

    answers = [newAnswer, ...answers];  // adaug answerul nou la inceput

    return newAnswer;
}
export function deleteAnswer(id: number): void {
    answers = answers.filter((answer) => answer.id !== id);
}

export function updateAnswer(id: number, body: string, picture?: string): AnswerDto | undefined {
    let updatedAnswer: AnswerDto | undefined;
    answers = answers.map((answer) => {
        if (answer.id === id) {// gasesc answerul care trebuie modificat
            updatedAnswer = {
                ...answer, // copiez toate valorile vechi
                body: body.trim(),  // pun body nou
                picture: picture ?? answer.picture,// daca exista poza noua o folosesc altfel pastrez poza veche
            };
            return updatedAnswer;
        }

        return answer;  // restul answerurilor raman la fel
    });

    return updatedAnswer;
}

// sterge toate answerurile pentru o intrebare
export function deleteAnswersForQuestion(questionId: number): void {

    answers = answers.filter(
        (answer) => answer.questionId !== questionId
    );
}