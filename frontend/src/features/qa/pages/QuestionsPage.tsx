import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { QuestionDto } from "../types/questionTypes.ts";
import QuestionForm from "../components/QuestionForm.tsx";
import QuestionCard from "../components/QuestionCard.tsx";
import { QuestionsFilter } from "../components/QuestionsFilter.tsx";
import {
    createQuestion,
    filterQuestions,
    getQuestions,
} from "../../../services/questionService.ts";
import { getAnswersByQuestionId } from "../../../services/answerService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { getCurrentUser } from "../../../services/userService.ts";
import { parseTags } from "../../../services/tagUtils.ts";

function QuestionsPage() {
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<QuestionDto[]>([]);
    const [answerCounts, setAnswerCounts] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [newTags, setNewTags] = useState("");
    const [newPicture, setNewPicture] = useState("");
    const [formError, setFormError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filterByUserId, setFilterByUserId] = useState<number | undefined>(undefined);
    const [showMyQuestions, setShowMyQuestions] = useState(false);

    const loggedIn = isLoggedIn();
    const currentUser = loggedIn ? getCurrentUser() : undefined;

    const loadQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getQuestions();
            setQuestions(data || []);
            setError("");
        } catch (err) {
            console.error("Failed to load questions:", err);
            setError("Failed to load questions");
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    useEffect(() => {
        const result = filterQuestions(questions, {
            searchQuery,
            tagNames: selectedTags,
            authorId: filterByUserId,
            mineOnly: showMyQuestions,
            currentUserId: currentUser?.id,
        });
        setFilteredQuestions(result);
    }, [questions, searchQuery, selectedTags, filterByUserId, showMyQuestions, currentUser?.id]);

    useEffect(() => {
        async function loadAnswerCounts() {
            const entries = await Promise.all(
                filteredQuestions.map(async (question) => {
                    const answers = await getAnswersByQuestionId(question.id);
                    return [question.id, answers.length] as const;
                })
            );
            setAnswerCounts(Object.fromEntries(entries));
        }

        if (filteredQuestions.length > 0) {
            loadAnswerCounts();
        } else {
            setAnswerCounts({});
        }
    }, [filteredQuestions]);

    async function handleAddQuestion() {
        if (!isLoggedIn()) {
            setFormError("You must be logged in to ask a question.");
            return;
        }

        if (!newTitle.trim() || !newBody.trim()) {
            setFormError("Title and body are required.");
            return;
        }

        const tags = parseTags(newTags);
        if (tags.length === 0) {
            setFormError("Choose at least one tag.");
            return;
        }

        try {
            setFormError("");
            await createQuestion({
                title: newTitle.trim(),
                body: newBody.trim(),
                tags,
                picture: newPicture.trim() || undefined,
            });

            setNewTitle("");
            setNewBody("");
            setNewTags("");
            setNewPicture("");

            await loadQuestions();
        } catch (err) {
            console.error("Failed to create question:", err);
            setFormError("Failed to create question. Please try again.");
        }
    }

    function handleClearFilters() {
        setSearchQuery("");
        setSelectedTags([]);
        setFilterByUserId(undefined);
        setShowMyQuestions(false);
    }

    return (
        <main className="page-grid">
            <section>
                <div className="page-title-row">
                    <div>
                        <h1>Questions</h1>
                        <p>{filteredQuestions.length} questions found</p>
                    </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <QuestionsFilter
                    onSearch={setSearchQuery}
                    onFilterByTag={setSelectedTags}
                    onFilterByUser={setFilterByUserId}
                    onShowMyQuestions={setShowMyQuestions}
                    onClearFilters={handleClearFilters}
                />

                {loading ? (
                    <div className="loading-state">Loading questions...</div>
                ) : (
                    <div className="questions-feed">
                        {filteredQuestions.length === 0 ? (
                            <p className="empty-state">No questions found.</p>
                        ) : (
                            filteredQuestions.map((q) => (
                                <QuestionCard
                                    key={q.id}
                                    id={q.id}
                                    title={q.title}
                                    body={q.body}
                                    author={q.author}
                                    tags={q.tags ?? []}
                                    createdAt={q.createdAt}
                                    status={q.status}
                                    answerCount={answerCounts[q.id] ?? 0}
                                    voteCount={q.voteCount}
                                    picture={q.picture}
                                    canEdit={
                                        Boolean(currentUser) &&
                                        currentUser!.id === q.author.id
                                    }
                                />
                            ))
                        )}
                    </div>
                )}
            </section>

            <aside className="side-panel">
                <div className="welcome-card">
                    <h2>Ask a question</h2>
                    {loggedIn ? (
                        <>
                            <p>Add a question and choose tags that describe it.</p>
                            <QuestionForm
                                title={newTitle}
                                body={newBody}
                                tags={newTags}
                                picture={newPicture}
                                onTitleChange={setNewTitle}
                                onBodyChange={setNewBody}
                                onTagsChange={setNewTags}
                                onPictureChange={setNewPicture}
                                onSubmit={handleAddQuestion}
                            />
                            {formError && <p className="form-error">{formError}</p>}
                        </>
                    ) : (
                        <>
                            <p>Login to ask a question, add tags, vote, or answer.</p>
                            <Link className="ask-button" to="/login">
                                Login to ask
                            </Link>
                        </>
                    )}
                </div>
                <div className="info-card">
                    <h3>Stats</h3>
                    <div className="stats-grid">
                        <div>
                            <strong>{questions.length}</strong>
                            <span>Total</span>
                        </div>
                        <div>
                            <strong>{filteredQuestions.length}</strong>
                            <span>Visible</span>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    );
}

export default QuestionsPage;
