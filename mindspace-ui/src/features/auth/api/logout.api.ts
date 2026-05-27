import { apiClient } from "@/lib/api-client";

export const logoutApi = (): Promise<void> =>
    apiClient<void>({ method: "POST", path: "/auth/logout", auth: true });
