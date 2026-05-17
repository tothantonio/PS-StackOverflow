import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard.tsx";

import { getMyQuestions } from "../../../services/questionService.ts";
import { getAnswersByQuestionId } from "../../../services/answerService.ts";
import { getCurrentUser } from "../../../services/userService.ts";

import type { QuestionDto } from "../types/questionTypes.ts";

function MyQuestionsPage() {
    const currentUser = getCurrentUser();

    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<number, any[]>>({});

    useEffect(() => {
    async function load() {
        if (!currentUser) return;

        const qs = await getMyQuestions(currentUser.id);
        setQuestions(qs);

        const answersEntries = await Promise.all(
            qs.map(async (q) => {
                const answers = await getAnswersByQuestionId(q.id);
                return [q.id, answers] as const;
            })
        );

        setAnswersMap(Object.fromEntries(answersEntries));
    }

    load();
}, [currentUser]);

    return (
        <main className="page-grid">
            <section>
                <div className="page-title-row">
                    <div>
                        <h1>My Questions</h1>
                        <p>{questions.length} questions posted by you</p>
                    </div>
                </div>

                <div className="questions-feed">
                    {questions.length === 0 ? (
                        <p className="empty-state">
                            You have not posted questions yet.
                        </p>
                    ) : (
                        questions.map((q) => {
                            const answers = answersMap[q.id] || [];

                            return (
                                <QuestionCard
                                    key={q.id}
                                    id={q.id}
                                    title={q.title}
                                    body={q.body}
                                    author={q.author}
                                    tags={q.tags ?? []}
                                    createdAt={q.createdAt}
                                    status={q.status}
                                    answerCount={answers.length}
                                    hasAcceptedAnswer={answers.some(
                                        (a) => a.accepted
                                    )}
                                    voteCount={q.voteCount}
                                    picture={q.picture}
                                    canEdit
                                />
                            );
                        })
                    )}
                </div>
            </section>
        </main>
    );
}

export default MyQuestionsPage;