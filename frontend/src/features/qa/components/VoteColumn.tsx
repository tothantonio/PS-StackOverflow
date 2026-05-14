import {ThumbsDown, ThumbsUp} from "lucide-react";

type VoteColumnProps = {
    votes: number;
    accepted?: boolean;
    onUpvote?: () => void;
    onDownvote?: () => void;
    disabled?: boolean;
};

function VoteColumn({ votes, accepted, onUpvote, onDownvote, disabled }: VoteColumnProps) {
    return (
        <div className="vote-column">
            <button className="vote-button like-button" disabled={disabled} onClick={onUpvote}>
                <ThumbsUp size={20} />

            </button>
            <span className="vote-count">{votes}</span>
            <button className="vote-button unlike-button" disabled={disabled} onClick={onDownvote}>
                <ThumbsDown size={20} />
            </button>

            {accepted && <span className="accepted-mark">✓</span>}

            <button className="save-button" disabled={disabled}>♡</button>
        </div>
    );
}

export default VoteColumn;
