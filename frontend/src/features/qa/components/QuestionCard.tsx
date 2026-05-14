import { Link } from "react-router-dom";
import type { UserDto } from "../types/userTypes.ts";

type QuestionCardProps = {
    id: number;
    title: string;
    body: string;
    author: UserDto;
    tags: string[];
    voteCount?: number;
};

function QuestionCard({ id, title, body, author, tags, voteCount = 0 }: QuestionCardProps) {
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

                <div className="question-card-footer">
                    <div className="tags-list">
                        {tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="author-badge">
                        <span>Author</span>
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
