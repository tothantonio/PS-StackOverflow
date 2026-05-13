import type {AnswerDto} from "../types/answerTypes.ts";
import Markdown from "./Markdown.tsx";
import VoteColumn from "./VoteColumn.tsx";

type AnswersCardProps = {
    answer: AnswerDto;
};

function formatAnswerDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getInitials(username: string) {
    return username
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function AnswersCard({answer}: AnswersCardProps) {
    return (
        <article className={`answer-card ${answer.accepted ? "accepted" : ""}`}>
            <VoteColumn votes={answer.voteCount} accepted={answer.accepted} />

            <div className="detail-content answer-content">
                <div className="answer-topline">
                    {answer.accepted && <span className="accepted-label">Accepted answer</span>}
                    <span className="answer-date">{formatAnswerDate(answer.createdAt)}</span>
                </div>

                <Markdown source={answer.body} />

                <footer className="answer-author">
                    <div className="answer-author-card">
                        <span className="answer-avatar">{getInitials(answer.author.username)}</span>
                        <div>
                            <strong>{answer.author.username}</strong>
                            <span>answered {formatAnswerDate(answer.createdAt)}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </article>
    );
}

export default AnswersCard;
