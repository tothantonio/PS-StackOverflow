import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm.tsx";
import { getQuestionById, updateQuestion } from "../../../services/questionService.ts";
import { getTagNames } from "../../../services/tagService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { formatTags, parseTags } from "../tags.ts";

function EditQuestionPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const questionId = Number(id);
    const question = Number.isNaN(questionId) ? undefined : getQuestionById(questionId);

    const [title, setTitle] = useState(() => question?.title ?? "");
    const [body, setBody] = useState(() => question?.body ?? "");
    const [tags, setTags] = useState(() => formatTags(question?.tags ?? []));
    const [picture, setPicture] = useState(() => question?.picture ?? "");
    const [error, setError] = useState("");

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

    function handleSave() {
        if (!isLoggedIn()) {
            setError("You must be logged in to edit a question.");
            return;
        }

        if (!title.trim() || !body.trim()) {
            setError("Title and body are required.");
            return;
        }

        const updatedQuestion = updateQuestion(questionId, {
            title: title.trim(),
            body: body.trim(),
            tags: parseTags(tags).filter((tag) => getTagNames().includes(tag)),
            picture: picture.trim() || undefined,
        });

        if (updatedQuestion) {
            navigate(`/questions/${updatedQuestion.id}`);
        }
    }

    return (
        <main className="details-page">
            <Link to={`/questions/${question.id}`} className="back-link">
                Back to question
            </Link>

            <header className="details-header">
                <h1>Edit Question</h1>
                <div>
                    <span>Editing: {question.title}</span>
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
                    onSubmit={handleSave}
                    submitLabel="Save changes"
                />

                <div className="edit-actions">
                    <Link to={`/questions/${question.id}`} className="back-link">
                        Cancel
                    </Link>
                </div>
                {error && <p className="form-error">{error}</p>}
            </section>
        </main>
    );
}

export default EditQuestionPage;

