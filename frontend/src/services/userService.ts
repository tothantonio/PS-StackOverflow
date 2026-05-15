import type { UserDto } from "../features/qa/types/userTypes.ts";

const CURRENT_USER_KEY = "stackoverflow.currentUser";

export type TestUser = UserDto & {
    password: string;
};

export const testUsers: TestUser[] = [
    {
        id: 1,
        username: "alex",
        email: "alex@example.com",
        password: "alex123",
    },
    {
        id: 2,
        username: "maria",
        email: "maria@example.com",
        password: "maria123",
    },
];

export function setCurrentUser(user: UserDto): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): UserDto {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (!storedUser) {
        return testUsers[0];
    }

    try {
        return JSON.parse(storedUser) as UserDto;
    } catch {
        return testUsers[0];
    }
}

export function findTestUser(username: string, password: string): TestUser | undefined {
    return testUsers.find(
        (user) => user.username === username.trim() && user.password === password
    );
}
