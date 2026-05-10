import { useState } from "react";
import type { QuestionDto } from "../types/questionTypes.ts";
import QuestionForm from "../components/QuestionForm.tsx";
import QuestionCard from "../components/QuestionCard.tsx";
import { getQuestions, createQuestion } from "../../../services/questionService.ts";

function QuestionsPage() {
    const [questions, setQuestions] = useState<QuestionDto[]>(() => getQuestions());
    const [search, setSearch] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");

    function handleAddQuestion() {
        const newQuestion = createQuestion({
            title: newTitle,
            body: newBody,
            tags: ["react"], // Mock tags
        });


        setQuestions([newQuestion, ...questions]);
        setNewTitle("");
        setNewBody("");
    }

    const filtredQuestions = questions.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main style={{ padding: "20px" }}>
            <h1>Questions</h1>
            <QuestionForm
                title={newTitle}
                body={newBody}
                onTitleChange={setNewTitle}
                onBodyChange={setNewBody}
                onSubmit={handleAddQuestion}
            />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
            />

            {filtredQuestions.map((q) => (
                <QuestionCard
                    key={q.id}
                    id={q.id}
                    title={q.title}
                    body={q.body}
                    author={q.author}
                    tags={q.tags}
                />
            ))}
        </main>
    );
}

export default QuestionsPage;
