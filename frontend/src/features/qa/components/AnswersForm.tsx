type AnswersFormProps = {
    body: string;
    onBodyChange: (value: string) => void;
    onSubmit: () => void;
};

function AnswersForm({ body, onBodyChange, onSubmit }: AnswersFormProps) {
    return (
        <div className="card">
            <h2>Your Answer</h2>
            <textarea
                className="stack-textarea"
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="Write your answer..."
            />
            <button className="stack-button" onClick={onSubmit} style={{ marginTop: "10px" }}>
                Post answer
            </button>
        </div>
    );
}

export default AnswersForm;
