export type SlackSessionKind = "thread" | "day";

export interface SlackSession {
    sourceRef: string;
    kind: SlackSessionKind;
    content: string;
    oldestTs: string;
    newestTs: string;
    messageCount: number;
    humanCount: number;
}
