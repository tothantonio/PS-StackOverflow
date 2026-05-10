import { useParams } from "react-router-dom";
import { getQuestionById } from "../../../services/questionService.ts";

function QuestionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const questionId = Number(id);
    const question = Number.isNaN(questionId) ? undefined : getQuestionById(questionId);

    if (!question) {
        return <div>Question not found</div>;
    }

    return (
        <main style={{ padding: "20px" }}>
            <h1>{question.title}</h1>
            <p>{question.body}</p>
            <small>Author: {question.author.username}</small>
            <div>
                {question.tags.map((tag) => (
                    <span key={tag} style={{ marginRight: "5px" }}>
                        #{tag}
                    </span>
                ))}
            </div>
        </main>
    );
}

export default QuestionDetailsPage;
