export interface SlackSubscriptionRow {
    id: number;
    userId: number;
    channelId: string;
    channelName: string;
    active: boolean;
}

export interface UserIntegrationRow {
    id: number;
    userId: number;
    provider: string;
    credentials: string;
}
