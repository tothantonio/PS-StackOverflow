import type { AnswerDto } from "../types/answerTypes.ts";
import AnswersCard from "./AnswersCard.tsx";

type AnswersListProps = {
    answers: AnswerDto[];
};

function AnswersList({ answers }: AnswersListProps) {
    return (
        <section>
            <h2>{answers.length} answers</h2>
            {answers.map((answer) => (
                <AnswersCard key={answer.id} answer={answer} />
            ))}
        </section>
    );
}

export default AnswersList;
