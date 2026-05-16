import { type SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../services/authService.ts";

function LoginPage(){
    const navigate = useNavigate();
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); //previne refreshul automat al browserului

        try {
            const data = await login({username,password});//apeleaza login asteapta raspuns pune raspuns in rez

            setMessage(`Logged in as ${data.user.username}.`);
            window.dispatchEvent(new Event("auth-change"));
            navigate("/questions");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Login failed.");
        }
    };
    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <p>Sign in to ask, answer, vote, and manage your profile.</p>

                <input
                    className="question-form-input"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="Username"
                />

                <input
                    className="question-form-input"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button className="ask-button" type="submit">Login</button>
                {message && <span className="empty-state">{message}</span>}

                <p style={{ marginTop: "20px", textAlign: "center" }}>
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        style={{
                            color: "#0066cc",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Register here
                    </a>
                </p>
            </form>
        </main>
    );
}

export default LoginPage;

