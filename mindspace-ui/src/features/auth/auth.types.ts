export interface PublicUser {
    id: number;
    email: string;
    createdAt: string;
}

export interface AuthSession {
    token: string;
    expiresAt: string;
    user: PublicUser;
}
