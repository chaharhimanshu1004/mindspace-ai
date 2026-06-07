import { SlackSubscriptionModel } from "../models/slack-subscription.model";
import { slackSubscriptionNotFoundError } from "../errors/integration-errors";
import type { SlackSubscriptionPublic } from "../schemas/slack.types";

interface SubscribeArgs {
    userId: number;
    channelId: string;
    channelName: string;
}

const toPublic = (row: {
    channelId: string;
    channelName: string;
    active: boolean;
    createdAt: Date;
}): SlackSubscriptionPublic => ({
    channelId: row.channelId,
    channelName: row.channelName,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
});

export class SlackSubscriptionService {
    public static async subscribe(args: SubscribeArgs): Promise<SlackSubscriptionPublic> {
        const row = await SlackSubscriptionModel.upsert(args);
        return toPublic(row);
    }

    public static async unsubscribe(args: { userId: number; channelId: string }): Promise<void> {
        const existing = await SlackSubscriptionModel.findByUserAndChannel(args);
        if (!existing || !existing.active) throw slackSubscriptionNotFoundError();
        await SlackSubscriptionModel.deactivate(args);
    }

    public static async listActive(userId: number): Promise<SlackSubscriptionPublic[]> {
        const rows = await SlackSubscriptionModel.findActiveForUser(userId);
        return rows.map(toPublic);
    }

    public static async listActiveChannelIds(userId: number): Promise<Set<string>> {
        const rows = await SlackSubscriptionModel.findActiveForUser(userId);
        return new Set(rows.map((r) => r.channelId));
    }
}
