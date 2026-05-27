import axios, { type AxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { authStorage } from "@/features/auth/auth.storage";
import { ApiError } from "./api-error";

interface RequestArgs {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    body?: unknown;
    auth?: boolean;
}

const buildHeaders = (auth: boolean): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (auth) {
        const token = authStorage.get();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export const apiClient = async <T>(args: RequestArgs): Promise<T> => {
    const config: AxiosRequestConfig = {
        method: args.method ?? "GET",
        url: `${env.apiUrl}${args.path}`,
        headers: buildHeaders(args.auth ?? false),
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

            throw new ApiError({
                status,
                code: String(body?.code ?? "UNKNOWN"),
                message: body?.message ?? "Something went wrong. Please try again.",
            });
        }

        throw err;
    }
};
