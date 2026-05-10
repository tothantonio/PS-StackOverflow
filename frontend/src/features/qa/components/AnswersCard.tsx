import type { AnswerDto } from "../types/answerTypes.ts";

type AnswersCardProps = {
    answer: AnswerDto;
};

function AnswersCard({ answer }: AnswersCardProps) {
    return (
        <article className="card">
            <p>{answer.body}</p>
            <small className="muted">
                Answered by {answer.author.username} • {new Date(answer.createdAt).toLocaleDateString()}
            </small>
        </article>
    );
}

export default AnswersCard;
