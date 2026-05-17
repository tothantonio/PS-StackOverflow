import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "../components/QuestionForm.tsx";
import { createQuestion } from "../../../services/questionService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { parseTags } from "../../../services/tagUtils.ts";

function AskQuestionsPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit() {
        if (!isLoggedIn()) {
            setError("You must be logged in to ask a question.");
            return;
        }

        if (!title.trim() || !body.trim()) {
            setError("Title and body are required.");
            return;
        }

        const parsedTags = parseTags(tags);
        if (parsedTags.length === 0) {
            setError("Choose at least one tag.");
            return;
        }

        try {
            const question = await createQuestion({
                title: title.trim(),
                body: body.trim(),
                tags: parsedTags,
                picture: picture.trim() || undefined,
            });

            navigate(`/questions/${question.id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to create question. Check backend logs.");
        }
    }

    return (
        <main className="details-page">
            <header className="details-header">
                <h1>Ask Question</h1>
                <div>
                    <span>Create a new question for the community.</span>
                </div>
            </header>

            <section className="edit-question-card">
                <QuestionForm
                    title={title}
                    body={body}
                    tags={tags}
                    picture={picture}
                    onTitleChange={setTitle}
                    onBodyChange={setBody}
                    onTagsChange={setTags}
                    onPictureChange={setPicture}
                    onSubmit={handleSubmit}
                    submitLabel="Post question"
                />
                {error && <p className="form-error">{error}</p>}
            </section>
        </main>
    );
}

export default AskQuestionsPage;
