import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import QuestionCard from "./QuestionCard.tsx";

describe("QuestionCard", () => {
    test("shows the question information", () => {
        render(
            <MemoryRouter>
                <QuestionCard
                    id={1}
                    title="How do I test React components?"
                    body="I want to add automatic tests."
                    author={{ id: 1, username: "alex" }}
                    tags={["react", "testing"]}
                    createdAt="2026-05-15T10:00:00.000Z"
                    status="IN_PROGRESS"
                    answerCount={2}
                    voteCount={5}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("link", { name: "How do I test React components?" })).toBeInTheDocument();
        expect(screen.getByText("I want to add automatic tests.")).toBeInTheDocument();
        expect(screen.getByText("#react")).toBeInTheDocument();
        expect(screen.getByText("#testing")).toBeInTheDocument();
        expect(screen.getByText("in progress")).toBeInTheDocument();
        expect(screen.getByText("alex")).toBeInTheDocument();
        expect(screen.getByText("answers")).toBeInTheDocument();
    });
});
