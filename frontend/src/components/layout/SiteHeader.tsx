import { Link } from "react-router-dom";

function SiteHeader() {
    return (
        <header className="site-header">
            <Link to="/questions" className="site-logo">StackOverflow</Link>
            <nav className="site-nav">
                <Link to="/questions">Questions</Link>
                <Link to="/ask">Ask Question</Link>
                <Link to="/my-questions">My Questions</Link>
            </nav>
        </header>
    );
}

export default SiteHeader;
