import type {UserDto} from "./userTypes.ts";

export type QuestionDto = {
    id: number;
    title: string;
    body: string;
    author: UserDto;
    tags: string[];
    createdAt: string;
    voteCount : number;
    status:string;
};

export type CreateQuestionRequest = {
    title: string;
    body: string;
    tags?: string[];
};

export type UpdateQuestionRequest = {
    title?: string;
    body?: string;
    tags?: string[];
};

export type VoteDirection = 'UP' | 'DOWN';

export type VoteRequest = {
    direction: VoteDirection;
};