import type { UserDto } from "../features/qa/types/userTypes.ts";

const emptyUser: UserDto = { id: 0, username: "" };

let currentUser: UserDto = emptyUser;

export function setCurrentUser(user: UserDto): void {
    currentUser = user;
    sessionStorage.setItem("stackoverflow_user", JSON.stringify(user));
}

export function clearCurrentUser(): void {
    currentUser = emptyUser;
    sessionStorage.removeItem("stackoverflow_user");
}

export function getCurrentUser(): UserDto {
    const stored = sessionStorage.getItem("stackoverflow_user");
    if (stored) {
        try {
            currentUser = JSON.parse(stored) as UserDto;
        } catch {
            // keep in-memory fallback
        }
    }
    return currentUser;
}

export function updateCurrentUserScore(score: number): void {
    setCurrentUser({ ...getCurrentUser(), score });
}

export function isModerator(): boolean {
    return getCurrentUser().role === "MODERATOR";
}

export type ApiUser = UserDto & {
    isBanned?: boolean;
    role?: string;
};

export async function fetchAllUsers(): Promise<ApiUser[]> {
    const response = await fetch("http://localhost:8080/api/users");
    if (!response.ok) {
        throw new Error("Failed to load users");
    }
    return response.json();
}

export async function banUser(userId: number, moderatorId: number, reason: string): Promise<ApiUser> {
    const response = await fetch(
        `http://localhost:8080/api/users/${userId}/ban?moderatorId=${moderatorId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
        }
    );
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to ban user");
    }
    return response.json();
}

export async function fetchUserById(userId: number): Promise<ApiUser> {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to load user profile");
    }
    return response.json();
}

export async function updateProfile(
    userId: number,
    data: { email?: string; phone?: string }
): Promise<ApiUser> {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update profile");
    }
    return response.json();
}

export async function unbanUser(userId: number, moderatorId: number): Promise<ApiUser> {
    const response = await fetch(
        `http://localhost:8080/api/users/${userId}/unban?moderatorId=${moderatorId}`,
        { method: "POST" }
    );
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to unban user");
    }
    return response.json();
}
