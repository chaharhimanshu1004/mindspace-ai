import { apiClient } from "@/lib/api-client";

interface Args {
    tempToken: string;
}

export const resendOtpApi = (args: Args): Promise<void> =>
    apiClient<void>({
        method: "POST",
        path: "/auth/resend-otp",
        body: args,
    });
