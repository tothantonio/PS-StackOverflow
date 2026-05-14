import { useMemo, useState } from "react";
import { getTags } from "../../../services/tagService.ts";
import { formatTags, parseTags } from "../utils/tags.ts";

type QuestionFormProps = {
    title: string;
    body: string;
    tags: string;
    onTitleChange: (value: string) => void;
    onBodyChange: (value: string) => void;
    onTagsChange: (value: string) => void;
    onSubmit: () => void;
    submitLabel?: string;
};

function QuestionForm({
    title,
    body,
    tags,
    onTitleChange,
    onBodyChange,
    onTagsChange,
    onSubmit,
    submitLabel = "Add question",
}: QuestionFormProps) {
    const [tagSearch, setTagSearch] = useState("");
    const selectedTags = useMemo(() => parseTags(tags), [tags]);
    const availableTags = useMemo(() => getTags(), []);
    const filteredTags = availableTags.filter((tag) =>
        tag.name.toLowerCase().startsWith(tagSearch.trim().toLowerCase())
    );

    function handleToggleTag(tagName: string) {
        const nextTags = selectedTags.includes(tagName)
            ? selectedTags.filter((tag) => tag !== tagName)
            : [...selectedTags, tagName];

        onTagsChange(formatTags(nextTags));
    }

    return (
        <div className="question-form-card">
            <input
                className="question-form-input"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Question title..."
            />

            <textarea
                className="question-form-textarea"
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="Write your question..."
            />

            <div className="tag-picker">
                <p className="tag-picker-hint">Choose tags from the existing list.</p>
                <input
                    className="question-form-input"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Start typing a tag name..."
                />

                <div className="tag-picker-list">
                    {filteredTags.length === 0 ? (
                        <span className="empty-state">No existing tags start with that text.</span>
                    ) : (
                        filteredTags.map((tag) => (
                            <button
                                key={tag.id}
                                className={selectedTags.includes(tag.name) ? "tag-choice selected" : "tag-choice"}
                                type="button"
                                onClick={() => handleToggleTag(tag.name)}
                            >
                                #{tag.name}
                            </button>
                        ))
                    )}
                </div>

                {selectedTags.length > 0 && (
                    <div className="selected-tags">
                        {selectedTags.map((tag) => (
                            <button
                                key={tag}
                                className="tag-pill selected-tag"
                                type="button"
                                onClick={() => handleToggleTag(tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button className="ask-button" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}

export default QuestionForm;
