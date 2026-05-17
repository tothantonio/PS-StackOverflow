import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm.tsx";
import {
    deleteQuestion,
    getQuestionById,
    updateQuestion,
} from "../../../services/questionService.ts";
import { isLoggedIn } from "../../../services/authService.ts";
import { getCurrentUser } from "../../../services/userService.ts";
import { formatTags, parseTags } from "../../../services/tagUtils.ts";
import type { QuestionDto } from "../types/questionTypes.ts";

function EditQuestionPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const questionId = Number(id);

    const [question, setQuestion] = useState<QuestionDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function load() {
            if (Number.isNaN(questionId)) {
                setLoading(false);
                return;
            }

            try {
                const q = await getQuestionById(questionId);

                if (!q) {
                    setQuestion(null);
                    return;
                }

                if (!isLoggedIn()) {
                    navigate("/login", { replace: true });
                    return;
                }

                const currentUser = getCurrentUser();
                if (q.author.id !== currentUser.id) {
                    navigate(`/questions/${questionId}`, { replace: true });
                    return;
                }

                setQuestion(q);
                setTitle(q.title);
                setBody(q.body);
                setTags(formatTags(q.tags ?? []));
                setPicture(q.picture ?? "");
            } catch (err) {
                console.error(err);
                setError("Failed to load question.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [questionId, navigate]);

    if (loading) {
        return <p className="loading-state">Loading...</p>;
    }

    if (!question) {
        return (
            <main className="details-page">
                <Link to="/questions" className="back-link">
                    Back to questions
                </Link>
                <h1>Question not found</h1>
            </main>
        );
    }

    async function handleSave() {
        if (!isLoggedIn()) {
            setError("You must be logged in to edit a question.");
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
            setError("");
            const updated = await updateQuestion(questionId, {
                title: title.trim(),
                body: body.trim(),
                tags: parsedTags,
                picture: picture.trim() || undefined,
            });

            navigate(`/questions/${updated?.id ?? questionId}`);
        } catch (err) {
            console.error(err);
            setError("Failed to update question.");
        }
    }

    async function handleDelete() {
        if (!isLoggedIn()) {
            setError("You must be logged in to delete a question.");
            return;
        }

        const confirmed = window.confirm(
            "Delete this question permanently? All related data may be removed."
        );
        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            setError("");
            await deleteQuestion(questionId);
            navigate("/questions");
        } catch (err) {
            console.error(err);
            setError("Failed to delete question.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <main className="details-page">
            <Link to={`/questions/${question.id}`} className="back-link">
                Back to question
            </Link>

            <header className="details-header">
                <h1>Edit Question</h1>
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

                <div className="edit-question-actions">
                    <button
                        type="button"
                        className="danger-button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete question"}
                    </button>
                </div>

                {error && <p className="form-error">{error}</p>}
            </section>
        </main>
    );
}

export default EditQuestionPage;
