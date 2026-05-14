import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AnswerDto } from "../types/answerTypes.ts";
import AnswersForm from "../components/AnswersForm.tsx";
import AnswersList from "../components/AnswersList.tsx";
import Markdown from "../components/Markdown.tsx";
import VoteColumn from "../components/VoteColumn.tsx";
import { createAnswer, deleteAnswersForQuestion, getAnswersByQuestionId } from "../../../services/answerService.ts";
import { deleteQuestion, getQuestionById } from "../../../services/questionService.ts";

function QuestionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const questionId = Number(id);
    const question = Number.isNaN(questionId) ? undefined : getQuestionById(questionId);
    const [answers, setAnswers] = useState<AnswerDto[]>(() =>
        Number.isNaN(questionId) ? [] : getAnswersByQuestionId(questionId)
    );

    if (!question) {
        return (
            <main className="details-page">
                <Link to="/questions" className="back-link">
                    Back to questions
                </Link>
                <header className="details-header">
                    <h1>Question not found</h1>
                </header>
            </main>
        );
    }

    const currentQuestion = question;

    function handleDeleteQuestion() {
        deleteAnswersForQuestion(currentQuestion.id);
        deleteQuestion(currentQuestion.id);
        navigate("/questions");
    }

    return (
        <main className="details-page">
            <Link to="/questions" className="back-link">
                Back to questions
            </Link>

            <header className="details-header">
                <h1>{currentQuestion.title}</h1>
                <div>
                    <span>Asked {new Date(currentQuestion.createdAt).toLocaleString()}</span>
                    <span>Status: {currentQuestion.status}</span>
                    <span>Author: {currentQuestion.author.username}</span>
                </div>
            </header>

            <article className="question-detail-card">
                <VoteColumn votes={currentQuestion.voteCount} />

                <div className="detail-content">
                    <Markdown source={currentQuestion.body} />

                    <div className="tags-list detail-tags">
                        {currentQuestion.tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="detail-actions">
                        <div className="question-actions">
                            <Link to={`/questions/${currentQuestion.id}/edit`} className="back-link">
                                Edit question
                            </Link>
                            <button className="danger-button" onClick={handleDeleteQuestion}>
                                Delete
                            </button>
                        </div>
                        <div className="author-badge">
                            <span>Author</span>
                            <strong>{currentQuestion.author.username}</strong>
                        </div>
                    </div>
                </div>
            </article>

            <AnswersList answers={answers} />

            <AnswersForm
                questionId={currentQuestion.id}
                onSubmit={(data) => {
                    createAnswer(data);
                    setAnswers(getAnswersByQuestionId(currentQuestion.id));
                }}
            />
        </main>
    );
}

export default QuestionDetailsPage;
