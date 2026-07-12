import { apiClient } from "@/lib/api-client";
import type { AuthSession } from "../auth.types";

interface Args {
    tempToken: string;
    otp: string;
}

export const verifyOtpApi = (args: Args): Promise<AuthSession> =>
    apiClient<AuthSession>({
        method: "POST",
        path: "/auth/verify-otp",
        body: args,
    });
