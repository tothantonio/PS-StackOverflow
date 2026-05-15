import { useState } from "react";
import { Link } from "react-router-dom";
import type { QuestionDto } from "../types/questionTypes.ts";
import QuestionForm from "../components/QuestionForm.tsx";
import QuestionCard from "../components/QuestionCard.tsx";
import { createQuestion, getQuestions, searchQuestions } from "../../../services/questionService.ts";
import { getTagNames } from "../../../services/tagService.ts";
import { getAnswersByQuestionId } from "../../../services/answerService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { getCurrentUser } from "../../../services/userService.ts";
import { parseTags } from "../../../services/tagUtils.ts";

function QuestionsPage() {
    const [questions, setQuestions] = useState<QuestionDto[]>(() => getQuestions());
    const [search, setSearch] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [newTags, setNewTags] = useState("");
    const [newPicture, setNewPicture] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [mineOnly, setMineOnly] = useState(false);
    const [formError, setFormError] = useState("");

    function handleAddQuestion() {
        if (!isLoggedIn()) {
            setFormError("You must be logged in to ask a question.");
            return;
        }

        if (!newTitle.trim() || !newBody.trim()) {
            setFormError("Title and body are required.");
            return;
        }

        if (parseTags(newTags).length === 0) {
            setFormError("Choose at least one existing tag.");
            return;
        }

        createQuestion({
            title: newTitle.trim(),
            body: newBody.trim(),
            tags: parseTags(newTags).filter((tag) => getTagNames().includes(tag)),
            picture: newPicture.trim() || undefined,
        });

        setQuestions(getQuestions());
        setNewTitle("");
        setNewBody("");
        setNewTags("");
        setNewPicture("");
        setFormError("");
    }

    const loggedIn = isLoggedIn();
    const currentUser = loggedIn ? getCurrentUser() : undefined;
    const matchingFilterTags = getTagNames().filter((tag) =>
        tag.toLowerCase().startsWith(tagFilter.trim().toLowerCase())
    );
    const filteredQuestions = (search.trim() ? searchQuestions(search) : questions)
        .filter((question) => !tagFilter.trim() || question.tags.some((tag) => tag.toLowerCase().startsWith(tagFilter.trim().toLowerCase())))
        .filter((question) => !userFilter.trim() || question.author.username.toLowerCase().includes(userFilter.trim().toLowerCase()))
        .filter((question) => !mineOnly || (currentUser && question.author.id === currentUser.id));

    return (
        <main className="page-grid">
            <section>
                <div className="page-title-row">
                    <div>
                        <h1>Questions</h1>
                        <p>{filteredQuestions.length} questions found</p>
                    </div>
                </div>

                <input
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title..."
                />

                <div className="filter-row">
                    <div className="tag-filter-box">
                        <input
                            className="question-form-input"
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            placeholder="Filter by tag..."
                        />
                        {tagFilter.trim() && matchingFilterTags.length > 0 && (
                            <div className="tag-filter-suggestions">
                                {matchingFilterTags.map((tag) => (
                                    <button key={tag} type="button" onClick={() => setTagFilter(tag)}>
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        className="question-form-input"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        placeholder="Filter by user..."
                    />
                    {loggedIn && (
                        <label className="filter-check">
                            <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
                            My questions
                        </label>
                    )}
                </div>

                <div className="questions-feed">
                    {filteredQuestions.length === 0 ? (
                        <p className="empty-state">No questions found.</p>
                    ) : (
                        filteredQuestions.map((q) => {
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

            <aside className="side-panel">
                <div className="welcome-card">
                    <h2>Ask a question</h2>
                    {loggedIn ? (
                        <>
                            <p>Add a question and choose the tags that describe it.</p>
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
                            <Link className="ask-button" to="/login">Login to ask</Link>
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

