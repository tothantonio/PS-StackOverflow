type QuestionFormProps = {
    title: string;
    body: string;
    onTitleChange: (value: string) => void;
    onBodyChange: (value: string) => void;
    onSubmit: () => void;
};

function QuestionForm({
                          title,
                          body,
                          onTitleChange,
                          onBodyChange,
                          onSubmit,
                      }: QuestionFormProps) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Question title..."
                style={{ display: "block", marginBottom: "10px", padding: "8px" }}
            />

            <textarea
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="Write your question..."
                style={{ display: "block", marginBottom: "10px", padding: "8px" }}
            />

            <button onClick={onSubmit}>Add question</button>
        </div>
    );
}

export default QuestionForm;