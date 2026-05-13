import {useState} from "react";
import type {AnswerDto, CreateAnswerRequest} from "../types/answerTypes.ts";

type AnswersFormProps = {
    questionId: number;
    onSubmit?: (data: CreateAnswerRequest) => AnswerDto | void;
};

function AnswersForm({questionId, onSubmit}: AnswersFormProps) {
    const [body, setBody] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (body.trim().length < 20) {
            setError("Your answer should include at least 20 characters.");
            return;
        }

        onSubmit?.({
            questionId,
            body,
        });
        setBody("");
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
                <div className="answer-form-footer">
                    {error && <span className="answer-error">{error}</span>}
                    <button type="submit">Post your answer</button>
                </div>
            </form>
        </section>
    );
}

export default AnswersForm;
