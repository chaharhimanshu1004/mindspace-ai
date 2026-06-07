import { MemoryModel } from "../models/memory.model";
import { MemoryQueueService } from "./memoryQueue.service";
import type { SlackSession } from "../schemas/slack-session.types";
import { tsToIsoString } from "../utils/slack-time";

interface PersistArgs {
    userId: number;
    channelId: string;
    channelName: string;
    sessions: SlackSession[];
}

interface PersistResult {
    created: number;
    updated: number;
    unchanged: number;
}

const buildSourceMeta = (args: {
    channelId: string;
    channelName: string;
    session: SlackSession;
}) => ({
    channelId: args.channelId,
    channelName: args.channelName,
    kind: args.session.kind,
    oldestTs: args.session.oldestTs,
    newestTs: args.session.newestTs,
    oldestAt: tsToIsoString(args.session.oldestTs),
    newestAt: tsToIsoString(args.session.newestTs),
    messageCount: args.session.messageCount,
    humanCount: args.session.humanCount,
});

export class SlackSyncPersistService {
    public static async persistSessions(args: PersistArgs): Promise<PersistResult> {
        let created = 0;
        let updated = 0;
        let unchanged = 0;

        for (const session of args.sessions) {
            const result = await MemoryModel.upsertContentBySource({
                userId: args.userId,
                content: session.content,
                sourceType: "slack",
                sourceRef: session.sourceRef,
                sourceMeta: buildSourceMeta({
                    channelId: args.channelId,
                    channelName: args.channelName,
                    session,
                }),
            });

            if (result.created) created += 1;
            else if (result.changed) updated += 1;
            else unchanged += 1;

            if (result.changed) {
                try {
                    await MemoryQueueService.enqueueForEnrichment({
                        memoryId: result.id,
                        userId: args.userId,
                    });
                } catch (err) {
                    console.error("Failed to enqueue Slack memory", {
                        memoryId: result.id,
                        userId: args.userId,
                        err,
                    });
                }
            }
        }

        return { created, updated, unchanged };
    }
}
