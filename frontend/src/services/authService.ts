import { clearCurrentUser, setCurrentUser } from "./userService.ts";

const API_URL = "http://localhost:8080/api/auth";

let authToken = "";

export async function login(data: { username: string; password: string }) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }

        const result = await response.json();
        authToken = result.token;
        setCurrentUser(result.user);

        return result;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Login failed");
    }
}

export async function register(data: { username: string; email: string; password: string }) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Registration failed");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Registration failed");
    }
}

export function getAuthToken(): string {
    return authToken;
}

export function logout() {
    authToken = "";
    clearCurrentUser();
}

export function isLoggedIn(): boolean {
    return Boolean(authToken);
}

export function requireLogin(): boolean {
    return isLoggedIn();
}

