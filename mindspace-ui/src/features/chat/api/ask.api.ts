import { apiClient } from "@/lib/api-client";
import type { ChatAnswer } from "../chat.types";

interface Args {
    message: string;
}

export const askApi = (args: Args): Promise<ChatAnswer> =>
    apiClient<ChatAnswer>({
        method: "POST",
        path: "/chat/ask",
        body: args,
        auth: true,
    });
