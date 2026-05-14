import { Link } from "react-router-dom";
import type { UserDto } from "../types/userTypes.ts";

type QuestionCardProps = {
    id: number;
    title: string;
    body: string;
    author: UserDto;
    tags: string[];
    createdAt: string;
    voteCount?: number;
    picture?: string | null;
};

function QuestionCard({ id, title, body, author, tags, createdAt, voteCount = 0, picture }: QuestionCardProps) {
    const formattedCreatedAt = new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(createdAt));

    return (
        <article className="question-card">
            <div className="question-stats">
                <strong>{voteCount}</strong>
                <span>votes</span>
            </div>
            <div className="question-card-content">
                <h2>
                    <Link to={`/questions/${id}`}>
                        {title}
                    </Link>
                </h2>
                <p>{body}</p>
                {picture && <img className="post-image card-image" src={picture} alt="Question attachment" />}

                <div className="question-card-footer">
                    <div className="tags-list">
                        {tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="author-badge">
                        <span>Asked {formattedCreatedAt}</span>
                        <strong>{author.username}</strong>
                    </div>
                </div>

                <Link to={`/questions/${id}/edit`} className="card-edit-link">
                    Edit
                </Link>
            </div>
        </article>
    );
}

export default QuestionCard;

