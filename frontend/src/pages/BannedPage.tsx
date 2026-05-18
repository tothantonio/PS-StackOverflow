import { Link } from "react-router-dom";
import { logout } from "../services/authService.ts";

function BannedPage() {
    return (
        <main className="login-page">
            <section className="login-card banned-card">
                <h1>Account banned</h1>
                <p>
                    Your account has been banned from StackOverflow. You cannot use the
                    application until a moderator unbans you.
                </p>
                <p>
                    If you believe this is a mistake, contact a site moderator.
                </p>
                <button
                    type="button"
                    className="ask-button"
                    onClick={() => {
                        logout();
                        window.dispatchEvent(new Event("auth-change"));
                    }}
                >
                    Back to login
                </button>
                <p style={{ marginTop: "20px", textAlign: "center" }}>
                    <Link to="/login" className="back-link">
                        Login page
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default BannedPage;
