import {
    fetchChannelHistory,
    fetchThreadReplies,
    type SlackMessageRaw,
} from "../connectors/slack-api.connector";

interface FetchSinceArgs {
    accessToken: string;
    channelId: string;
    oldest: string;
}

interface FetchResult {
    parents: SlackMessageRaw[];
    repliesByThreadTs: Map<string, SlackMessageRaw[]>;
}

const collectThreadParents = (messages: SlackMessageRaw[]): SlackMessageRaw[] =>
    messages.filter((m) => m.thread_ts && m.thread_ts === m.ts && (m.reply_count ?? 0) > 0);

export class SlackSyncFetchService {
    public static async fetchSince(args: FetchSinceArgs): Promise<FetchResult> {
        const parents = await fetchChannelHistory({
            accessToken: args.accessToken,
            channelId: args.channelId,
            oldest: args.oldest,
        });

        const repliesByThreadTs = new Map<string, SlackMessageRaw[]>();
        const threadParents = collectThreadParents(parents);

        for (const parent of threadParents) {
            const replies = await fetchThreadReplies({
                accessToken: args.accessToken,
                channelId: args.channelId,
                threadTs: parent.ts,
            });
            repliesByThreadTs.set(parent.ts, replies);
        }

        return { parents, repliesByThreadTs };
    }
}
