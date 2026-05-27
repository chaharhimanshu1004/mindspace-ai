export interface PublicUser {
    id: number;
    email: string;
    createdAt: Date;
}

export interface AuthSession {
    token: string;
    expiresAt: Date;
    user: PublicUser;
}

export interface JwtPayload {
    sub: number;
    jti: number;
    iat?: number;
    exp?: number;
}

export interface AuthContext {
    userId: number;
    tokenId: number;
}
