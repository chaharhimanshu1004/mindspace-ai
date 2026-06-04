import type { IntegrationProvider } from "../schemas/integration.types";

export const GOOGLE_OAUTH = {
    TOKEN_URL: "https://oauth2.googleapis.com/token",
    AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
    REVOKE_URL: "https://oauth2.googleapis.com/revoke",
    CALENDAR_SCOPE: "https://www.googleapis.com/auth/calendar.events",
};

export const INTEGRATION_CREDENTIAL_KEYS: Record<IntegrationProvider, string[]> = {
    google_calendar: ["accessToken", "refreshToken", "expiresAt"],
};
