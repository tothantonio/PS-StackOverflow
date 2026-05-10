import type {UserDto} from "./userTypes.ts";

export type AnswerDto = {
    id: number;
    author: UserDto;
    body: string;
    createdAt: string;
};

export type CreateAnswerRequest = {
    body: string;
};
