import { useState, type ChangeEvent } from "react";
import type { AnswerDto, CreateAnswerRequest } from "../types/answerTypes.ts";
import { fileToCompressedDataUrl } from "../../../services/imageUtils.ts";
import PostPicture from "./PostPicture.tsx";

type AnswersFormProps = {
    questionId: number;
    onSubmit?: (
        data: CreateAnswerRequest
    ) => Promise<AnswerDto | void> | AnswerDto | void;
};

function AnswersForm({questionId, onSubmit}: AnswersFormProps) {
    const [body, setBody] = useState("");
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");

    async function handlePictureFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setError("");
            setPicture(await fileToCompressedDataUrl(file));
        } catch (err) {
            setPicture("");
            setError(err instanceof Error ? err.message : "Failed to process image.");
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!body.trim()) {
            setError("Answer text is required.");
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
                    placeholder="Write a focused answer. Lawyers are like health assurence, you hope you don't need it."
                />
                <label className="picture-upload">
                    <span>Picture</span>
                    <input type="file" accept="image/*" onChange={handlePictureFileChange} />
                </label>
                {picture && (
                    <div className="picture-upload-preview">
                        <PostPicture src={picture} alt="Answer preview" />
                        <button className="tag-create-button" type="button" onClick={() => setPicture("")}>
                            Remove picture
                        </button>
                    </div>
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


