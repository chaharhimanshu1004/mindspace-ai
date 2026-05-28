export interface PublicMemory {
    id: string;
    content: string;
    title: string | null;
    summary: string | null;
    topics: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemoryListPage {
    items: PublicMemory[];
    nextCursor: string | null;
}
