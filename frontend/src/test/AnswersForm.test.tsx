import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import AnswersForm from "../features/qa/components/AnswersForm.tsx";

describe("AnswersForm", () => {
    test("shows an error when the answer is too short", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(<AnswersForm questionId={10} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText(/write a focused answer/i), "too short");
        await user.click(screen.getByRole("button", { name: "Post your answer" }));

        expect(screen.getByText("Your answer should include at least 20 characters.")).toBeInTheDocument();
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
        await user.type(
            screen.getByPlaceholderText("Picture URL, starting with http:// or https://"),
            "https://example.com/answer.png"
        );
        await user.click(screen.getByRole("button", { name: "Post your answer" }));

        expect(onSubmit).toHaveBeenCalledWith({
            questionId: 10,
            body: "This is a detailed answer with enough text.",
            picture: "https://example.com/answer.png",
        });
    });
});
