export interface ChatSource {
    memoryId: string;
    title: string | null;
    content: string;
    cited: boolean;
    createdAt: string;
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
    content: string;
    sources: ChatSource[];
    createdAt: string;
}

export interface ChatHistoryPage {
    items: ChatHistoryItem[];
    nextCursor: string | null;
}
