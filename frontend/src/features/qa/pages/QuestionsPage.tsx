import { useState } from "react";
import type { QuestionDto } from "../types/questionTypes.ts";
import QuestionForm from "../components/QuestionForm.tsx";
import QuestionCard from "../components/QuestionCard.tsx";
import { createQuestion, getQuestions, searchQuestions } from "../../../services/questionService.ts";
import { getTagNames } from "../../../services/tagService.ts";
import { parseTags } from "../utils/tags.ts";

function QuestionsPage() {
    const [questions, setQuestions] = useState<QuestionDto[]>(() => getQuestions());
    const [search, setSearch] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [newTags, setNewTags] = useState("");
    const [formError, setFormError] = useState("");

    function handleAddQuestion() {
        if (!newTitle.trim() || !newBody.trim()) {
            setFormError("Title and body are required.");
            return;
        }

        createQuestion({
            title: newTitle.trim(),
            body: newBody.trim(),
            tags: parseTags(newTags).filter((tag) => getTagNames().includes(tag)),
        });

        setQuestions(getQuestions());
        setNewTitle("");
        setNewBody("");
        setNewTags("");
        setFormError("");
    }

    const filteredQuestions = search.trim() ? searchQuestions(search) : questions;

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
                                tags={q.tags}
                                voteCount={q.voteCount}
                            />
                        ))
                    )}
                </div>
            </section>

            <aside className="side-panel">
                <div className="welcome-card">
                    <h2>Ask a question</h2>
                    <p>Add a mock question to test the UI flow.</p>
                    <QuestionForm
                        title={newTitle}
                        body={newBody}
                        tags={newTags}
                        onTitleChange={setNewTitle}
                        onBodyChange={setNewBody}
                        onTagsChange={setNewTags}
                        onSubmit={handleAddQuestion}
                    />
                    {formError && <p className="form-error">{formError}</p>}
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
