import { slackApiError } from "../errors/integration-errors";

const SLACK_API = "https://slack.com/api";

interface SlackEnvelope {
    ok: boolean;
    error?: string;
    response_metadata?: { next_cursor?: string };
}

interface ConversationsListResponse extends SlackEnvelope {
    channels: SlackChannelRaw[];
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

const callJson = async <T extends SlackEnvelope>(
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
