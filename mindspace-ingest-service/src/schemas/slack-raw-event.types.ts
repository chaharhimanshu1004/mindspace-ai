export interface SlackRawEventRow {
    id: string;
    userId: number;
    teamId: string | null;
    channelId: string;
    messageTs: string;
    threadTs: string | null;
    userSlackId: string | null;
    botId: string | null;
    subtype: string | null;
    text: string;
    rawPayload: Record<string, unknown>;
    receivedAt: Date;
    sourceMethod: "webhook" | "backfill";
}

export interface InsertRawEventInput {
    userId: number;
    teamId: string | null;
    channelId: string;
    messageTs: string;
    threadTs: string | null;
    userSlackId: string | null;
    botId: string | null;
    subtype: string | null;
    text: string;
    rawPayload: Record<string, unknown>;
    sourceMethod: "webhook" | "backfill";
}
