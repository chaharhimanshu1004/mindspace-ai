import { OAuthModel } from "../models/oauth.model";
import { generateCode, generateToken, verifyCodeChallenge } from "../utils/pkce";
import {
    invalidClientError,
    invalidGrantError,
    invalidRedirectUriError,
    invalidScopeError,
} from "../errors/oauth-errors";
import type { OAuthClientPublic, OAuthScope } from "../schemas/oauth.types";

const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000;
const AUTH_CODE_TTL_MS = 5 * 60 * 1000;
const VALID_SCOPES: OAuthScope[] = ["memories:read", "memories:write"];

const parseScopes = (raw: string): OAuthScope[] => {
    const requested = raw.split(" ").filter(Boolean) as OAuthScope[];
    const invalid = requested.filter((s) => !VALID_SCOPES.includes(s));
    if (invalid.length) throw invalidScopeError();
    return requested;
};

export class OAuthService {
    public static async getClientForConsent(args: {
        clientId: string;
        redirectUri: string;
        scope: string;
    }): Promise<OAuthClientPublic> {
        const client = await OAuthModel.findClient(args.clientId);
        if (!client) throw invalidClientError();
        if (!client.redirectUris.includes(args.redirectUri)) throw invalidRedirectUriError();
        const scopes = parseScopes(args.scope);
        const disallowed = scopes.filter((s) => !client.scopes.includes(s));
        if (disallowed.length) throw invalidScopeError();
        return { clientId: client.clientId, name: client.name, scopes };
    }

    public static async issueAuthCode(args: {
        clientId: string;
        userId: number;
        redirectUri: string;
        scope: string;
        state: string;
        codeChallenge: string;
        codeChallengeMethod: "S256";
    }): Promise<{ redirectUrl: string }> {
        const client = await OAuthModel.findClient(args.clientId);
        if (!client) throw invalidClientError();
        if (!client.redirectUris.includes(args.redirectUri)) throw invalidRedirectUriError();

        const scopes = parseScopes(args.scope);
        const disallowed = scopes.filter((s) => !client.scopes.includes(s));
        if (disallowed.length) throw invalidScopeError();

        const code = generateCode();

        await OAuthModel.createAuthCode({
            code,
            clientId: args.clientId,
            userId: args.userId,
            redirectUri: args.redirectUri,
            scopes,
            codeChallenge: args.codeChallenge,
            expiresAt: new Date(Date.now() + AUTH_CODE_TTL_MS),
        });

        const url = new URL(args.redirectUri);
        url.searchParams.set("code", code);
        url.searchParams.set("state", args.state);
        return { redirectUrl: url.toString() };
    }

    public static async exchangeCode(args: {
        code: string;
        clientId: string;
        redirectUri: string;
        codeVerifier: string;
    }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
        const record = await OAuthModel.consumeAuthCode(args.code);
        if (!record) throw invalidGrantError();
        if (record.expiresAt < new Date()) throw invalidGrantError();
        if (record.clientId !== args.clientId) throw invalidGrantError();
        if (record.redirectUri !== args.redirectUri) throw invalidGrantError();
        if (!verifyCodeChallenge(args.codeVerifier, record.codeChallenge)) throw invalidGrantError();

        const accessToken = generateToken();
        const refreshToken = generateToken();
        const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);

        await OAuthModel.upsertToken({
            userId: record.userId,
            clientId: record.clientId,
            accessToken,
            refreshToken,
            scopes: record.scopes,
            expiresAt,
        });

        return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL_MS / 1000 };
    }

    public static async refreshToken(args: {
        refreshToken: string;
        clientId: string;
    }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
        const record = await OAuthModel.findByRefreshToken(args.refreshToken);
        if (!record || record.revokedAt || record.clientId !== args.clientId) throw invalidGrantError();

        const accessToken = generateToken();
        const newRefreshToken = generateToken();
        const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);

        await OAuthModel.upsertToken({
            userId: record.userId,
            clientId: record.clientId,
            accessToken,
            refreshToken: newRefreshToken,
            scopes: record.scopes,
            expiresAt,
        });

        return { accessToken, refreshToken: newRefreshToken, expiresIn: ACCESS_TOKEN_TTL_MS / 1000 };
    }

    public static async validateAccessToken(token: string) {
        const record = await OAuthModel.findByAccessToken(token);
        if (!record || record.revokedAt) throw invalidGrantError();
        if (record.expiresAt < new Date()) throw invalidGrantError();
        await OAuthModel.touchLastUsed(record.id);
        return record;
    }

    public static async revokeToken(userId: number, tokenId: number): Promise<void> {
        const record = await OAuthModel.listActiveTokensForUser(userId);
        const owns = record.find((t) => t.id === tokenId);
        if (!owns) throw invalidGrantError();
        await OAuthModel.revokeToken(tokenId);
    }

    public static async listTokens(userId: number) {
        return OAuthModel.listActiveTokensForUser(userId);
    }
}
