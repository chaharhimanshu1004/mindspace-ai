import { IntegrationModel } from "../models/integration.model";
import { integrationNotFoundError } from "../errors/integration-errors";
import { decryptCredentials } from "../utils/credentials.cipher";
import type { SlackCredentials } from "../schemas/integration.types";

const PROVIDER = "slack";

interface ResolvedSlackUser {
    userId: number;
    accessToken: string;
}

export class SlackIntegrationService {
    public static async getAccessToken(userId: number): Promise<string> {
        const integration = await IntegrationModel.findByUserAndProvider({
            userId,
            provider: PROVIDER,
        });
        if (!integration) throw integrationNotFoundError();
        const creds = decryptCredentials<SlackCredentials>(integration.credentials);
        return creds.accessToken;
    }

    public static async resolveByTeamId(teamId: string): Promise<ResolvedSlackUser | null> {
        const rows = await IntegrationModel.findAllByProvider(PROVIDER);
        for (const row of rows) {
            try {
                const creds = decryptCredentials<SlackCredentials>(row.credentials);
                if (creds.teamId === teamId) {
                    return { userId: row.userId, accessToken: creds.accessToken };
                }
            } catch {
                continue;
            }
        }
        return null;
    }
}
