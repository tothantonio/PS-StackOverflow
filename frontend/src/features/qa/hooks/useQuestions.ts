import { useState } from "react";
import type { QuestionDto } from "../types/questionTypes.ts";
import { createQuestion, getQuestions } from "../../../services/questionService.ts";
import { parseTags } from "../utils/tags.ts";

export function useQuestions() {
    const [questions, setQuestions] = useState<QuestionDto[]>(() => getQuestions());

    function addQuestion(title: string, body: string, tags: string) {
        if (!title.trim() || !body.trim()) {
            return undefined;
        }

        const newQuestion = createQuestion({
            title: title.trim(),
            body: body.trim(),
            tags: parseTags(tags),
        });

        setQuestions(getQuestions());

        return newQuestion;
    }

    return {
        questions,
        addQuestion,
    };
}
