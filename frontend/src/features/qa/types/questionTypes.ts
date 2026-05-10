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

