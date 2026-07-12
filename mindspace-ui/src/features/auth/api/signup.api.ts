import { apiClient } from "@/lib/api-client";
import type { OtpPending } from "../auth.types";

interface Args {
    email: string;
    password: string;
}

export const signupApi = (args: Args): Promise<OtpPending> =>
    apiClient<OtpPending>({
        method: "POST",
        path: "/auth/signup",
        body: args,
    });
