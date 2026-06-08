import { pool } from "../db/postgres";
import type { DirtyBucket } from "../schemas/slack-rollup-state.types";

export class SlackRollupStateModel {
    public static async findDirtyBuckets(timezone: string): Promise<DirtyBucket[]> {
        const { rows } = await pool.query<DirtyBucket>(
            `SELECT DISTINCT
                e."userId" AS "userId",
                e."channelId" AS "channelId",
                to_char(DATE(to_timestamp(e."messageTs"::float) AT TIME ZONE $1), 'YYYY-MM-DD') AS "day"
             FROM slack_raw_events e
             LEFT JOIN slack_rollup_state s
                ON s."userId" = e."userId"
               AND s."channelId" = e."channelId"
               AND s."day" = DATE(to_timestamp(e."messageTs"::float) AT TIME ZONE $1)
             WHERE s."lastBuiltAt" IS NULL
                OR e."receivedAt" > s."lastBuiltAt"`,
            [timezone],
        );
        return rows;
    }

    public static async upsert(args: {
        userId: number;
        channelId: string;
        day: string;
    }): Promise<void> {
        await pool.query(
            `INSERT INTO slack_rollup_state ("userId", "channelId", "day", "lastBuiltAt")
             VALUES ($1, $2, $3::date, NOW())
             ON CONFLICT ("userId", "channelId", "day")
             DO UPDATE SET "lastBuiltAt" = NOW()`,
            [args.userId, args.channelId, args.day],
        );
    }
}
