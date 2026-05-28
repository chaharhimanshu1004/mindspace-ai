export interface Memory {
    id: string;
    content: string;
    title: string | null;
    summary: string | null;
    topics: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface MemoryListPage {
    items: Memory[];
    nextCursor: string | null;
}
