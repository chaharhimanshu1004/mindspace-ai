export type IntegrationProvider = "google_calendar" | "slack";

export interface SlackCredentials {
    accessToken: string;
    teamId: string;
    botUserId: string;
}
