import { formatUserScore } from "../utils/formatUserScore.ts";

type AuthorWithScoreProps = {
    username: string;
    score?: number;
    className?: string;
};

function AuthorWithScore({ username, score = 0, className }: AuthorWithScoreProps) {
    return (
        <span className={className ?? "author-with-score"}>
            <strong>{username}</strong>
            <span className="user-score" title="User score">
                ({formatUserScore(score)})
            </span>
        </span>
    );
}

export default AuthorWithScore;
