import { apiClient } from "@/lib/api-client";
import type { PublicUser } from "../auth.types";

export const verifySessionApi = (): Promise<PublicUser> =>
    apiClient<PublicUser>({ path: "/auth/verify-session", auth: true });
