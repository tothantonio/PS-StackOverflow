type VoteColumnProps = {
    votes: number;
};

function VoteColumn({ votes }: VoteColumnProps) {
    return (
        <div style={{ minWidth: "60px", textAlign: "center", color: "#6a737c" }}>
            <div style={{ fontSize: "22px" }}>▲</div>
            <strong>{votes}</strong>
            <div style={{ fontSize: "22px" }}>▼</div>
        </div>
    );
}

export default VoteColumn;
