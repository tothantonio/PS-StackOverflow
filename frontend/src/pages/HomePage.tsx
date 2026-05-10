import { Link } from "react-router-dom";

function HomePage() {
    return (
        <main className="page-shell">
            <section className="card">
                <h1 className="stack-title">PS StackOverflow</h1>
                <p className="muted">A small questions and answers application.</p>
                <Link className="stack-button" to="/questions" style={{ textDecoration: "none" }}>
                    View questions
                </Link>
            </section>
        </main>
    );
}

export default HomePage;
