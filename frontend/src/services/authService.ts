import { clearCurrentUser, findTestUser, setCurrentUser } from "./userService.ts";

let authToken = "";

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

    authToken = result.token;
    setCurrentUser(result.user);

    return result;
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

