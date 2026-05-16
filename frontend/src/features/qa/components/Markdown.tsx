type MarkdownProps = {
    source: string;
};

function Markdown({ source }: MarkdownProps) {
    const blocks = source.split(/```/);

    return (
        <div className="markdown-content">
            {blocks.map((block, index) => {
                if (index % 2 === 1) {
                    const firstLineEnd = block.indexOf("\n");
                    const code = firstLineEnd >= 0 ? block.slice(firstLineEnd + 1) : block;

                    return (
                        <pre key={index} className="code-block">
                            <code>{code.trimEnd()}</code>
                        </pre>
                    );
                }

                return (
                    <div key={index}>
                        {block
                            .split(/\n\n+/)
                            .filter((paragraph) => paragraph.trim().length > 0)
                            .map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>{paragraph}</p>
                            ))}
                    </div>
                );
            })}
        </div>
    );
}

export default Markdown;

