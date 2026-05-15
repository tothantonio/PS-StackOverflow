import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import QuestionForm from "../features/qa/components/QuestionForm.tsx";

describe("QuestionForm", () => {
    beforeEach(() => {
        localStorage.clear();
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

        await user.type(screen.getByPlaceholderText("Start typing a tag name..."), "re");
        await user.click(screen.getByRole("button", { name: "#react" }));

        expect(onTagsChange).toHaveBeenCalledWith("react");
    });

    test("shows create tag action when the tag does not exist", async () => {
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

        await user.type(screen.getByPlaceholderText("Start typing a tag name..."), "vite");
        await user.click(screen.getByRole("button", { name: 'Create tag "#vite"' }));

        expect(onTagsChange).toHaveBeenCalledWith("vite");
    });
});
