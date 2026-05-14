import type { UserDto } from "../features/qa/types/userTypes.ts";

const currentUser: UserDto = {
    id: 1,
    username: "alex",
    email: "alex@example.com",
};

export function getCurrentUser(): UserDto {
    return currentUser;
}
