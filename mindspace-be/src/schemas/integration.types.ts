export type IntegrationProvider = "google_calendar" | "slack";

export interface PublicIntegration {
    provider: IntegrationProvider;
    connected: boolean;
}

export interface GoogleCalendarCredentials {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    timezone: string;
}

export interface SlackCredentials {
    accessToken: string;
    teamId: string;
    botUserId: string;
}
