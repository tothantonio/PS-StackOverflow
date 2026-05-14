import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "../components/QuestionForm.tsx";
import { createQuestion } from "../../../services/questionService.ts";
import { getTagNames } from "../../../services/tagService.ts";
import { parseTags } from "../utils/tags.ts";

function AskQuestionsPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!title.trim() || !body.trim()) {
            setError("Title and body are required.");
            return;
        }

        const question = createQuestion({
            title: title.trim(),
            body: body.trim(),
            tags: parseTags(tags).filter((tag) => getTagNames().includes(tag)),
        });

        navigate(`/questions/${question.id}`);
    }

    return (
        <main className="details-page">
            <header className="details-header">
                <h1>Ask Question</h1>
                <div>
                    <span>Create a mock question for the local UI.</span>
                </div>
            </header>

            <section className="edit-question-card">
                <QuestionForm
                    title={title}
                    body={body}
                    tags={tags}
                    onTitleChange={setTitle}
                    onBodyChange={setBody}
                    onTagsChange={setTags}
                    onSubmit={handleSubmit}
                    submitLabel="Post question"
                />
                {error && <p className="form-error">{error}</p>}
            </section>
        </main>
    );
}

export default AskQuestionsPage;
