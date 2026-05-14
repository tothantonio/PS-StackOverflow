import { Link } from "react-router-dom";
import { getQuestions } from "../services/questionService.ts";
import { getCurrentUser } from "../services/userService.ts";

function ProfilePage() {
    const user = getCurrentUser();
    const userQuestions = getQuestions().filter((question) => question.author.id === user.id);
    const totalVotes = userQuestions.reduce((sum, question) => sum + question.voteCount, 0);

    return (
        <main className="details-page">
            <header className="profile-header">
                <div className="profile-avatar">{user.username.slice(0, 2).toUpperCase()}</div>
                <div>
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
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
                <div className="profile-stat">
                    <strong>mock</strong>
                    <span>account</span>
                </div>
            </section>

            <section className="profile-panel">
                <h2>My activity</h2>
                {userQuestions.length === 0 ? (
                    <p className="empty-state">You have not posted questions yet.</p>
                ) : (
                    <div className="profile-question-list">
                        {userQuestions.map((question) => (
                            <Link key={question.id} to={`/questions/${question.id}`} className="profile-question-link">
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
