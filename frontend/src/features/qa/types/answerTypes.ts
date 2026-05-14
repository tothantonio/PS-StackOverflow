import type {UserDto} from "./userTypes.ts";

export type AnswerDto = {
    id: number;
    questionId: number;
    author: UserDto;
    body: string;
    picture?: string;
    createdAt: string;
    voteCount: number;
    accepted: boolean;
};

export type CreateAnswerRequest = {
    questionId: number;
    body: string;
    picture?: string;
};
