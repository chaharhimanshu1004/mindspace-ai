export interface ChatSource {
    memoryId: string;
    title: string | null;
    content: string | null;
    cited: boolean;
    createdAt: string;
    deleted?: boolean;
}

export interface ChatAnswer {
    messageId: string;
    answer: string;
    sources: ChatSource[];
    createdAt: string;
}

export interface ChatHistoryItem {
    id: string;
    role: "user" | "assistant";
    content: string | null;
    sources: ChatSource[];
    createdAt: string;
    allSourcesDeleted?: boolean;
    hasActiveSources?: boolean;
}

export interface ChatHistoryPage {
    items: ChatHistoryItem[];
    nextCursor: string | null;
}
