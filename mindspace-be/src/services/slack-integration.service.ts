import { IntegrationModel } from "../models/integration.model";
import { SlackSubscriptionModel } from "../models/slack-subscription.model";
import { buildAuthUrl, exchangeCode, parseOAuthState, revokeToken } from "../connectors/slack-oauth.connector";
import { integrationNotFoundError } from "../errors/integration-errors";
import { encryptCredentials, decryptCredentials } from "../utils/credentials.cipher";
import type { IntegrationProvider, SlackCredentials } from "../schemas/integration.types";

const PROVIDER: IntegrationProvider = "slack";

const toSlackCreds = (raw: unknown): SlackCredentials =>
    decryptCredentials<SlackCredentials>(raw as string);

export class SlackIntegrationService {
    public static getAuthUrl(userId: number): string {
        return buildAuthUrl(userId);
    }

    public static async handleCallback(args: { code: string; state: string }): Promise<void> {
        const { userId } = parseOAuthState(args.state);
        const tokens = await exchangeCode(args.code);
        const plain: SlackCredentials = {
            accessToken: tokens.accessToken,
            teamId: tokens.teamId,
            botUserId: tokens.botUserId,
        };
        const credentials = encryptCredentials(plain);
        await IntegrationModel.upsert({ userId, provider: PROVIDER, credentials });
    }

    public static async disconnect(userId: number): Promise<void> {
        const integration = await IntegrationModel.findByUserAndProvider({ userId, provider: PROVIDER });
        if (!integration) throw integrationNotFoundError();

        const creds = toSlackCreds(integration.credentials);
        await revokeToken(creds.accessToken).catch(() => {});
        await SlackSubscriptionModel.deleteAllForUser(userId);
        await IntegrationModel.delete({ userId, provider: PROVIDER });
    }

    public static async getAccessToken(userId: number): Promise<string> {
        const integration = await IntegrationModel.findByUserAndProvider({ userId, provider: PROVIDER });
        if (!integration) throw integrationNotFoundError();
        const creds = toSlackCreds(integration.credentials);
        return creds.accessToken;
    }
}
