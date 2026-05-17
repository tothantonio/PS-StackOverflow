import { useEffect, useState } from "react";
import type { TagDto } from "../types/tagTypes.ts";
import { createTag, getTags } from "../../../services/tagService.ts";
import { isLoggedIn } from "../../../services/authService.ts";

function CreateTagPage() {
    const [tags, setTags] = useState<TagDto[]>([]);
    const [tagName, setTagName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function load() {
            setTags(await getTags());
        }

        load();
    }, []);

    async function handleCreateTag() {
        if (!isLoggedIn()) {
            setMessage("You must be logged in to create tags.");
            return;
        }

        const normalizedName = tagName.trim().toLowerCase();

        if (!normalizedName) {
            setMessage("Tag name is required.");
            return;
        }

        const alreadyExists = tags.some((tag) => tag.name === normalizedName);

        try {
            const newTag = await createTag(tagName);

            if (!newTag) {
                setMessage("Tag name is required.");
                return;
            }

            setTags(await getTags());
            setTagName("");
            setMessage(alreadyExists ? "Tag already exists." : "Tag created.");
        } catch {
            setMessage("Failed to create tag.");
        }
    }

    return (
        <main className="details-page">
            <header className="details-header">
                <h1>Tags</h1>
                <div>
                    <span>{tags.length} tags available</span>
                </div>
            </header>

            <section className="tag-manager-card">
                <h2>Create tag</h2>
                <div className="tag-form-row">
                    <input
                        className="question-form-input"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="Tag name..."
                    />
                    <button className="ask-button" type="button" onClick={handleCreateTag}>
                        Add tag
                    </button>
                </div>
                {message && <p className="form-message">{message}</p>}
            </section>

            <section className="tag-manager-card">
                <h2>Existing tags</h2>
                <div className="tags-list tag-manager-list">
                    {tags.length === 0 ? (
                        <p className="empty-state">No tags yet.</p>
                    ) : (
                        tags.map((tag) => (
                            <span key={tag.id} className="tag-pill">
                                #{tag.name}
                            </span>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default CreateTagPage;
