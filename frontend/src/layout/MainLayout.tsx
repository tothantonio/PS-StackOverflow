import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../services/authService.ts";
//layout comun header/meniu/continut page
type MainLayoutProps = {
    children: ReactNode;  //pagina curenta
};

function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());

    function getNavClass(path: string) {
        const isActive = path === "/"
            ? location.pathname === "/"
            : location.pathname === path || location.pathname.startsWith(`${path}/`);

        return isActive ? "left-nav-link active" : "left-nav-link";
    }

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
                        <span className="site-logo-word">overflow</span>
                    </Link>
                    <Link to="/questions" className="back-link">
                        Questions
                    </Link>
                    {loggedIn && (
                        <Link to="/my-questions" className="back-link">
                            My Questions
                        </Link>
                    )}
                    <Link to="/tags" className="back-link">
                        Tags
                    </Link>
                    {loggedIn && (
                        <Link to="/ask" className="ask-button">
                            Ask
                        </Link>
                    )}
                    <div className="topbar-actions">
                        {loggedIn ? (
                            <button className="topbar-login" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/register" className="topbar-login">
                                    Register
                                </Link>
                                <Link to="/login" className="topbar-login">
                                    Login
                                </Link>
                            </>
                        )}
                        {loggedIn && (
                            <Link to="/profile" className="topbar-account">
                                My Account
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="app-shell">
                <aside className="left-nav">
                    <Link to="/" className={getNavClass("/")}>Home</Link>
                    <Link to="/questions" className={getNavClass("/questions")}>Questions</Link>
                    <Link to="/tags" className={getNavClass("/tags")}>Tags</Link>
                    {loggedIn && (
                        <>
                            <Link to="/my-questions" className={getNavClass("/my-questions")}>My Questions</Link>
                            <Link to="/profile" className={getNavClass("/profile")}>My Profile</Link>
                        </>
                    )}
                </aside>
                <div className="app-content">
                    {children}
                </div>
            </div>
        </>
    );
}

export default MainLayout;

