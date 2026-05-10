import { useState } from "react";
import { createTag, getTags } from "../../../services/tagService.ts";

function CreateTagPage() {
    const [name, setName] = useState("");
    const [tags, setTags] = useState(getTags());

    function handleSubmit() {
        if (!name.trim()) return;
        createTag(name.trim());
        setTags(getTags());
        setName("");
    }

    return (
        <main className="page-shell">
            <h1 className="stack-title">Create tag</h1>
            <div className="card">
                <input
                    className="stack-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tag name..."
                />
                <button className="stack-button" onClick={handleSubmit} style={{ marginTop: "10px" }}>
                    Add tag
                </button>
            </div>
            <div className="card">
                {tags.map((tag) => (
                    <span className="tag-pill" key={tag.id}>#{tag.name}</span>
                ))}
            </div>
        </main>
    );
}

export default CreateTagPage;
