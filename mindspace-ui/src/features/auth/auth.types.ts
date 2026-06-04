export interface PublicUser {
    id: number;
    email: string;
    name: string | null;
    createdAt: string;
}

export interface AuthSession {
    token: string;
    expiresAt: string;
    user: PublicUser;
}
