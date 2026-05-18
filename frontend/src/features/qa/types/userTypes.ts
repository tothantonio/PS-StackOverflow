export type UserRole = "USER" | "MODERATOR";

export type UserDto = {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    score?: number;
    role?: UserRole;
    isBanned?: boolean;
};

