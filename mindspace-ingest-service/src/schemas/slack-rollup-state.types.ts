export interface SlackRollupStateRow {
    userId: number;
    channelId: string;
    day: string;
    lastBuiltAt: Date;
}

export interface DirtyBucket {
    userId: number;
    channelId: string;
    day: string;
}
