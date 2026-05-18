import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { QuestionDto } from "../features/qa/types/questionTypes.ts";

import { getQuestions } from "../services/questionService.ts";
import { isLoggedIn, logout } from "../services/authService.ts";
import ProfileContactForm from "../features/profile/ProfileContactForm.tsx";
import ModeratorPanel from "../features/moderation/ModeratorPanel.tsx";
import { getCurrentUser, isModerator } from "../services/userService.ts";

function ProfilePage() {
    const navigate = useNavigate();

    const user = getCurrentUser();
    const loggedIn = isLoggedIn();

    const [userQuestions, setUserQuestions] = useState<QuestionDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadQuestions() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const questions = await getQuestions();

                const filteredQuestions = questions.filter(
                    (question) => question.author?.id === user.id
                );

                setUserQuestions(filteredQuestions);
            } catch (error) {
                console.error("Failed to load questions:", error);
            } finally {
                setLoading(false);
            }
        }

        loadQuestions();
    }, [user]);

    if (!user) {
        return (
            <main className="details-page">
                <h1>User not found</h1>

                <Link to="/login" className="ask-button">
                    Login
                </Link>
            </main>
        );
    }

    const totalVotes = userQuestions.reduce(
        (sum, question) => sum + (question.voteCount ?? 0),
        0
    );

    return (
        <main className="details-page">
            <header className="profile-header">
                <div className="profile-avatar">
                    {user.username.slice(0, 2).toUpperCase()}
                </div>

                <div>
                    <h1>{user.username}</h1>

                    <p>
                        {loggedIn ? (
                            <>
                                {user.email}
                                {user.phone ? ` · ${user.phone}` : " · No phone on file"}
                            </>
                        ) : (
                            "You are not logged in."
                        )}
                    </p>

                    {loggedIn ? (
                        <button
                            className="danger-button profile-logout"
                            onClick={() => {
                                logout();

                                window.dispatchEvent(
                                    new Event("auth-change")
                                );

                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="ask-button profile-logout"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </header>

            <section className="profile-grid">
                <div className="profile-stat">
                    <strong>{userQuestions.length}</strong>
                    <span>questions</span>
                </div>

                <div className="profile-stat">
                    <strong>{totalVotes}</strong>
                    <span>votes</span>
                </div>
            </section>

            {loggedIn && <ProfileContactForm />}

            {isModerator() && <ModeratorPanel />}

            <section className="profile-panel">
                <h2>My activity</h2>

                {loading ? (
                    <p className="empty-state">
                        Loading questions...
                    </p>
                ) : userQuestions.length === 0 ? (
                    <p className="empty-state">
                        You have not posted questions yet.
                    </p>
                ) : (
                    <div className="profile-question-list">
                        {userQuestions.map((question) => (
                            <Link
                                key={question.id}
                                to={`/questions/${question.id}`}
                                className="profile-question-link"
                            >
                                {question.title}
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ProfilePage;