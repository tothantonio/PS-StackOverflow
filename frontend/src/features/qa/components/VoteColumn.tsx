import { Check, ThumbsDown, ThumbsUp } from "lucide-react";

type VoteColumnProps = {
    votes: number;
    accepted?: boolean;
    picture?: string | null;
    onUpvote?: () => void;
    onDownvote?: () => void;
    disabled?: boolean;
};

function VoteColumn({ votes, accepted, picture, onUpvote, onDownvote, disabled }: VoteColumnProps) {
    return (
        <div className="vote-column">
            {picture && (
                <img className="picture-thumbnail" src={picture} alt="Post attachment" />
            )}
            <button className="vote-button like-button" disabled={disabled} onClick={onUpvote} title="Like">
                <ThumbsUp size={20} />
            </button>
            <span className="vote-count">{votes}</span>
            <button className="vote-button unlike-button" disabled={disabled} onClick={onDownvote} title="Dislike">
                <ThumbsDown size={20} />
            </button>

            {accepted && (
                <span className="accepted-mark" title="Accepted answer">
                    <Check size={20} />
                </span>
            )}
        </div>
    );
}

export default VoteColumn;
