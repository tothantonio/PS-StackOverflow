import type {AnswerDto} from "../types/answerTypes.ts";
import AnswersCard from "./AnswersCard.tsx";

type AnswersListProps = {
    answers: AnswerDto[];
};

function AnswersList({answers}: AnswersListProps) {
    if (answers.length === 0) {
        return (
            <section className="answers-section">
                <h2>No answers yet</h2>
                <p className="answers-empty">Be the first to share a clear, practical solution.</p>
            </section>
        );
    }

    return (
        <section className="answers-section">
            <div className="answers-heading">
                <h2>{answers.length} {answers.length === 1 ? "answer" : "answers"}</h2>
                <span>{answers.some((answer) => answer.accepted) ? "Solved" : "Open"}</span>
            </div>

            <div className="answers-list">
                {answers.map((answer) => (
                    <AnswersCard key={answer.id} answer={answer} />
                ))}
            </div>
        </section>
    );
}

export default AnswersList;
