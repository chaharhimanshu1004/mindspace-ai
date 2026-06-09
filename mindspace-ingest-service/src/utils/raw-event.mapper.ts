import type { SlackMessageRaw } from "../connectors/slack-api.connector";
import type { SlackRawEventRow } from "../schemas/slack-raw-event.types";

export const rawEventToSlackMessage = (row: SlackRawEventRow): SlackMessageRaw => ({
    type: "message",
    subtype: row.subtype ?? undefined,
    user: row.userSlackId ?? undefined,
    bot_id: row.botId ?? undefined,
    text: row.text,
    ts: row.messageTs,
    thread_ts: row.threadTs ?? undefined,
});
