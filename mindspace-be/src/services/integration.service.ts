import { IntegrationModel } from "../models/integration.model";
import { buildAuthUrl, exchangeCode, parseOAuthState, refreshAccessToken, revokeToken } from "../connectors/google-oauth.connector";
import { integrationNotFoundError } from "../errors/integration-errors";
import { encryptCredentials, decryptCredentials } from "../utils/credentials.cipher";
import type { GoogleCalendarCredentials, IntegrationProvider, PublicIntegration } from "../schemas/integration.types";

const PROVIDER: IntegrationProvider = "google_calendar";

const toGoogleCreds = (raw: unknown): GoogleCalendarCredentials =>
    decryptCredentials<GoogleCalendarCredentials>(raw as string);

export class IntegrationService {
    public static getGoogleAuthUrl(args: { userId: number; timezone: string }): string {
        return buildAuthUrl(args.userId, args.timezone);
    }

    public static async handleGoogleCallback(args: { code: string; state: string }): Promise<void> {
        const { userId, timezone } = parseOAuthState(args.state);
        const tokens = await exchangeCode(args.code);
        const plain: GoogleCalendarCredentials = {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt.toISOString(),
            timezone,
        };
        const credentials = encryptCredentials(plain);
        await IntegrationModel.upsert({ userId, provider: PROVIDER, credentials });
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

        const all: IntegrationProvider[] = ["google_calendar", "slack"];
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
        await IntegrationModel.updateCredentials({ userId, provider: PROVIDER, credentials: encryptCredentials(updated) });
        return refreshed.accessToken;
    }
}
