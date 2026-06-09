import { apiClient } from "@/lib/api-client";

export interface SlackChannelListing {
    channelId: string;
    channelName: string;
    memberCount: number | null;
    topic: string | null;
    purpose: string | null;
    isMember: boolean;
    subscribed: boolean;
}

export interface SlackSubscription {
    channelId: string;
    channelName: string;
    active: boolean;
    createdAt: string;
}

export const listSlackChannelsApi = (): Promise<SlackChannelListing[]> =>
    apiClient<SlackChannelListing[]>({
        method: "GET",
        path: "/integrations/slack/channels",
        auth: true,
    });

export const listSlackSubscriptionsApi = (): Promise<SlackSubscription[]> =>
    apiClient<SlackSubscription[]>({
        method: "GET",
        path: "/integrations/slack/subscriptions",
        auth: true,
    });

export const subscribeSlackChannelApi = (args: {
    channelId: string;
    channelName: string;
}): Promise<SlackSubscription> =>
    apiClient<SlackSubscription>({
        method: "POST",
        path: "/integrations/slack/subscriptions",
        auth: true,
        body: args,
    });

export const unsubscribeSlackChannelApi = (channelId: string): Promise<void> =>
    apiClient<void>({
        method: "DELETE",
        path: `/integrations/slack/subscriptions/${encodeURIComponent(channelId)}`,
        auth: true,
    });
