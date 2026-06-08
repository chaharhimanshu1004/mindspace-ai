import { slackApiError } from "../errors/integration-errors";

const SLACK_API = "https://slack.com/api";

interface SlackEnvelope {
    ok: boolean;
    error?: string;
    response_metadata?: { next_cursor?: string };
}

interface UsersListResponse extends SlackEnvelope {
    members: SlackUserRaw[];
}

export interface SlackMessageRaw {
    type: string;
    subtype?: string;
    user?: string;
    bot_id?: string;
    text: string;
    ts: string;
    thread_ts?: string;
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
