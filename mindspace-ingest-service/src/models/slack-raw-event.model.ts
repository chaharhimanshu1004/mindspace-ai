import { pool } from "../db/postgres";
import type { InsertRawEventInput, SlackRawEventRow } from "../schemas/slack-raw-event.types";

interface InsertResult {
    inserted: boolean;
}

export class SlackRawEventModel {
    public static async insertIfNew(input: InsertRawEventInput): Promise<InsertResult> {
        const { rows } = await pool.query<{ id: string }>(
            `INSERT INTO slack_raw_events (
                "userId", "teamId", "channelId", "messageTs", "threadTs",
                "userSlackId", "botId", subtype, text, "rawPayload",
                "receivedAt", "sourceMethod"
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11)
             ON CONFLICT ("userId", "channelId", "messageTs") DO NOTHING
             RETURNING id`,
            [
                input.userId,
                input.teamId,
                input.channelId,
                input.messageTs,
                input.threadTs,
                input.userSlackId,
                input.botId,
                input.subtype,
                input.text,
                JSON.stringify(input.rawPayload),
                input.sourceMethod,
            ],
        );
        return { inserted: rows.length > 0 };
    }

    public static async findForBucket(args: {
        userId: number;
        channelId: string;
        day: string;
        timezone: string;
    }): Promise<SlackRawEventRow[]> {
        const { rows } = await pool.query<SlackRawEventRow>(
            `SELECT
                id,
                "userId",
                "teamId",
                "channelId",
                "messageTs",
                "threadTs",
                "userSlackId",
                "botId",
                subtype,
                text,
                "rawPayload",
                "receivedAt",
                "sourceMethod"
             FROM slack_raw_events
             WHERE "userId" = $1
               AND "channelId" = $2
               AND DATE(to_timestamp("messageTs"::float) AT TIME ZONE $4) = $3::date
             ORDER BY "messageTs" ASC`,
            [args.userId, args.channelId, args.day, args.timezone],
        );
        return rows;
    }
}
