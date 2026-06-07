import type { SlackMessageRaw } from "../connectors/slack-api.connector";
import type { SlackUserResolver } from "./slack-user-resolver.service";
import type { SlackSession } from "../schemas/slack-session.types";
import { SLACK_SYNC } from "../utils/constants";
import { tsToIstDate } from "../utils/slack-time";
import { countHumans, formatTranscript, isSystemMessage } from "../utils/slack-transcript";

interface BuildArgs {
    channelId: string;
    resolver: SlackUserResolver;
    parents: SlackMessageRaw[];
    repliesByThreadTs: Map<string, SlackMessageRaw[]>;
}

const buildThreadSession = (
    channelId: string,
    threadTs: string,
    messages: SlackMessageRaw[],
    resolver: SlackUserResolver,
): SlackSession | null => {
    const ordered = messages.slice().sort((a, b) => Number(a.ts) - Number(b.ts));
    const content = formatTranscript(ordered, resolver);
    if (content.length < SLACK_SYNC.NOISE_GATE_CHARS) return null;

    const humanCount = countHumans(ordered, resolver);
    if (humanCount < SLACK_SYNC.NOISE_GATE_HUMAN_COUNT) return null;

    return {
        sourceRef: `${channelId}:thread:${threadTs}`,
        kind: "thread",
        content,
        oldestTs: ordered[0].ts,
        newestTs: ordered[ordered.length - 1].ts,
        messageCount: ordered.length,
        humanCount,
    };
};

const buildDaySession = (
    channelId: string,
    day: string,
    messages: SlackMessageRaw[],
    resolver: SlackUserResolver,
): SlackSession | null => {
    const ordered = messages.slice().sort((a, b) => Number(a.ts) - Number(b.ts));
    const content = formatTranscript(ordered, resolver);
    if (content.length < SLACK_SYNC.NOISE_GATE_CHARS) return null;

    const humanCount = countHumans(ordered, resolver);
    if (humanCount < SLACK_SYNC.NOISE_GATE_HUMAN_COUNT) return null;

    return {
        sourceRef: `${channelId}:day:${day}`,
        kind: "day",
        content,
        oldestTs: ordered[0].ts,
        newestTs: ordered[ordered.length - 1].ts,
        messageCount: ordered.length,
        humanCount,
    };
};

const groupNonThreadByDay = (
    messages: SlackMessageRaw[],
): Map<string, SlackMessageRaw[]> => {
    const byDay = new Map<string, SlackMessageRaw[]>();
    for (const m of messages) {
        if (m.thread_ts) continue;
        if (isSystemMessage(m)) continue;
        const day = tsToIstDate(m.ts);
        const arr = byDay.get(day) ?? [];
        arr.push(m);
        byDay.set(day, arr);
    }
    return byDay;
};

const isThreadParent = (m: SlackMessageRaw): boolean =>
    Boolean(m.thread_ts && m.thread_ts === m.ts);

export class SlackSessionBuilder {
    public static build(args: BuildArgs): SlackSession[] {
        const sessions: SlackSession[] = [];

        for (const parent of args.parents) {
            if (!isThreadParent(parent)) continue;
            const replies = args.repliesByThreadTs.get(parent.ts) ?? [parent];
            const sess = buildThreadSession(args.channelId, parent.ts, replies, args.resolver);
            if (sess) sessions.push(sess);
        }

        const byDay = groupNonThreadByDay(args.parents);
        for (const [day, msgs] of byDay.entries()) {
            const sess = buildDaySession(args.channelId, day, msgs, args.resolver);
            if (sess) sessions.push(sess);
        }

        return sessions.sort((a, b) => Number(a.oldestTs) - Number(b.oldestTs));
    }
}
