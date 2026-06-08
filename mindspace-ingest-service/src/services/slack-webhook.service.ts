import { SlackRawEventModel } from "../models/slack-raw-event.model";
import { SlackIntegrationService } from "./slack-integration.service";
import type { SlackEventCallback, SlackMessageEvent } from "../schemas/slack-webhook.types";

interface IngestResult {
    ingested: boolean;
    reason?: string;
}

const isMessageEvent = (e: SlackMessageEvent): boolean => e.type === "message";

const isIngestibleMessage = (e: SlackMessageEvent): boolean => {
    if (!isMessageEvent(e)) return false;
    if (e.subtype === "message_changed") return false;
    if (e.subtype === "message_deleted") return false;
    return true;
};

export class SlackWebhookService {
    public static async ingestEvent(callback: SlackEventCallback): Promise<IngestResult> {
        const event = callback.event;

        if (!isIngestibleMessage(event)) {
            return { ingested: false, reason: "not_ingestible" };
        }

        const resolved = await SlackIntegrationService.resolveByTeamId(callback.team_id);
        if (!resolved) {
            return { ingested: false, reason: "unmapped_team" };
        }

        const result = await SlackRawEventModel.insertIfNew({
            userId: resolved.userId,
            teamId: callback.team_id,
            channelId: event.channel,
            messageTs: event.ts,
            threadTs: event.thread_ts ?? null,
            userSlackId: event.user ?? null,
            botId: event.bot_id ?? null,
            subtype: event.subtype ?? null,
            text: event.text ?? "",
            rawPayload: callback as unknown as Record<string, unknown>,
            sourceMethod: "webhook",
        });

        return { ingested: result.inserted, reason: result.inserted ? undefined : "duplicate" };
    }
}
