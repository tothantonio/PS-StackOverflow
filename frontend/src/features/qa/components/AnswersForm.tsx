import {useState} from "react";
import type {AnswerDto, CreateAnswerRequest} from "../types/answerTypes.ts";

type AnswersFormProps = {
    questionId: number;
    onSubmit?: (data: CreateAnswerRequest) => AnswerDto | void;
};

function AnswersForm({questionId, onSubmit}: AnswersFormProps) {
    const [body, setBody] = useState("");
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");
    const canPreviewImage = picture.trim().startsWith("http://") || picture.trim().startsWith("https://");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (body.trim().length < 20) {
            setError("Your answer should include at least 20 characters.");
            return;
        }

        if (picture.trim() && !canPreviewImage) {
            setError("Image must be a valid http or https URL.");
            return;
        }

        onSubmit?.({
            questionId,
            body,
            picture: picture.trim() || undefined,
        });
        setBody("");
        setPicture("");
        setError("");
    }

    return (
        <section className="your-answer-section">
            <h2>Your answer</h2>
            <form className="answer-form" onSubmit={handleSubmit}>
                <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={8}
                    placeholder="Write a focused answer. Code blocks can be wrapped in triple backticks."
                />
                <input
                    className="question-form-input"
                    value={picture}
                    onChange={(event) => setPicture(event.target.value)}
                    placeholder="Picture URL, starting with http:// or https://"
                />
                {canPreviewImage && (
                    <img className="post-image image-preview" src={picture.trim()} alt="Answer picture preview" />
                )}
                <div className="answer-form-footer">
                    {error && <span className="answer-error">{error}</span>}
                    <button type="submit">Post your answer</button>
                </div>
            </form>
        </section>
    );
}

export default AnswersForm;


