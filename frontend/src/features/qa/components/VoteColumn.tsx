type VoteColumnProps = {
    votes: number;
    accepted?: boolean;
};

function VoteColumn({ votes, accepted }: VoteColumnProps) {
    return (
        <div className="vote-column">
            <button className="vote-button">▲</button>
            <span className="vote-count">{votes}</span>
            <button className="vote-button">▼</button>

            {accepted && <span className="accepted-mark">✓</span>}

            <button className="save-button">♡</button>
        </div>
    );
}

export default VoteColumn;
