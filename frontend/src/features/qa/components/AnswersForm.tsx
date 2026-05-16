import { useState, type ChangeEvent } from "react";
import { Image } from "lucide-react";
import type {AnswerDto, CreateAnswerRequest} from "../types/answerTypes.ts";

type AnswersFormProps = {
    questionId: number;
    onSubmit?: (data: CreateAnswerRequest) => AnswerDto | void;
};

function AnswersForm({questionId, onSubmit}: AnswersFormProps) {
    const [body, setBody] = useState("");
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");

    function handlePictureFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPicture(reader.result);
            }
        };
        reader.readAsDataURL(file);
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
                    placeholder="Write a focused answer. Code blocks can be wrapped in triple backticks."
                />
                <label className="picture-upload">
                    <span>Picture</span>
                    <input type="file" accept="image/*" onChange={handlePictureFileChange} />
                </label>
                {picture && (
                    <div className="picture-upload-preview">
                        <span className="picture-indicator icon-only" title="Picture selected">
                            <Image size={14} />
                        </span>
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


