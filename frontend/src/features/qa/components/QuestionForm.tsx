import { useMemo, useState, type ChangeEvent } from "react";
import { Image } from "lucide-react";
import type { TagDto } from "../types/tagTypes.ts";
import { createTag, getTags } from "../../../services/tagService.ts";
import { formatTags, parseTags } from "../../../services/tagUtils.ts";

type QuestionFormProps = {
    title: string;
    body: string;
    tags: string;
    picture: string;
    onTitleChange: (value: string) => void;
    onBodyChange: (value: string) => void;
    onTagsChange: (value: string) => void;
    onPictureChange: (value: string) => void;
    onSubmit: () => void;
    submitLabel?: string;
};

function QuestionForm({
    title,
    body,
    tags,
    picture,
    onTitleChange,
    onBodyChange,
    onTagsChange,
    onPictureChange,
    onSubmit,
    submitLabel = "Add question",
}: QuestionFormProps) {
    const [tagSearch, setTagSearch] = useState("");
    const [availableTags, setAvailableTags] = useState<TagDto[]>(() => getTags());
    const selectedTags = useMemo(() => parseTags(tags), [tags]);
    const normalizedTagSearch = tagSearch.trim().toLowerCase();
    const filteredTags = availableTags.filter((tag) =>
        tag.name.toLowerCase().startsWith(normalizedTagSearch)
    );
    const exactTagExists = availableTags.some((tag) => tag.name === normalizedTagSearch);

    function handleToggleTag(tagName: string) {
        const nextTags = selectedTags.includes(tagName)
            ? selectedTags.filter((tag) => tag !== tagName)
            : [...selectedTags, tagName];

        onTagsChange(formatTags(nextTags));
    }

    function handleCreateAndSelectTag() {
        const newTag = createTag(tagSearch);

        if (!newTag) {
            return;
        }

        setAvailableTags(getTags());

        if (!selectedTags.includes(newTag.name)) {
            onTagsChange(formatTags([...selectedTags, newTag.name]));
        }

        setTagSearch("");
    }

    const canPreviewImage = picture.trim().startsWith("data:image/")
        || picture.trim().startsWith("http://")
        || picture.trim().startsWith("https://");

    function handlePictureFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onPictureChange(reader.result);
            }
        };
        reader.readAsDataURL(file);
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

            <label className="picture-upload">
                <span>Picture</span>
                <input type="file" accept="image/*" onChange={handlePictureFileChange} />
            </label>
            {canPreviewImage && (
                <div className="picture-upload-preview">
                    <span className="picture-indicator icon-only" title="Picture selected">
                        <Image size={14} />
                    </span>
                    <button className="tag-create-button" type="button" onClick={() => onPictureChange("")}>
                        Remove picture
                    </button>
                </div>
            )}

            <div className="tag-picker">
                <p className="tag-picker-hint">Choose at least one tag. If it does not exist, create it here.</p>
                <input
                    className="question-form-input"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Start typing a tag name..."
                />

                <div className="tag-picker-list" role="listbox" aria-label="Available tags">
                    {filteredTags.length === 0 ? (
                        <span className="tag-picker-empty">No existing tags start with that text.</span>
                    ) : (
                        filteredTags.map((tag) => (
                            <button
                                key={tag.id}
                                className={selectedTags.includes(tag.name) ? "tag-choice selected" : "tag-choice"}
                                type="button"
                                onClick={() => handleToggleTag(tag.name)}
                            >
                                <span>#{tag.name}</span>
                                {selectedTags.includes(tag.name) && <strong>selected</strong>}
                            </button>
                        ))
                    )}
                </div>

                {normalizedTagSearch && !exactTagExists && (
                    <button className="tag-create-button" type="button" onClick={handleCreateAndSelectTag}>
                        Create tag "#{normalizedTagSearch}"
                    </button>
                )}

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

