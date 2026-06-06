import { apiClient } from "@/lib/api-client";

export interface MemorySource {
    key: string;
    label: string;
    sortOrder: number;
}

export const listSourcesApi = (): Promise<MemorySource[]> =>
    apiClient<MemorySource[]>({ method: "GET", path: "/memories/sources", auth: true });
