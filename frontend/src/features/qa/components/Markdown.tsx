type MarkdownProps = {
    text: string;
};

function Markdown({ text }: MarkdownProps) {
    return <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{text}</p>;
}

export default Markdown;
