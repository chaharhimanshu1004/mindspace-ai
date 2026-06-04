import { apiClient } from "@/lib/api-client";

export interface IntegrationStatus {
    provider: string;
    connected: boolean;
}

export const listIntegrationsApi = (): Promise<IntegrationStatus[]> =>
    apiClient<IntegrationStatus[]>({ method: "GET", path: "/integrations", auth: true });

export const disconnectGoogleCalendarApi = (): Promise<void> =>
    apiClient<void>({ method: "DELETE", path: "/integrations/google-calendar", auth: true });
