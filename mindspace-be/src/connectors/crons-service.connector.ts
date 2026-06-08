import { env } from "../config/env";
import { AppError } from "../errors/app-error";

const PATH = "/internal/slack/sync";
const REQUEST_TIMEOUT_MS = 60_000;

const upstreamError = (detail: string) =>
    new AppError({
        message: `Crons service error: ${detail}`,
        status: 502,
        code: "CRONS_UPSTREAM_ERROR",
    });

export class CronsServiceConnector {
    public static async triggerSlackSync(userId: number): Promise<unknown> {
        const url = `${env.CRONS_SERVICE_URL.replace(/\/$/, "")}${PATH}/${userId}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": env.INTERNAL_API_TOKEN,
                },
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw upstreamError(`HTTP ${res.status} ${text}`);
            }

            const payload = (await res.json()) as { data?: unknown };
            return payload.data ?? null;
        } catch (err) {
            if ((err as { name?: string }).name === "AbortError") {
                throw upstreamError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }
}
