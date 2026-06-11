import { env } from "../config/env";
import { beUpstreamError } from "../errors/integration-errors";
import type {
    UpsertFromSourceRequest,
    UpsertFromSourceResponse,
} from "../schemas/upsert-memory.types";

const INTERNAL_PATH = "/api/internal/memories/upsert-from-source";
const REQUEST_TIMEOUT_MS = 30_000;

export class BeInternalConnector {
    public static async upsertMemoryFromSource(
        body: UpsertFromSourceRequest,
    ): Promise<UpsertFromSourceResponse> {
        const url = `${env.BE_URL}${INTERNAL_PATH}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": env.INTERNAL_API_TOKEN,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw beUpstreamError(`HTTP ${res.status} ${text}`);
            }

            const payload = (await res.json()) as { data?: UpsertFromSourceResponse };
            if (!payload.data) throw beUpstreamError("Missing data in response");
            return payload.data;
        } catch (err) {
            if ((err as { name?: string }).name === "AbortError") {
                throw beUpstreamError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }

    public static async linkTelegram(
        telegramUserId: string,
        token: string,
    ): Promise<{ success: boolean; userId: number }> {
        const url = `${env.BE_URL}/api/internal/integrations/telegram/link`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": env.INTERNAL_API_TOKEN,
                },
                body: JSON.stringify({ telegramUserId, token }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw beUpstreamError(`HTTP ${res.status} ${text}`);
            }

            const payload = (await res.json()) as { data?: { success: boolean; userId: number } };
            if (!payload.data) throw beUpstreamError("Missing data in response");
            return payload.data;
        } catch (err) {
            if ((err as { name?: string }).name === "AbortError") {
                throw beUpstreamError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }

    public static async sendTelegramMessage(
        telegramUserId: string,
        text: string,
        isQuery: boolean,
    ): Promise<{ success: boolean; action: "saved" | "answered"; memoryId?: string; answer?: string }> {
        const url = `${env.BE_URL}/api/internal/integrations/telegram/message`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": env.INTERNAL_API_TOKEN,
                },
                body: JSON.stringify({ telegramUserId, text, isQuery }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const responseText = await res.text().catch(() => "");
                throw beUpstreamError(`HTTP ${res.status} ${responseText}`);
            }

            const payload = (await res.json()) as {
                data?: { success: boolean; action: "saved" | "answered"; memoryId?: string; answer?: string };
            };
            if (!payload.data) throw beUpstreamError("Missing data in response");
            return payload.data;
        } catch (err) {
            if ((err as { name?: string }).name === "AbortError") {
                throw beUpstreamError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }
}
