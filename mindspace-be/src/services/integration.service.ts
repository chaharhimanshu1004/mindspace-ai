import { IntegrationModel } from "../models/integration.model";
import { buildAuthUrl, exchangeCode, refreshAccessToken, revokeToken } from "../connectors/google-oauth.connector";
import { integrationNotFoundError } from "../errors/integration-errors";
import type { GoogleCalendarCredentials, IntegrationProvider, PublicIntegration } from "../schemas/integration.types";

const PROVIDER: IntegrationProvider = "google_calendar";

const toGoogleCreds = (raw: unknown): GoogleCalendarCredentials =>
    raw as GoogleCalendarCredentials;

export class IntegrationService {
    public static getGoogleAuthUrl(userId: number): string {
        return buildAuthUrl(String(userId));
    }

    public static async handleGoogleCallback(args: { code: string; userId: number }): Promise<void> {
        const tokens = await exchangeCode(args.code);
        const credentials: GoogleCalendarCredentials = {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt.toISOString(),
        };
        await IntegrationModel.upsert({ userId: args.userId, provider: PROVIDER, credentials });
    }

    public static async disconnect(userId: number): Promise<void> {
        const integration = await IntegrationModel.findByUserAndProvider({ userId, provider: PROVIDER });
        if (!integration) throw integrationNotFoundError();

        const creds = toGoogleCreds(integration.credentials);
        await revokeToken(creds.accessToken).catch(() => {});
        await IntegrationModel.delete({ userId, provider: PROVIDER });
    }

    public static async listForUser(userId: number): Promise<PublicIntegration[]> {
        const rows = await IntegrationModel.findAllByUser(userId);
        const connectedProviders = new Set(rows.map((r) => r.provider));

        const all: IntegrationProvider[] = [PROVIDER];
        return all.map((p) => ({ provider: p, connected: connectedProviders.has(p) }));
    }

    public static async getFreshAccessToken(userId: number): Promise<string> {
        const integration = await IntegrationModel.findByUserAndProvider({ userId, provider: PROVIDER });
        if (!integration) throw integrationNotFoundError();

        const creds = toGoogleCreds(integration.credentials);
        const expiresAt = new Date(creds.expiresAt);

        if (expiresAt.getTime() > Date.now() + 60_000) {
            return creds.accessToken;
        }

        const refreshed = await refreshAccessToken(creds.refreshToken);
        const updated: GoogleCalendarCredentials = {
            ...creds,
            accessToken: refreshed.accessToken,
            expiresAt: refreshed.expiresAt.toISOString(),
        };
        await IntegrationModel.updateCredentials({ userId, provider: PROVIDER, credentials: updated });
        return refreshed.accessToken;
    }
}
