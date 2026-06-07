import { SlackCursorModel } from "../models/slack-cursor.model";
import { SlackSubscriptionModel } from "../models/slack-subscription.model";
import { SlackIntegrationService } from "./slack-integration.service";
import { SlackUserResolver } from "./slack-user-resolver.service";
import { SlackSyncFetchService } from "./slack-sync-fetch.service";
import { SlackSyncPersistService } from "./slack-sync-persist.service";
import { SlackSessionBuilder } from "./slack-session.builder";
import { SLACK_SYNC } from "../utils/constants";

interface SyncSubscriptionArgs {
    userId: number;
    accessToken: string;
    resolver: SlackUserResolver;
    subscription: {
        id: number;
        channelId: string;
        channelName: string;
    };
}

interface SyncSummary {
    channelId: string;
    fetched: number;
    sessions: number;
    created: number;
    updated: number;
    unchanged: number;
}

const initialOldest = (): string => {
    const ms = Date.now() - SLACK_SYNC.BACKFILL_DAYS * 24 * 60 * 60 * 1000;
    return (ms / 1000).toFixed(6);
};

const computeOldest = async (subscriptionId: number): Promise<string> => {
    const cursor = await SlackCursorModel.findBySubscription(subscriptionId);
    if (cursor?.lastMessageTs) return cursor.lastMessageTs;
    return initialOldest();
};

const maxTs = (a: string, b: string): string => (Number(a) > Number(b) ? a : b);

const nowTs = (): string => (Date.now() / 1000).toFixed(6);

export class SlackSyncService {
    private static async syncSubscription(args: SyncSubscriptionArgs): Promise<SyncSummary> {
        const oldest = await computeOldest(args.subscription.id);

        const { parents, repliesByThreadTs } = await SlackSyncFetchService.fetchSince({
            accessToken: args.accessToken,
            channelId: args.subscription.channelId,
            oldest,
        });

        const sessions = SlackSessionBuilder.build({
            channelId: args.subscription.channelId,
            resolver: args.resolver,
            parents,
            repliesByThreadTs,
        });

        const persisted = await SlackSyncPersistService.persistSessions({
            userId: args.userId,
            channelId: args.subscription.channelId,
            channelName: args.subscription.channelName,
            sessions,
        });

        let newCursor = oldest;
        for (const m of parents) newCursor = maxTs(newCursor, m.ts);
        for (const replies of repliesByThreadTs.values()) {
            for (const r of replies) newCursor = maxTs(newCursor, r.ts);
        }

        const finalCursor = newCursor === oldest ? nowTs() : newCursor;
        await SlackCursorModel.upsert({
            subscriptionId: args.subscription.id,
            lastMessageTs: finalCursor,
        });

        return {
            channelId: args.subscription.channelId,
            fetched: parents.length,
            sessions: sessions.length,
            ...persisted,
        };
    }

    public static async runForUser(userId: number): Promise<SyncSummary[]> {
        const subs = await SlackSubscriptionModel.findActiveForUser(userId);
        if (subs.length === 0) return [];

        const accessToken = await SlackIntegrationService.getAccessToken(userId);
        const resolver = await SlackUserResolver.load(accessToken);

        const summaries: SyncSummary[] = [];
        for (const sub of subs) {
            try {
                const summary = await SlackSyncService.syncSubscription({
                    userId,
                    accessToken,
                    resolver,
                    subscription: {
                        id: sub.id,
                        channelId: sub.channelId,
                        channelName: sub.channelName,
                    },
                });
                summaries.push(summary);
            } catch (err) {
                console.error("Slack sync subscription failed", {
                    userId,
                    channelId: sub.channelId,
                    err,
                });
            }
        }

        return summaries;
    }
}
