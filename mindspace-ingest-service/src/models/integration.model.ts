import { pool } from "../db/postgres";
import type { UserIntegrationRow } from "../schemas/slack-subscription.types";

export class IntegrationModel {
    public static async findByUserAndProvider(args: {
        userId: number;
        provider: string;
    }): Promise<UserIntegrationRow | null> {
        const { rows } = await pool.query<UserIntegrationRow>(
            `SELECT id, "userId", provider, credentials
             FROM user_integrations
             WHERE "userId" = $1 AND provider = $2
             LIMIT 1`,
            [args.userId, args.provider],
        );
        return rows[0] ?? null;
    }

    public static async findAllByProvider(provider: string): Promise<UserIntegrationRow[]> {
        const { rows } = await pool.query<UserIntegrationRow>(
            `SELECT id, "userId", provider, credentials
             FROM user_integrations
             WHERE provider = $1`,
            [provider],
        );
        return rows;
    }

    public static async findUserIdsByProvider(provider: string): Promise<number[]> {
        const { rows } = await pool.query<{ userId: number }>(
            `SELECT "userId" FROM user_integrations WHERE provider = $1`,
            [provider],
        );
        return rows.map((r) => r.userId);
    }
}
