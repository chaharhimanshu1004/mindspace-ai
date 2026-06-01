import { apiClient } from "@/lib/api-client";

export const deleteMemoryApi = (id: string): Promise<void> =>
    apiClient<void>({
        method: "DELETE",
        path: `/memories/${id}`,
        auth: true,
    });
