import type { SlackMessageRaw } from "../connectors/slack-api.connector";
import type { SlackUserResolver } from "../services/slack-user-resolver.service";

const SYSTEM_SUBTYPES = new Set([
    "channel_join",
    "channel_leave",
    "channel_topic",
    "channel_purpose",
    "channel_name",
    "channel_archive",
    "channel_unarchive",
    "pinned_item",
    "unpinned_item",
    "bot_add",
    "bot_remove",
    "tombstone",
]);

export const isSystemMessage = (msg: SlackMessageRaw): boolean => {
    if (msg.subtype && SYSTEM_SUBTYPES.has(msg.subtype)) return true;
    if (msg.subtype === "bot_message") return true;
    if (msg.bot_id) return true;
    return false;
};

export const isHumanMessage = (msg: SlackMessageRaw, resolver: SlackUserResolver): boolean => {
    if (!msg.user) return false;
    if (msg.bot_id) return false;
    if (msg.subtype === "bot_message") return false;
    if (resolver.isBot(msg.user)) return false;
    if (isSystemMessage(msg)) return false;
    return true;
};

export const formatTranscriptLine = (
    msg: SlackMessageRaw,
    resolver: SlackUserResolver,
): string => {
    const author = resolver.displayNameFor(msg.user);
    const text = resolver.decode(msg.text || "").trim();
    return `${author}: ${text}`;
};

export const formatTranscript = (
    messages: SlackMessageRaw[],
    resolver: SlackUserResolver,
): string =>
    messages
        .filter((m) => !isSystemMessage(m))
        .map((m) => formatTranscriptLine(m, resolver))
        .join("\n\n");

export const countHumans = (
    messages: SlackMessageRaw[],
    resolver: SlackUserResolver,
): number => {
    const set = new Set<string>();
    for (const m of messages) {
        if (isHumanMessage(m, resolver) && m.user) set.add(m.user);
    }
    return set.size;
};
