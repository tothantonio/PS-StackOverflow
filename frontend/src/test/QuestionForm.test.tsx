import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import QuestionForm from "../features/qa/components/QuestionForm.tsx";
import { createTag, getTags } from "../services/tagService.ts";

vi.mock("../services/tagService.ts", () => ({
    getTags: vi.fn(),
    createTag: vi.fn(),
}));

const mockTags = [
    { id: 1, name: "react" },
    { id: 2, name: "java" },
];

describe("QuestionForm", () => {
    beforeEach(() => {
        vi.mocked(getTags).mockResolvedValue(mockTags);
        vi.mocked(createTag).mockImplementation(async (name) => ({
            id: 99,
            name: name.trim().toLowerCase(),
        }));
    });

    test("lets the user choose an existing tag", async () => {
        const user = userEvent.setup();
        const onTagsChange = vi.fn();

        render(
            <QuestionForm
                title=""
                body=""
                tags=""
                picture=""
                onTitleChange={vi.fn()}
                onBodyChange={vi.fn()}
                onTagsChange={onTagsChange}
                onPictureChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        await waitFor(() => expect(getTags).toHaveBeenCalled());

        await user.type(screen.getByPlaceholderText("Start typing a tag name..."), "re");
        await user.click(await screen.findByRole("button", { name: "#react" }));

        expect(onTagsChange).toHaveBeenCalledWith("react");
    });

    test("shows create tag action when the tag does not exist", async () => {
        const user = userEvent.setup();
        const onTagsChange = vi.fn();

        vi.mocked(createTag).mockResolvedValue({ id: 3, name: "vite" });
        vi.mocked(getTags)
            .mockResolvedValueOnce(mockTags)
            .mockResolvedValueOnce([...mockTags, { id: 3, name: "vite" }]);

        render(
            <QuestionForm
                title=""
                body=""
                tags=""
                picture=""
                onTitleChange={vi.fn()}
                onBodyChange={vi.fn()}
                onTagsChange={onTagsChange}
                onPictureChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        await waitFor(() => expect(getTags).toHaveBeenCalled());

        await user.type(screen.getByPlaceholderText("Start typing a tag name..."), "vite");
        await user.click(screen.getByRole("button", { name: 'Create tag "#vite"' }));

        await waitFor(() => {
            expect(onTagsChange).toHaveBeenCalledWith("vite");
        });
    });
});
