import { clearCurrentUser, findTestUser, setCurrentUser } from "./userService.ts";

export async function login(data: { username: string; password: string }) {
    const user = findTestUser(data.username, data.password);

    if (!user) {
        throw new Error("Invalid username or password.");
    }

    const result = {
        token: `fake-token-${user.id}`,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };

    localStorage.setItem("token", result.token);
    setCurrentUser(result.user);

    return result;
}

export function logout() {
    localStorage.removeItem("token");
    clearCurrentUser();
}

export function isLoggedIn(): boolean {
    return Boolean(localStorage.getItem("token"));
}

export function requireLogin(): boolean {
    return isLoggedIn();
}

