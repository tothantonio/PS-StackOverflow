import { useMemo } from "react";
import { getQuestionById } from "../../../services/questionService.ts";

export function useQuestionDetails(id: string | undefined) {
    const questionId = Number(id);

    return useMemo(() => {
        if (Number.isNaN(questionId)) {
            return undefined;
        }

        return getQuestionById(questionId);
    }, [questionId]);
}
