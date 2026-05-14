import type { UserDto } from "../features/qa/types/userTypes.ts";

const CURRENT_USER_KEY = "stackmock.currentUser";

export type MockUser = UserDto & {
    password: string;
};

export const mockUsers: MockUser[] = [
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
        return mockUsers[0];
    }

    try {
        return JSON.parse(storedUser) as UserDto;
    } catch {
        return mockUsers[0];
    }
}

export function findMockUser(username: string, password: string): MockUser | undefined {
    return mockUsers.find(
        (user) => user.username === username.trim() && user.password === password
    );
}
