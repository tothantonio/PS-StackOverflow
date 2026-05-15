import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import AnswersForm from "../features/qa/components/AnswersForm.tsx";

describe("AnswersForm", () => {
    test("shows an error when the answer is empty", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(<AnswersForm questionId={10} onSubmit={onSubmit} />);

        await user.click(screen.getByRole("button", { name: "Post your answer" }));

        expect(screen.getByText("Answer text is required.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test("submits a valid answer", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(<AnswersForm questionId={10} onSubmit={onSubmit} />);

        await user.type(
            screen.getByPlaceholderText(/write a focused answer/i),
            "This is a detailed answer with enough text."
        );
        await user.click(screen.getByRole("button", { name: "Post your answer" }));

        expect(onSubmit).toHaveBeenCalledWith({
            questionId: 10,
            body: "This is a detailed answer with enough text.",
            picture: undefined,
        });
    });
});
