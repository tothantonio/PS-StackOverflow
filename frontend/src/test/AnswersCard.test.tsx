import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import AnswersCard from "../features/qa/components/AnswersCard.tsx";
import type { AnswerDto } from "../features/qa/types/answerTypes.ts";

const answer: AnswerDto = {
    id: 7,
    questionId: 3,
    body: "Use React Testing Library to test what the user can see.",
    author: { id: 2, username: "maria" },
    createdAt: "2026-05-15T10:00:00.000Z",
    voteCount: 4,
    accepted: false,
};

describe("AnswersCard", () => {
    test("shows answer content and author", () => {
        render(
            <AnswersCard
                answer={answer}
                canEdit={false}
                canAccept={false}
                canVote={true}
                isSolved={false}
                onVote={vi.fn()}
                onDelete={vi.fn()}
                onAccept={vi.fn()}
                onEdit={vi.fn()}
            />
        );

        expect(screen.getByText("Use React Testing Library to test what the user can see.")).toBeInTheDocument();
        expect(screen.getByText("maria")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
    });

    test("calls accept when the author accepts an answer", async () => {
        const user = userEvent.setup();
        const onAccept = vi.fn();

        render(
            <AnswersCard
                answer={answer}
                canEdit={false}
                canAccept={true}
                canVote={true}
                isSolved={false}
                onVote={vi.fn()}
                onDelete={vi.fn()}
                onAccept={onAccept}
                onEdit={vi.fn()}
            />
        );

        await user.click(screen.getByRole("button", { name: "Accept answer" }));

        expect(onAccept).toHaveBeenCalledWith(7);
    });
});
