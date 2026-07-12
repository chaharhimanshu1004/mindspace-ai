import { env } from "../config/env";
import { GOOGLE_OAUTH, GOOGLE_SIGNIN } from "../utils/constants";
import { googleAuthError } from "../errors/auth-errors";

interface GoogleTokens {
    accessToken: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    name: string | null;
    picture: string | null;
}

export const buildSigninUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_SIGNIN_REDIRECT_URI,
        response_type: "code",
        scope: GOOGLE_SIGNIN.SCOPE,
        access_type: "offline",
        prompt: "select_account",
        state,
    });
    return `${GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
};

export const exchangeSigninCode = async (code: string): Promise<GoogleTokens> => {
    const res = await fetch(GOOGLE_OAUTH.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_SIGNIN_REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    if (!res.ok) throw googleAuthError();

    const data = await res.json() as { access_token: string };
    return { accessToken: data.access_token };
};

export const fetchGoogleUser = async (accessToken: string): Promise<GoogleUserInfo> => {
    const res = await fetch(GOOGLE_SIGNIN.USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw googleAuthError();

    const data = await res.json() as {
        id?: string;
        email?: string;
        verified_email?: boolean;
        name?: string;
        picture?: string;
    };

    if (!data.id || !data.email) throw googleAuthError();
    if (!data.verified_email) throw googleAuthError();

    return {
        id: data.id,
        email: data.email,
        name: data.name ?? null,
        picture: data.picture ?? null,
    };
};
