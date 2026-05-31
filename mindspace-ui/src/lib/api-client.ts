import axios, { type AxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { ApiError } from "./api-error";

interface RequestArgs {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    body?: unknown;
    auth?: boolean;
}

export const apiClient = async <T>(args: RequestArgs): Promise<T> => {
    const config: AxiosRequestConfig = {
        method: args.method ?? "GET",
        url: `${env.apiUrl}${args.path}`,
        withCredentials: true,
        data: args.body,
    };

    try {
        const res = await axios<{ data?: T }>(config);

        return (res.data?.data as T) ?? (undefined as T);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status ?? 500;
            const body = err.response?.data as
                | { message?: string; code?: number; error?: unknown }
                | undefined;

            if (status === 401) {
                if (
                    typeof window !== "undefined" &&
                    window.location.pathname !== "/" &&
                    window.location.pathname !== "/login" &&
                    window.location.pathname !== "/signup"
                ) {
                    window.location.href = "/";
                }
            }

            throw new ApiError({
                status,
                code: String(body?.code ?? "UNKNOWN"),
                message: body?.message ?? "Something went wrong. Please try again.",
            });
        }

        throw err;
    }
};
