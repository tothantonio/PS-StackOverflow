import type { UserDto } from "../features/qa/types/userTypes.ts";

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

let currentUser: UserDto = testUsers[0];

export function setCurrentUser(user: UserDto): void {
    currentUser = user;
}

export function clearCurrentUser(): void {
    currentUser = testUsers[0];
}

export function getCurrentUser(): UserDto {
    return currentUser;
}

export function updateCurrentUserScore(score: number): void {
    currentUser = { ...currentUser, score };
}

export function findTestUser(username: string, password: string): TestUser | undefined {
    return testUsers.find(
        (user) => user.username === username.trim() && user.password === password
    );
}
