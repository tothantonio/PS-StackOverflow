import type {AnswerDto} from "../types/answerTypes.ts";
import AnswersCard from "./AnswersCard.tsx";

type AnswersListProps = {
    answers: AnswerDto[];
    canAccept: boolean;
    canVoteAnswer: (answer: AnswerDto) => boolean;
    canEditAnswer: (answer: AnswerDto) => boolean;
    isSolved: boolean;
    onVote: (answerId: number, direction: 1 | -1) => void;
    onDelete: (answerId: number) => void;
    onAccept: (answerId: number) => void;
    onEdit: (answerId: number, body: string, picture?: string | null) => void;
};

function AnswersList({answers, canAccept, canVoteAnswer, canEditAnswer, isSolved, onVote, onDelete, onAccept, onEdit}: AnswersListProps) {
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
                    <AnswersCard
                        key={answer.id}
                        answer={answer}
                        canEdit={canEditAnswer(answer)}
                        canAccept={canAccept}
                        canVote={canVoteAnswer(answer)}
                        isSolved={isSolved}
                        onVote={onVote}
                        onDelete={onDelete}
                        onAccept={onAccept}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </section>
    );
}

export default AnswersList;

