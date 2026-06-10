import { apiClient } from "@/lib/api-client";

export interface IntegrationStatus {
    provider: string;
    connected: boolean;
}

export const listIntegrationsApi = (): Promise<IntegrationStatus[]> =>
    apiClient<IntegrationStatus[]>({ method: "GET", path: "/integrations", auth: true });

export const disconnectGoogleCalendarApi = (): Promise<void> =>
    apiClient<void>({ method: "DELETE", path: "/integrations/google-calendar", auth: true });

export const disconnectSlackApi = (): Promise<void> =>
    apiClient<void>({ method: "DELETE", path: "/integrations/slack", auth: true });

export const disconnectTelegramApi = (): Promise<void> =>
    apiClient<void>({ method: "DELETE", path: "/integrations/telegram", auth: true });

export interface TelegramPairingResponse {
    token: string;
    link: string;
}

export const getTelegramPairingLinkApi = (): Promise<TelegramPairingResponse> =>
    apiClient<TelegramPairingResponse>({ method: "GET", path: "/integrations/telegram/connect", auth: true });
