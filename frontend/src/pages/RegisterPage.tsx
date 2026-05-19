import { type SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService.ts";

function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            setMessage("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }

        try {
            await register({ username, email, password, phone: phone.trim() || undefined });
            setMessage(`Registration successful! You can now login.`);
        
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Registration failed.");
        }
    };

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <p>Create an account to ask, answer, vote, and manage your profile.</p>

                <input
                    className="question-form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                <input
                    className="question-form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    className="question-form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <input
                    className="question-form-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (e.g. +40700111222)"
                />
                <p className="form-hint">
                    Optional. Required to receive SMS if your account is banned.
                </p>

                <input
                    className="question-form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />

                <button className="ask-button" type="submit">
                    Register
                </button>
                
                {message && (
                    <span
                        className="empty-state"
                        style={{
                            color: message.includes("successful") ? "green" : "red",
                        }}
                    >
                        {message}
                    </span>
                )}

                <p style={{ marginTop: "20px", textAlign: "center" }}>
                    Already have an account?{" "}
                    <a
                        href="/login"
                        style={{
                            color: "#0066cc",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Login here
                    </a>
                </p>
            </form>
        </main>
    );
}

export default RegisterPage;
