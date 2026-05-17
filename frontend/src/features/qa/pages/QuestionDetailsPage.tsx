import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { AnswerDto } from "../types/answerTypes.ts";
import type { QuestionDto } from "../types/questionTypes.ts";

import AnswersForm from "../components/AnswersForm.tsx";
import AnswersList from "../components/AnswersList.tsx";
import Markdown from "../components/Markdown.tsx";
import VoteColumn from "../components/VoteColumn.tsx";
import PostPicture from "../components/PostPicture.tsx";

import {
    acceptAnswer,
    createAnswer,
    deleteAnswer,
    getAnswersByQuestionId,
    updateAnswer,
    voteAnswer,
} from "../../../services/answerService.ts";

import { isLoggedIn } from "../../../services/authService.ts";
import { getCurrentUser } from "../../../services/userService.ts";

import {
    deleteQuestion,
    getQuestionById,
    voteQuestion,
} from "../../../services/questionService.ts";

function QuestionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const questionId = Number(id);

    const [currentQuestion, setCurrentQuestion] = useState<QuestionDto | undefined>(undefined);
    const [answers, setAnswers] = useState<AnswerDto[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const currentUser = getCurrentUser();

    async function loadQuestion() {
        const question = await getQuestionById(questionId);
        setCurrentQuestion(question);
        return question;
    }

    useEffect(() => {
        async function loadData() {
            if (!id || Number.isNaN(questionId)) return;

            try {
                setLoading(true);
                const question = await loadQuestion();
                const answersData = await getAnswersByQuestionId(questionId);
                setAnswers(answersData);
                if (!question) {
                    setCurrentQuestion(undefined);
                }
            } catch (error) {
                console.error("Failed to load question details:", error);
                setCurrentQuestion(undefined);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, questionId]);

    async function refreshAnswers() {
        const updatedAnswers = await getAnswersByQuestionId(questionId);
        setAnswers(updatedAnswers);
    }

    if (loading) {
        return (
            <main className="details-page">
                <header className="details-header">
                    <h1>Loading...</h1>
                </header>
            </main>
        );
    }

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

    const normalizedStatus = activeQuestion.status
        .toLowerCase()
        .replace("_", "-");

    const statusLabel = activeQuestion.status
        .toLowerCase()
        .replace("_", " ");

    const isQuestionClosed = activeQuestion.status === "SOLVED";

    async function handleCreateAnswer(data: {
        questionId: number;
        body: string;
        picture?: string | null;
    }) {
        if (!isLoggedIn()) {
            setMessage("You must be logged in to answer.");
            return;
        }

        if (isQuestionClosed) {
            setMessage("This question is solved. No more answers can be added.");
            return;
        }

        try {
            await createAnswer(data);
            await loadQuestion();
            await refreshAnswers();
            setMessage("");
        } catch (e) {
            console.error(e);
            setMessage(e instanceof Error ? e.message : "Failed to create answer.");
        }
    }

    return (
        <main className="details-page">
            <Link to="/questions" className="back-link">
                Back to questions
            </Link>

            <header className="details-header">
                <h1>{activeQuestion.title}</h1>

                <div>
                    <span>
                        Asked{" "}
                        {new Date(activeQuestion.createdAt).toLocaleString()}
                    </span>

                    <span className={`status-badge status-${normalizedStatus}`}>
                        {statusLabel}
                    </span>

                    <span>Author: {activeQuestion.author.username}</span>
                </div>
            </header>

            <article className="question-detail-card">
                <VoteColumn
                    votes={activeQuestion.voteCount}
                    disabled={
                        !isLoggedIn() ||
                        activeQuestion.author.id === currentUser?.id
                    }
                    onUpvote={async () => {
                        try {
                            const voteCount = await voteQuestion(
                                activeQuestion.id,
                                currentUser!.id,
                                1
                            );
                            if (voteCount != null) {
                                setCurrentQuestion({ ...activeQuestion, voteCount });
                            }
                            setMessage("");
                        } catch (error) {
                            console.error(error);
                            setMessage(
                                error instanceof Error ? error.message : "Failed to vote."
                            );
                        }
                    }}
                    onDownvote={async () => {
                        try {
                            const voteCount = await voteQuestion(
                                activeQuestion.id,
                                currentUser!.id,
                                -1
                            );
                            if (voteCount != null) {
                                setCurrentQuestion({ ...activeQuestion, voteCount });
                            }
                            setMessage("");
                        } catch (error) {
                            console.error(error);
                            setMessage(
                                error instanceof Error ? error.message : "Failed to vote."
                            );
                        }
                    }}
                />

                <div className="detail-content">
                    <Markdown source={activeQuestion.body} />

                    {activeQuestion.picture && (
                        <PostPicture src={activeQuestion.picture} alt="Question attachment" />
                    )}

                    <div className="tags-list detail-tags">
                        {(activeQuestion.tags ?? []).map((tag: string) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {isLoggedIn() && activeQuestion.author.id === currentUser?.id && (
                        <div className="detail-actions question-actions">
                            <Link
                                to={`/questions/${activeQuestion.id}/edit`}
                                className="back-link"
                            >
                                Edit question
                            </Link>
                            <button
                                type="button"
                                className="danger-button"
                                onClick={async () => {
                                    if (
                                        !window.confirm(
                                            "Delete this question permanently?"
                                        )
                                    ) {
                                        return;
                                    }
                                    try {
                                        await deleteQuestion(activeQuestion.id);
                                        navigate("/questions");
                                    } catch (error) {
                                        console.error(error);
                                        setMessage("Failed to delete question.");
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </article>

            {message && <p className="form-message">{message}</p>}

            <AnswersList
                answers={answers}
                canAccept={
                    isLoggedIn() &&
                    activeQuestion.author.id === currentUser?.id &&
                    !isQuestionClosed
                }
                canVoteAnswer={(a) =>
                    isLoggedIn() && a.author.id !== currentUser?.id
                }
                canEditAnswer={(a) =>
                    isLoggedIn() && a.author.id === currentUser?.id
                }
                isSolved={isQuestionClosed}
                onVote={async (answerId, dir) => {
                    try {
                        const voteCount = await voteAnswer(answerId, currentUser!.id, dir);
                        if (voteCount != null) {
                            setAnswers((prev) =>
                                prev
                                    .map((answer) =>
                                        answer.id === answerId
                                            ? { ...answer, voteCount }
                                            : answer
                                    )
                                    .sort((a, b) => b.voteCount - a.voteCount)
                            );
                        }
                        setMessage("");
                    } catch (error) {
                        console.error(error);
                        setMessage(
                            error instanceof Error ? error.message : "Failed to vote."
                        );
                    }
                }}
                onDelete={async (answerId) => {
                    if (!window.confirm("Delete this answer permanently?")) {
                        return;
                    }
                    try {
                        await deleteAnswer(answerId);
                        await refreshAnswers();
                        setMessage("");
                    } catch (error) {
                        console.error(error);
                        setMessage("Failed to delete answer.");
                    }
                }}
                onAccept={async (answerId) => {
                    try {
                        await acceptAnswer(answerId, activeQuestion.id);
                        await loadQuestion();
                        await refreshAnswers();
                        setMessage("");
                    } catch (error) {
                        console.error(error);
                        setMessage(
                            error instanceof Error ? error.message : "Failed to accept answer."
                        );
                    }
                }}
                onEdit={async (answerId, body, picture) => {
                    try {
                        await updateAnswer(answerId, activeQuestion.id, { body, picture });
                        await refreshAnswers();
                        setMessage("");
                    } catch (error) {
                        console.error(error);
                        setMessage("Failed to update answer.");
                    }
                }}
            />

            {isLoggedIn() && !isQuestionClosed ? (
                <AnswersForm
                    questionId={activeQuestion.id}
                    onSubmit={handleCreateAnswer}
                />
            ) : !isLoggedIn() ? (
                <section className="your-answer-section">
                    <p className="answers-empty">
                        <Link to="/login">Log in</Link> to post an answer.
                    </p>
                </section>
            ) : (
                <section className="your-answer-section">
                    <p className="answers-empty">
                        This question is solved. No more answers can be added.
                    </p>
                </section>
            )}
        </main>
    );
}

export default QuestionDetailsPage;
