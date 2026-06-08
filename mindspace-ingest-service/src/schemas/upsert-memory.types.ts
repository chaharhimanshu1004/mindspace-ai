export interface UpsertFromSourceRequest {
    userId: number;
    sourceType: string;
    sourceRef: string;
    content: string;
    sourceMeta: Record<string, unknown>;
}

export interface UpsertFromSourceResponse {
    memoryId: string;
    changed: boolean;
    created: boolean;
}
