import { getMyQuestions } from "../../../services/questionService.ts";
import QuestionCard from "../components/QuestionCard.tsx";
import { getAnswersByQuestionId } from "../../../services/answerService.ts";
import { getCurrentUser } from "../../../services/userService.ts";

function MyQuestionsPage() {
    const currentUser = getCurrentUser();
    const questions = getMyQuestions(currentUser.id);

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
                        questions.map((q) => {
                            const answers = getAnswersByQuestionId(q.id);

                            return (
                                <QuestionCard
                                    key={q.id}
                                    id={q.id}
                                    title={q.title}
                                    body={q.body}
                                    author={q.author}
                                    tags={q.tags}
                                    createdAt={q.createdAt}
                                    status={q.status}
                                    answerCount={answers.length}
                                    hasAcceptedAnswer={answers.some((answer) => answer.accepted)}
                                    voteCount={q.voteCount}
                                    picture={q.picture}
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

