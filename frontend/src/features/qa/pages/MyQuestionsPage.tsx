import { useState } from "react";
import { getMyQuestions } from "../../../services/questionService.ts";
import type { QuestionDto } from "../types/questionTypes.ts";
import QuestionCard from "../components/QuestionCard.tsx";
import { getAnswersByQuestionId } from "../../../services/answerService.ts";

const MOCK_USER_ID = 1;

function MyQuestionsPage() {
    const [questions] = useState<QuestionDto[]>(() => getMyQuestions(MOCK_USER_ID));

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
                        <p className="empty-state">You have not posted questions yet.</p>
                    ) : (
                        questions.map((q) => (
                            <QuestionCard
                                key={q.id}
                                id={q.id}
                                title={q.title}
                                body={q.body}
                                author={q.author}
                                tags={q.tags}
                                createdAt={q.createdAt}
                                status={q.status}
                                answerCount={getAnswersByQuestionId(q.id).length}
                                voteCount={q.voteCount}
                                picture={q.picture}
                            />
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default MyQuestionsPage;

