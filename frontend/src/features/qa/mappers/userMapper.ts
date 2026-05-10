import type {UserDto} from "../types/userTypes.ts";

export function mapUser(dto: UserDto) {
    return{
        id:dto.id,
        username:dto.username,
        email:dto.email,
    }

}