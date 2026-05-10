import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { createAnswer, getAnswersByQuestionId } from "../../../services/answerService.ts";
import { getQuestionById } from "../../../services/questionService.ts";
import AnswersForm from "../components/AnswersForm.tsx";
import AnswersList from "../components/AnswersList.tsx";

function QuestionDetailsPage() {
    const { id } = useParams();
    const questionId = Number(id);
    const question = Number.isNaN(questionId) ? undefined : getQuestionById(questionId);
    const [answerBody, setAnswerBody] = useState("");
    const [answers, setAnswers] = useState(() =>
        question ? getAnswersByQuestionId(question.id) : []
    );

    if (!question) {
        return <Navigate to="/questions" replace />;
    }

    function handleSubmitAnswer() {
        if (!answerBody.trim()) return;

        createAnswer({ body: answerBody.trim() });
        setAnswers(getAnswersByQuestionId(question.id));
        setAnswerBody("");
    }

    return (
        <main className="page-shell">
            <article className="card">
                <h1 className="stack-title">{question.title}</h1>
                <p>{question.body}</p>
                <small className="muted">
                    Asked by {question.author.username} on{" "}
                    {new Date(question.createdAt).toLocaleDateString()}
                </small>
                <div>
                    {question.tags.map((tag) => (
                        <span className="tag-pill" key={tag}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </article>

            <AnswersList answers={answers} />
            <AnswersForm
                body={answerBody}
                onBodyChange={setAnswerBody}
                onSubmit={handleSubmitAnswer}
            />
        </main>
    );
}

export default QuestionDetailsPage;
