import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getQuestions } from "../services/questionService.ts";
import { getTags } from "../services/tagService.ts";
import { getCurrentUser } from "../services/userService.ts";
import { isLoggedIn } from "../services/authService.ts";

import type { QuestionDto } from "../features/qa/types/questionTypes.ts";
import type { TagDto } from "../features/qa/types/tagTypes.ts";

function HomePage() {
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [tags, setTags] = useState<TagDto[]>([]);

    const loggedIn = isLoggedIn();
    const currentUser = loggedIn ? getCurrentUser() : undefined;

    useEffect(() => {
        async function load() {
            try {
                const [q, t] = await Promise.all([
                    getQuestions(),
                    getTags(),
                ]);

                setQuestions(q);
                setTags(t);
            } catch (error) {
                console.error("Failed to load home data:", error);
            }
        }

        load();
    }, []);

    const myQuestionsCount = currentUser
        ? questions.filter(q => q.author?.id === currentUser.id).length
        : 0;

    return (
        <main className="home-page">
            <section className="home-hero">
                <div>
                    <h1>StackOverflow</h1>
                    <p>
                        Browse questions, write answers, edit your posts, and organize topics with tags.
                    </p>
                </div>

                <div className="home-actions">
                    <Link to="/questions" className="ask-button">
                        View questions
                    </Link>

                    {loggedIn ? (
                        <Link to="/ask" className="ask-button">
                            Ask question
                        </Link>
                    ) : (
                        <Link to="/login" className="ask-button">
                            Login to ask
                        </Link>
                    )}
                </div>
            </section>

            <section className="home-grid">
                <Link to="/questions" className="home-card">
                    <strong>{questions.length}</strong>
                    <span>Questions</span>
                </Link>

                {loggedIn && (
                    <Link to="/my-questions" className="home-card">
                        <strong>{myQuestionsCount}</strong>
                        <span>My questions</span>
                    </Link>
                )}

                <Link to="/tags" className="home-card">
                    <strong>{tags.length}</strong>
                    <span>Tags</span>
                </Link>
            </section>
        </main>
    );
}

export default HomePage;