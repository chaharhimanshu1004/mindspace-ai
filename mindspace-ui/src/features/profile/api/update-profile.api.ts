import { apiClient } from "@/lib/api-client";
import type { PublicUser } from "@/features/auth/auth.types";

export const updateProfileApi = (name: string): Promise<PublicUser> =>
    apiClient<PublicUser>({ method: "PATCH", path: "/profile", auth: true, body: { name } });
