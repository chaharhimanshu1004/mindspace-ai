import { slackApiError } from "../errors/integration-errors";

const SLACK_API = "https://slack.com/api";

interface SlackEnvelope<T> {
    ok: boolean;
    error?: string;
    response_metadata?: { next_cursor?: string };
}

interface ConversationsListResponse extends SlackEnvelope<unknown> {
    channels: SlackChannelRaw[];
}

interface ConversationsHistoryResponse extends SlackEnvelope<unknown> {
    messages: SlackMessageRaw[];
    has_more: boolean;
}

interface ConversationsRepliesResponse extends SlackEnvelope<unknown> {
    messages: SlackMessageRaw[];
    has_more: boolean;
}

interface UsersListResponse extends SlackEnvelope<unknown> {
    members: SlackUserRaw[];
}

export interface SlackChannelRaw {
    id: string;
    name: string;
    is_archived: boolean;
    is_member: boolean;
    is_private: boolean;
    num_members?: number;
    topic?: { value: string };
    purpose?: { value: string };
}

export interface SlackMessageRaw {
    type: string;
    subtype?: string;
    user?: string;
    bot_id?: string;
    text: string;
    ts: string;
    thread_ts?: string;
    reply_count?: number;
    parent_user_id?: string;
}

export interface SlackUserRaw {
    id: string;
    name: string;
    deleted?: boolean;
    is_bot?: boolean;
    profile?: {
        real_name?: string;
        display_name?: string;
    };
}

const callJson = async <T extends SlackEnvelope<unknown>>(
    url: string,
    accessToken: string,
): Promise<T> => {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=utf-8",
        },
    });

    if (!res.ok) throw slackApiError(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    if (!data.ok) throw slackApiError(data.error ?? "unknown");
    return data;
};

const buildUrl = (path: string, params: Record<string, string>): string => {
    const qs = new URLSearchParams(params).toString();
    return `${SLACK_API}/${path}?${qs}`;
};

export const listPublicChannels = async (accessToken: string): Promise<SlackChannelRaw[]> => {
    const all: SlackChannelRaw[] = [];
    let cursor: string | undefined;

    do {
        const params: Record<string, string> = {
            types: "public_channel",
            exclude_archived: "true",
            limit: "200",
        };
        if (cursor) params.cursor = cursor;

        const data = await callJson<ConversationsListResponse>(
            buildUrl("conversations.list", params),
            accessToken,
        );

        all.push(...data.channels);
        cursor = data.response_metadata?.next_cursor || undefined;
    } while (cursor);

    return all;
};

interface FetchHistoryArgs {
    accessToken: string;
    channelId: string;
    oldest?: string;
}

export const fetchChannelHistory = async (
    args: FetchHistoryArgs,
): Promise<SlackMessageRaw[]> => {
    const all: SlackMessageRaw[] = [];
    let cursor: string | undefined;

    do {
        const params: Record<string, string> = {
            channel: args.channelId,
            limit: "200",
        };
        if (args.oldest) {
            params.oldest = args.oldest;
            params.inclusive = "false";
        }
        if (cursor) params.cursor = cursor;

        const data = await callJson<ConversationsHistoryResponse>(
            buildUrl("conversations.history", params),
            args.accessToken,
        );

        all.push(...data.messages);
        cursor = data.response_metadata?.next_cursor || undefined;
    } while (cursor);

    return all.sort((a, b) => Number(a.ts) - Number(b.ts));
};

interface FetchRepliesArgs {
    accessToken: string;
    channelId: string;
    threadTs: string;
}

export const fetchThreadReplies = async (
    args: FetchRepliesArgs,
): Promise<SlackMessageRaw[]> => {
    const all: SlackMessageRaw[] = [];
    let cursor: string | undefined;

    do {
        const params: Record<string, string> = {
            channel: args.channelId,
            ts: args.threadTs,
            limit: "200",
        };
        if (cursor) params.cursor = cursor;

        const data = await callJson<ConversationsRepliesResponse>(
            buildUrl("conversations.replies", params),
            args.accessToken,
        );

        all.push(...data.messages);
        cursor = data.response_metadata?.next_cursor || undefined;
    } while (cursor);

    return all.sort((a, b) => Number(a.ts) - Number(b.ts));
};

export const listWorkspaceUsers = async (accessToken: string): Promise<SlackUserRaw[]> => {
    const all: SlackUserRaw[] = [];
    let cursor: string | undefined;

    do {
        const params: Record<string, string> = { limit: "200" };
        if (cursor) params.cursor = cursor;

        const data = await callJson<UsersListResponse>(
            buildUrl("users.list", params),
            accessToken,
        );

        all.push(...data.members);
        cursor = data.response_metadata?.next_cursor || undefined;
    } while (cursor);

    return all;
};
