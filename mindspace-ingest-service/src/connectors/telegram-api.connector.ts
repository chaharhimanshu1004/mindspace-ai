import { env } from "../config/env";
import { AppError } from "../errors/app-error";

const REQUEST_TIMEOUT_MS = 15_000;

export class TelegramApiConnector {
    public static async sendMessage(chatId: number, text: string): Promise<void> {
        const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const responseText = await res.text().catch(() => "");
                throw new AppError({
                    message: `Telegram API error: HTTP ${res.status} ${responseText}`,
                    status: 502,
                    code: "TELEGRAM_API_ERROR",
                });
            }
        } catch (err) {
            if ((err as { name?: string }).name === "AbortError") {
                throw new AppError({
                    message: `Telegram API request timed out after ${REQUEST_TIMEOUT_MS}ms`,
                    status: 504,
                    code: "TELEGRAM_API_TIMEOUT",
                });
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }
}
