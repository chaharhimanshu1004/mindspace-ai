import { apiClient } from "@/lib/api-client";
import type { MemoryListPage } from "../memory.types";

interface Args {
    limit?: number;
    cursor?: string;
    sourceType?: string;
}

const buildQuery = (args: Args): string => {
    const params = new URLSearchParams();
    if (args.limit !== undefined) params.set("limit", String(args.limit));
    if (args.cursor) params.set("cursor", args.cursor);
    if (args.sourceType) params.set("sourceType", args.sourceType);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
};

export const listMemoriesApi = (args: Args = {}): Promise<MemoryListPage> =>
    apiClient<MemoryListPage>({
        method: "GET",
        path: `/memories${buildQuery(args)}`,
        auth: true,
    });
