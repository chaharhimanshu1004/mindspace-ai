import { apiClient } from "@/lib/api-client";
import type { ChatHistoryPage } from "../chat.types";

interface Args {
    limit?: number;
    cursor?: string;
}

export const historyApi = (args: Args = {}): Promise<ChatHistoryPage> => {
    const params = new URLSearchParams();
    if (args.limit !== undefined) params.set("limit", String(args.limit));
    if (args.cursor) params.set("cursor", args.cursor);
    const qs = params.toString();
    return apiClient<ChatHistoryPage>({
        method: "GET",
        path: `/chat/history${qs ? `?${qs}` : ""}`,
        auth: true,
    });
};
