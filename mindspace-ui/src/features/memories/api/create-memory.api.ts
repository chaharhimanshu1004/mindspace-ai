import { apiClient } from "@/lib/api-client";
import type { Memory } from "../memory.types";

interface Args {
    content: string;
}

export const createMemoryApi = (args: Args): Promise<Memory> =>
    apiClient<Memory>({
        method: "POST",
        path: "/memories",
        body: args,
        auth: true,
    });
