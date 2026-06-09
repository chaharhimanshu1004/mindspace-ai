import { pool } from "../db/postgres";
import type { SlackSubscriptionRow } from "../schemas/slack-subscription.types";

export class SlackSubscriptionModel {
    public static async findActiveForUser(userId: number): Promise<SlackSubscriptionRow[]> {
        const { rows } = await pool.query<SlackSubscriptionRow>(
            `SELECT id, "userId", "channelId", "channelName", active
             FROM slack_channel_subscriptions
             WHERE "userId" = $1 AND active = true
             ORDER BY "channelName" ASC`,
            [userId],
        );
        return rows;
    }

    public static async findByUserAndChannel(args: {
        userId: number;
        channelId: string;
    }): Promise<SlackSubscriptionRow | null> {
        const { rows } = await pool.query<SlackSubscriptionRow>(
            `SELECT id, "userId", "channelId", "channelName", active
             FROM slack_channel_subscriptions
             WHERE "userId" = $1 AND "channelId" = $2
             LIMIT 1`,
            [args.userId, args.channelId],
        );
        return rows[0] ?? null;
    }
}
