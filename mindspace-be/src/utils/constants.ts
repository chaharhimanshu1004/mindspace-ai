export const GOOGLE_OAUTH = {
    TOKEN_URL: "https://oauth2.googleapis.com/token",
    AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
    REVOKE_URL: "https://oauth2.googleapis.com/revoke",
    CALENDAR_SCOPE: "https://www.googleapis.com/auth/calendar.events",
};

export const GOOGLE_SIGNIN = {
    SCOPE: "openid email profile",
    USERINFO_URL: "https://www.googleapis.com/oauth2/v2/userinfo",
};

export const SLACK_OAUTH = {
    AUTH_URL: "https://slack.com/oauth/v2/authorize",
    TOKEN_URL: "https://slack.com/api/oauth.v2.access",
    REVOKE_URL: "https://slack.com/api/auth.revoke",
    BOT_SCOPES: ["channels:read", "channels:history", "users:read", "team:read"].join(","),
};
