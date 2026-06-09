import { env } from "../config/env";
import { SlackRawEventModel } from "../models/slack-raw-event.model";
import { SlackRollupStateModel } from "../models/slack-rollup-state.model";
import { SlackSubscriptionModel } from "../models/slack-subscription.model";
import { SlackIntegrationService } from "./slack-integration.service";
import { SlackUserResolver } from "./slack-user-resolver.service";
import { SlackSessionBuilder } from "./slack-session.builder";
import { BeInternalConnector } from "../connectors/be-internal.connector";
import { rawEventToSlackMessage } from "../utils/raw-event.mapper";
import { tsToIsoString } from "../utils/slack-time";
import type { DirtyBucket } from "../schemas/slack-rollup-state.types";
import type { SlackSession } from "../schemas/slack-session.types";

interface BucketRollupResult {
    userId: number;
    channelId: string;
    day: string;
    sessions: number;
    created: number;
    updated: number;
    unchanged: number;
    skipped: number;
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

const groupEventsForBuilder = (rawMessages: ReturnType<typeof rawEventToSlackMessage>[]) => {
    const parents = rawMessages.filter((m) => !m.thread_ts || m.thread_ts === m.ts);
    const repliesByThreadTs = new Map<string, typeof rawMessages>();

    const byThread = new Map<string, typeof rawMessages>();
    for (const m of rawMessages) {
        if (!m.thread_ts) continue;
        const arr = byThread.get(m.thread_ts) ?? [];
        arr.push(m);
        byThread.set(m.thread_ts, arr);
    }
    for (const [tt, msgs] of byThread.entries()) {
        repliesByThreadTs.set(tt, msgs);
    }

    return { parents, repliesByThreadTs };
};

type ResolverCache = Map<number, Promise<SlackUserResolver>>;

const getOrLoadResolver = (
    cache: ResolverCache,
    userId: number,
): Promise<SlackUserResolver> => {
    const cached = cache.get(userId);
    if (cached) return cached;
    const loading = (async () => {
        const accessToken = await SlackIntegrationService.getAccessToken(userId);
        return SlackUserResolver.load(accessToken);
    })();
    cache.set(userId, loading);
    return loading;
};

export class SlackRollupService {
    private static async rollupBucket(
        bucket: DirtyBucket,
        resolverCache: ResolverCache,
    ): Promise<BucketRollupResult> {
        console.log("[rollup] rollupBucket START", bucket);

        const result: BucketRollupResult = {
            userId: bucket.userId,
            channelId: bucket.channelId,
            day: bucket.day,
            sessions: 0,
            created: 0,
            updated: 0,
            unchanged: 0,
            skipped: 0,
        };

        const subscription = await SlackSubscriptionModel.findByUserAndChannel({
            userId: bucket.userId,
            channelId: bucket.channelId,
        });
        console.log("[rollup] subscription lookup", {
            found: Boolean(subscription),
            active: subscription?.active ?? null,
        });
        if (!subscription || !subscription.active) {
            console.log("[rollup] EXIT: no active subscription");
            await SlackRollupStateModel.upsert(bucket);
            return result;
        }

        const rawEvents = await SlackRawEventModel.findForBucket({
            userId: bucket.userId,
            channelId: bucket.channelId,
            day: bucket.day,
            timezone: env.SLACK_DAY_TIMEZONE,
        });
        console.log("[rollup] findForBucket returned", { count: rawEvents.length });

        if (rawEvents.length === 0) {
            console.log("[rollup] EXIT: no raw events for bucket");
            await SlackRollupStateModel.upsert(bucket);
            return result;
        }

        const resolver = await getOrLoadResolver(resolverCache, bucket.userId);

        const rawMessages = rawEvents.map(rawEventToSlackMessage);
        const { parents, repliesByThreadTs } = groupEventsForBuilder(rawMessages);

        const sessions = SlackSessionBuilder.build({
            channelId: bucket.channelId,
            resolver,
            parents,
            repliesByThreadTs,
        });

        console.log("[rollup] builder returned sessions", { count: sessions.length });

        result.sessions = sessions.length;

        for (const session of sessions) {
            try {
                const response = await BeInternalConnector.upsertMemoryFromSource({
                    userId: bucket.userId,
                    sourceType: "slack",
                    sourceRef: session.sourceRef,
                    content: session.content,
                    sourceMeta: buildSourceMeta({
                        channelId: bucket.channelId,
                        channelName: subscription.channelName,
                        session,
                    }),
                });
                if (response.created) result.created += 1;
                else if (response.changed) result.updated += 1;
                else result.unchanged += 1;
            } catch (err) {
                result.skipped += 1;
                console.error("[rollup] BE upsert failed", {
                    userId: bucket.userId,
                    sourceRef: session.sourceRef,
                    err,
                });
                throw err;
            }
        }

        await SlackRollupStateModel.upsert(bucket);
        return result;
    }

    public static async sync(): Promise<BucketRollupResult[]> {
        const dirtyBuckets = await SlackRollupStateModel.findDirtyBuckets(
            env.SLACK_DAY_TIMEZONE,
        );
        if (dirtyBuckets.length === 0) return [];

        const resolverCache: ResolverCache = new Map();
        const results: BucketRollupResult[] = [];
        for (const bucket of dirtyBuckets) {
            try {
                const r = await SlackRollupService.rollupBucket(bucket, resolverCache);
                results.push(r);
            } catch (err) {
                console.error("[rollup] bucket failed", { bucket, err });
            }
        }
        return results;
    }

    public static async runForUser(userId: number): Promise<BucketRollupResult[]> {
        const dirtyBuckets = await SlackRollupStateModel.findDirtyBuckets(
            env.SLACK_DAY_TIMEZONE,
        );
        const filtered = dirtyBuckets.filter((b) => b.userId === userId);
        if (filtered.length === 0) return [];

        const resolverCache: ResolverCache = new Map();
        const results: BucketRollupResult[] = [];
        for (const bucket of filtered) {
            try {
                const r = await SlackRollupService.rollupBucket(bucket, resolverCache);
                results.push(r);
            } catch (err) {
                console.error("[rollup] bucket failed (per-user)", { bucket, err });
            }
        }
        return results;
    }
}
