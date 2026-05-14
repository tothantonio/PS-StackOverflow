import { Link } from "react-router-dom";
import { getQuestions } from "../services/questionService.ts";
import { getTags } from "../services/tagService.ts";

function HomePage() {
    const questions = getQuestions();
    const tags = getTags();

    return (
        <main className="home-page">
            <section className="home-hero">
                <div>
                    <h1>StackOverflow</h1>
                    <p>Browse mock questions, write answers, edit your posts, and organize topics with tags.</p>
                </div>
                <div className="home-actions">
                    <Link to="/questions" className="ask-button">
                        View questions
                    </Link>
                    <Link to="/ask" className="back-link">
                        Ask question
                    </Link>
                </div>
            </section>

            <section className="home-grid">
                <Link to="/questions" className="home-card">
                    <strong>{questions.length}</strong>
                    <span>Questions</span>
                </Link>
                <Link to="/my-questions" className="home-card">
                    <strong>Mine</strong>
                    <span>My questions</span>
                </Link>
                <Link to="/tags" className="home-card">
                    <strong>{tags.length}</strong>
                    <span>Tags</span>
                </Link>
            </section>
        </main>
    );
}

export default HomePage;

