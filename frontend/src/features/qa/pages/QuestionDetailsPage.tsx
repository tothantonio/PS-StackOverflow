import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AnswerDto } from "../types/answerTypes.ts";
import AnswersForm from "../components/AnswersForm.tsx";
import AnswersList from "../components/AnswersList.tsx";
import Markdown from "../components/Markdown.tsx";
import VoteColumn from "../components/VoteColumn.tsx";
import {
    acceptAnswer,
    createAnswer,
    deleteAnswer,
    deleteAnswersForQuestion,
    getAnswersByQuestionId,
    updateAnswer,
    voteAnswer,
} from "../../../services/answerService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { getCurrentUser } from "../../../services/userService.ts";
import { deleteQuestion, getQuestionById, setQuestionStatus, voteQuestion } from "../../../services/questionService.ts";

function QuestionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const questionId = Number(id);
    const question = Number.isNaN(questionId) ? undefined : getQuestionById(questionId);
    const [currentQuestion, setCurrentQuestion] = useState(question);
    const [answers, setAnswers] = useState<AnswerDto[]>(() =>
        Number.isNaN(questionId) ? [] : getAnswersByQuestionId(questionId)
    );
    const [message, setMessage] = useState("");
    const currentUser = getCurrentUser();

    if (!currentQuestion) {
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

    const activeQuestion = currentQuestion;

    function handleDeleteQuestion() {
        if (!isLoggedIn() || activeQuestion.author.id !== currentUser.id) {
            setMessage("Only the author can delete this question.");
            return;
        }
        deleteAnswersForQuestion(activeQuestion.id);
        deleteQuestion(activeQuestion.id);
        navigate("/questions");
    }

    function refreshAnswers() {
        setAnswers(getAnswersByQuestionId(activeQuestion.id));
    }

    function handleCreateAnswer(data: { questionId: number; body: string; picture?: string | null }) {
        if (!isLoggedIn()) {
            setMessage("You must be logged in to answer.");
            return;
        }

        if (activeQuestion.status === "SOLVED") {
            setMessage("This question is solved. No more answers can be added.");
            return;
        }

        createAnswer(data);
        const updatedQuestion = setQuestionStatus(activeQuestion.id, "IN_PROGRESS");
        if (updatedQuestion) setCurrentQuestion(updatedQuestion);
        refreshAnswers();
        setMessage("");
    }

    function handleQuestionVote(direction: 1 | -1) {
        if (!isLoggedIn()) {
            setMessage("You must be logged in to vote.");
            return;
        }

        const updatedQuestion = voteQuestion(activeQuestion.id, currentUser.id, direction);
        if (!updatedQuestion) {
            setMessage("You cannot vote your own question.");
            return;
        }

        setCurrentQuestion(updatedQuestion);
        setMessage("");
    }

    function handleAnswerVote(answerId: number, direction: 1 | -1) {
        const updatedAnswer = voteAnswer(answerId, currentUser.id, direction);
        if (!isLoggedIn() || !updatedAnswer) {
            setMessage("You must be logged in and cannot vote your own answer.");
            return;
        }
        refreshAnswers();
    }

    function handleAcceptAnswer(answerId: number) {
        if (activeQuestion.author.id !== currentUser.id) {
            setMessage("Only the question author can accept an answer.");
            return;
        }

        acceptAnswer(answerId, activeQuestion.id);
        const updatedQuestion = setQuestionStatus(activeQuestion.id, "SOLVED");
        if (updatedQuestion) setCurrentQuestion(updatedQuestion);
        refreshAnswers();
    }

    return (
        <main className="details-page">
            <Link to="/questions" className="back-link">
                Back to questions
            </Link>

            <header className="details-header">
                <h1>{activeQuestion.title}</h1>
                <div>
                    <span>Asked {new Date(activeQuestion.createdAt).toLocaleString()}</span>
                    <span>Status: {activeQuestion.status}</span>
                    <span>Author: {activeQuestion.author.username}</span>
                </div>
            </header>

            <article className="question-detail-card">
                <VoteColumn
                    votes={activeQuestion.voteCount}
                    disabled={!isLoggedIn() || activeQuestion.author.id === currentUser.id}
                    onUpvote={() => handleQuestionVote(1)}
                    onDownvote={() => handleQuestionVote(-1)}
                />

                <div className="detail-content">
                    <Markdown source={activeQuestion.body} />
                    {activeQuestion.picture && <img className="post-image" src={activeQuestion.picture} alt="Question attachment" />}

                    <div className="tags-list detail-tags">
                        {activeQuestion.tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="detail-actions">
                        <div className="question-actions">
                            {isLoggedIn() && activeQuestion.author.id === currentUser.id && (
                                <Link to={`/questions/${activeQuestion.id}/edit`} className="back-link">
                                    Edit question
                                </Link>
                            )}
                            {isLoggedIn() && activeQuestion.author.id === currentUser.id && (
                                <button className="danger-button" onClick={handleDeleteQuestion}>
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="author-badge">
                            <span>Author</span>
                            <strong>{activeQuestion.author.username}</strong>
                        </div>
                    </div>
                </div>
            </article>

            {message && <p className="form-message">{message}</p>}

            <AnswersList
                answers={answers}
                canAccept={isLoggedIn() && activeQuestion.author.id === currentUser.id}
                canVoteAnswer={(answer) => isLoggedIn() && answer.author.id !== currentUser.id}
                canEditAnswer={(answer) => isLoggedIn() && answer.author.id === currentUser.id}
                isSolved={activeQuestion.status === "SOLVED"}
                onVote={handleAnswerVote}
                onDelete={(answerId) => {
                    deleteAnswer(answerId);
                    refreshAnswers();
                }}
                onAccept={handleAcceptAnswer}
                onEdit={(answerId, body, picture) => {
                    updateAnswer(answerId, { body, picture });
                    refreshAnswers();
                }}
            />

            {activeQuestion.status !== "SOLVED" && (
                <AnswersForm questionId={activeQuestion.id} onSubmit={handleCreateAnswer} />
            )}
        </main>
    );
}

export default QuestionDetailsPage;

