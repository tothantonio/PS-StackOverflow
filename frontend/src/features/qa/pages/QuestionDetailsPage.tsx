import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { AnswerDto } from "../types/answerTypes.ts";

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
    setQuestionStatus,
    voteQuestion,
} from "../../../services/questionService.ts";

function QuestionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const questionId = Number(id);

    const [currentQuestion, setCurrentQuestion] = useState<any>(undefined);
    const [answers, setAnswers] = useState<AnswerDto[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const currentUser = getCurrentUser();

    useEffect(() => {
        async function loadData() {
            if (!id || Number.isNaN(questionId)) return;

            try {
                setLoading(true);

                const question = await getQuestionById(questionId);
                const answersData = await getAnswersByQuestionId(questionId);

                setCurrentQuestion(question);
                setAnswers(answersData);
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
        try {
            const updatedAnswers = await getAnswersByQuestionId(questionId);
            setAnswers(updatedAnswers);
        } catch (error) {
            console.error("Failed to refresh answers:", error);
        }
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

    const hasAcceptedAnswer = answers.some((a) => a.accepted);

    const isQuestionClosed =
        activeQuestion.status === "SOLVED" || hasAcceptedAnswer;

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
            setMessage("This question is solved. No more answers.");
            return;
        }

        try {
            await createAnswer(data);

            const updatedQuestion = await setQuestionStatus(
                activeQuestion.id,
                "IN_PROGRESS"
            );

            if (updatedQuestion) setCurrentQuestion(updatedQuestion);

            await refreshAnswers();
            setMessage("");
        } catch (e) {
            console.error(e);
            setMessage("Failed to create answer.");
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
                    onUpvote={() => voteQuestion(activeQuestion.id, currentUser!.id, 1)}
                    onDownvote={() => voteQuestion(activeQuestion.id, currentUser!.id, -1)}
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
                    activeQuestion.author.id === currentUser?.id
                }
                canVoteAnswer={(a) =>
                    isLoggedIn() && a.author.id !== currentUser?.id
                }
                canEditAnswer={(a) =>
                    isLoggedIn() && a.author.id === currentUser?.id
                }
                isSolved={isQuestionClosed}
                onVote={async (id, dir) => {
                    await voteAnswer(id, currentUser!.id, dir);
                    await refreshAnswers();
                }}
                onDelete={async (id) => {
                    await deleteAnswer(id);
                    await refreshAnswers();
                }}
                onAccept={async (id) => {
                    await acceptAnswer(id, activeQuestion.id);
                    const q = await setQuestionStatus(activeQuestion.id, "SOLVED");
                    if (q) setCurrentQuestion(q);
                    await refreshAnswers();
                }}
                onEdit={async (id, body, picture) => {
                    await updateAnswer(id, { body, picture });
                    await refreshAnswers();
                }}
            />

            {!isQuestionClosed && (
                <AnswersForm
                    questionId={activeQuestion.id}
                    onSubmit={handleCreateAnswer}
                />
            )}
        </main>
    );
}

export default QuestionDetailsPage;