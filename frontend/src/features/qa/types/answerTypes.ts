import type {User} from "./userTypes.ts";

export type AnswerDto = {
    id: number;
    author: User;
    body: string;
    createdAt: string;
};