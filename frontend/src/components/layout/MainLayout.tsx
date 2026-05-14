import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type MainLayoutProps = {
    children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <header className="site-header">
                <div className="site-header-inner">
                    <button
                        className="sidebar-toggle"
                        type="button"
                        onClick={() => setIsSidebarOpen((current) => !current)}
                    >
                        Menu
                    </button>
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
                        <Link to="/login" className="topbar-login">
                            Login
                        </Link>
                        <Link to="/profile" className="topbar-account">
                            My Account
                        </Link>
                    </div>
                </div>
            </header>

            <div className={isSidebarOpen ? "app-shell" : "app-shell nav-collapsed"}>
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
