export interface SlackWebhookUrlVerification {
    type: "url_verification";
    token: string;
    challenge: string;
}

export interface SlackMessageEvent {
    type: "message";
    subtype?: string;
    user?: string;
    bot_id?: string;
    text?: string;
    ts: string;
    thread_ts?: string;
    channel: string;
    channel_type?: string;
}

export interface SlackEventCallback {
    type: "event_callback";
    team_id: string;
    event_id: string;
    event_time: number;
    event: SlackMessageEvent;
}

export type SlackWebhookBody = SlackWebhookUrlVerification | SlackEventCallback;
