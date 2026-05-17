import type { QuestionDto } from "../types/questionTypes.ts";
import type { UserDto } from "../types/userTypes.ts";

type ApiQuestionTag = {
    tag?: { id?: number; name: string };
};

export type ApiQuestion = {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    status: string;
    imageUrl?: string | null;
    picture?: string | null;
    author: UserDto;
    questionTags?: ApiQuestionTag[];
    tags?: string[];
    voteCount?: number;
    answerCount?: number;
};

export function normalizeQuestion(raw: ApiQuestion): QuestionDto {
    const tagsFromJoin =
        raw.questionTags
            ?.map((qt) => qt.tag?.name)
            .filter((name): name is string => Boolean(name)) ?? [];

    return {
        id: raw.id,
        title: raw.title,
        body: raw.body,
        createdAt: raw.createdAt,
        status: raw.status,
        author: {
            id: raw.author.id,
            username: raw.author.username,
        },
        tags: raw.tags?.length ? raw.tags : tagsFromJoin,
        voteCount: raw.voteCount ?? 0,
        picture: raw.picture ?? raw.imageUrl ?? null,
    };
}

export function normalizeQuestions(rawList: ApiQuestion[]): QuestionDto[] {
    return rawList.map(normalizeQuestion);
}

export function mapQuestion(dto: QuestionDto) {
    return {
        id: dto.id,
        title: dto.title,
        body: dto.body,
        createdAt: dto.createdAt,
        status: dto.status,
        author: dto.author.username,
        tags: dto.tags,
    };
}
