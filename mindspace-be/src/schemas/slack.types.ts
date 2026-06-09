export interface SlackChannelListing {
    channelId: string;
    channelName: string;
    memberCount: number | null;
    topic: string | null;
    purpose: string | null;
    isMember: boolean;
    subscribed: boolean;
}

export interface SlackSubscriptionPublic {
    channelId: string;
    channelName: string;
    active: boolean;
    createdAt: string;
}
