import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">
                    StackOverflow
                </Link>

                <Link to="/questions">Questions</Link>
                <Link to="/my-questions">My Questions</Link>
            </div>

            <div className="navbar-right">
                <Link to="/questions/new" className="btn">
                    Ask Question
                </Link>

                <Link to="/tags/new">Create Tag</Link>

                <Link to="/login" className="login">
                    Login
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;

