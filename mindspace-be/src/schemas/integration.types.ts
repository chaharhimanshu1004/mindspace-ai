export type IntegrationProvider = "google_calendar";

export interface PublicIntegration {
    provider: IntegrationProvider;
    connected: boolean;
}

export interface GoogleCalendarCredentials {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}
