import { apiClient } from "@/lib/api-client";
import type { AuthSession } from "../auth.types";

interface Args {
    email: string;
    password: string;
}

export const signupApi = (args: Args): Promise<AuthSession> =>
    apiClient<AuthSession>({
        method: "POST",
        path: "/auth/signup",
        body: args,
    });
