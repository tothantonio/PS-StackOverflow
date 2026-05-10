import type { UserDto } from "../features/qa/types/userTypes.ts";
import userData from "../features/qa/mockData/user.json";

export function getCurrentUser(): UserDto {
    return userData as UserDto;
}
