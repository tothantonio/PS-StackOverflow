import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../services/authService.ts";

type MainLayoutProps = {
    children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());

    useEffect(() => {
        function handleAuthChange() {
            setLoggedIn(isLoggedIn());
        }

        window.addEventListener("auth-change", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    function handleLogout() {
        logout();
        setLoggedIn(false);
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    }

    return (
        <>
            <header className="site-header">
                <div className="site-header-inner">
                    <Link to="/" className="site-logo">
                        <span className="site-logo-mark">stack</span>
                        <span className="site-logo-word">mock</span>
                    </Link>
                    <Link to="/questions" className="back-link">
                        Questions
                    </Link>
                    <Link to="/my-questions" className="back-link">
                        My Questions
                    </Link>
                    <Link to="/tags" className="back-link">
                        Tags
                    </Link>
                    <Link to="/ask" className="ask-button">
                        Ask
                    </Link>
                    <div className="topbar-actions">
                        {loggedIn ? (
                            <button className="topbar-login" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="topbar-login">
                                Login
                            </Link>
                        )}
                        <Link to="/profile" className="topbar-account">
                            My Account
                        </Link>
                    </div>
                </div>
            </header>

            <div className="app-shell">
                <aside className="left-nav">
                    <Link to="/" className="left-nav-link">Home</Link>
                    <Link to="/questions" className="left-nav-link active">Questions</Link>
                    <Link to="/my-questions" className="left-nav-link">My Questions</Link>
                    <Link to="/tags" className="left-nav-link">Tags</Link>
                    <Link to="/profile" className="left-nav-link">My Profile</Link>
                </aside>
                <div className="app-content">
                    {children}
                </div>
            </div>
        </>
    );
}

export default MainLayout;

