import { env } from "../config/env";
import { oauthExchangeError } from "../errors/integration-errors";
import { SLACK_OAUTH } from "../utils/constants";

interface SlackTokenResponse {
    ok: boolean;
    error?: string;
    access_token: string;
    scope: string;
    bot_user_id: string;
    team: { id: string; name: string };
    authed_user: { id: string };
}

interface ExchangedTokens {
    accessToken: string;
    scope: string;
    botUserId: string;
    teamId: string;
    teamName: string;
    authedUserId: string;
}

export const buildAuthUrl = (userId: number): string => {
    const params = new URLSearchParams({
        client_id: env.SLACK_CLIENT_ID,
        scope: SLACK_OAUTH.BOT_SCOPES,
        redirect_uri: env.SLACK_REDIRECT_URI,
        state: String(userId),
    });
    return `${SLACK_OAUTH.AUTH_URL}?${params.toString()}`;
};

export const parseOAuthState = (state: string): { userId: number } => {
    const userId = parseInt(state, 10);
    if (Number.isNaN(userId)) throw oauthExchangeError();
    return { userId };
};

export const exchangeCode = async (code: string): Promise<ExchangedTokens> => {
    const res = await fetch(SLACK_OAUTH.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: env.SLACK_CLIENT_ID,
            client_secret: env.SLACK_CLIENT_SECRET,
            redirect_uri: env.SLACK_REDIRECT_URI,
        }),
    });

    if (!res.ok) throw oauthExchangeError();

    const data = (await res.json()) as SlackTokenResponse;
    if (!data.ok || !data.access_token) throw oauthExchangeError();

    return {
        accessToken: data.access_token,
        scope: data.scope,
        botUserId: data.bot_user_id,
        teamId: data.team.id,
        teamName: data.team.name,
        authedUserId: data.authed_user.id,
    };
};

export const revokeToken = async (accessToken: string): Promise<void> => {
    await fetch(SLACK_OAUTH.REVOKE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
