export const SLACK_OAUTH = {
    AUTH_URL: "https://slack.com/oauth/v2/authorize",
    TOKEN_URL: "https://slack.com/api/oauth.v2.access",
    REVOKE_URL: "https://slack.com/api/auth.revoke",
    BOT_SCOPES: ["channels:read", "channels:history", "users:read", "team:read"].join(","),
};
