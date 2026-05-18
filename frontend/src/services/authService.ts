import type { UserDto } from "../features/qa/types/userTypes.ts";
import { clearCurrentUser, getCurrentUser, setCurrentUser } from "./userService.ts";

const API_URL = "http://localhost:8080/api/auth";
const AUTH_TOKEN_KEY = "stackoverflow_auth_token";

let authToken = sessionStorage.getItem(AUTH_TOKEN_KEY) ?? "";

function persistToken(token: string) {
    authToken = token;
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearToken() {
    authToken = "";
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

function mapUser(user: Record<string, unknown>): UserDto {
    return {
        id: Number(user.id),
        username: String(user.username),
        email: user.email ? String(user.email) : undefined,
        phone: user.phone ? String(user.phone) : undefined,
        score: user.score != null ? Number(user.score) : undefined,
        role: user.role === "MODERATOR" ? "MODERATOR" : "USER",
        isBanned: Boolean(user.isBanned),
    };
}

export async function login(data: { username: string; password: string }) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Login failed");
    }

    const result = await response.json();
    persistToken(result.token);
    setCurrentUser(mapUser(result.user));

    return result;
}

export async function register(data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
}) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Registration failed");
    }

    return response.json();
}

export function logout() {
    clearToken();
    clearCurrentUser();
}

export function isLoggedIn(): boolean {
    return Boolean(authToken);
}

export function isBannedUser(): boolean {
    if (!isLoggedIn()) {
        return false;
    }
    return Boolean(getCurrentUser().isBanned);
}
