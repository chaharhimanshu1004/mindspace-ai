import { apiClient } from "@/lib/api-client";
import type { AuthSession } from "../auth.types";

interface Args {
    email: string;
    password: string;
}

export const loginApi = (args: Args): Promise<AuthSession> =>
    apiClient<AuthSession>({
        method: "POST",
        path: "/auth/login",
        body: args,
    });
