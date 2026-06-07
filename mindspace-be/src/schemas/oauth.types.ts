export type OAuthScope = "memories:read" | "memories:write";

export interface OAuthClientPublic {
    clientId: string;
    name: string;
    scopes: OAuthScope[];
}

export interface OAuthTokenPayload {
    userId: number;
    clientId: string;
    scopes: OAuthScope[];
    tokenId: number;
}
