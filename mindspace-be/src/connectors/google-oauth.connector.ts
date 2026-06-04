import { env } from "../config/env";
import { oauthExchangeError, tokenRefreshError } from "../errors/integration-errors";
import { GOOGLE_OAUTH } from "../utils/constants";

interface RawTokens { accessToken: string; refreshToken: string; expiresAt: Date }
interface RefreshedToken { accessToken: string; expiresAt: Date }

export const buildAuthUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: GOOGLE_OAUTH.CALENDAR_SCOPE,
        access_type: "offline",
        prompt: "consent",
        state,
    });
    return `${GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
};

export const exchangeCode = async (code: string): Promise<RawTokens> => {
    const res = await fetch(GOOGLE_OAUTH.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    if (!res.ok) throw oauthExchangeError();

    const data = await res.json() as { access_token: string; refresh_token: string; expires_in: number };

    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
};

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshedToken> => {
    const res = await fetch(GOOGLE_OAUTH.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
        }),
    });

    if (!res.ok) throw tokenRefreshError();

    const data = await res.json() as { access_token: string; expires_in: number };

    return {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
};

export const revokeToken = async (token: string): Promise<void> => {
    await fetch(`${GOOGLE_OAUTH.REVOKE_URL}?token=${token}`, { method: "POST" });
};
