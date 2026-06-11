import type { Request, Response } from "express";
import { BeInternalConnector } from "../connectors/be-internal.connector";
import { TelegramApiConnector } from "../connectors/telegram-api.connector";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class TelegramWebhookController {
    public static async receive(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as {
                message?: {
                    from: { id: number };
                    chat: { id: number; type: string };
                    text?: string;
                };
            };

            if (!body.message || !body.message.text) {
                ResponseHandler.success(res, { ok: true }, "Ignored non-text message update", 200);
                return;
            }

            if (body.message.chat.type !== "private") {
                ResponseHandler.success(res, { ok: true }, "Ignored non-private chat", 200);
                return;
            }

            const chatId = body.message.chat.id;
            const telegramUserId = body.message.from.id.toString();
            const text = body.message.text.trim();

            if (text.startsWith("/start pair_")) {
                const token = text.slice("/start pair_".length).trim();
                if (!token) {
                    await TelegramApiConnector.sendMessage(chatId, "Invalid start command. Token is missing.");
                    ResponseHandler.success(res, { ok: true }, "Empty pairing token", 200);
                    return;
                }

                try {
                    await BeInternalConnector.linkTelegram(telegramUserId, token);
                    await TelegramApiConnector.sendMessage(chatId, "Connection successful! 🎉 Use /save <note> to store a memory, and /ask <question> to query your MindSpace.");
                } catch (err) {
                    console.error("[telegram-webhook] Pairing failed:", err);
                    await TelegramApiConnector.sendMessage(chatId, "Pairing failed. The link may have expired or is invalid. Please get a new link from the MindSpace Settings.");
                }
                ResponseHandler.success(res, { ok: true }, "Pairing processed", 200);
                return;
            }

            if (text.startsWith("/ask ")) {
                const query = text.slice("/ask ".length).trim();
                if (!query) {
                    await TelegramApiConnector.sendMessage(chatId, "Please provide a question after the /ask command.");
                    ResponseHandler.success(res, { ok: true }, "Empty query", 200);
                    return;
                }

                try {
                    const result = await BeInternalConnector.sendTelegramMessage(telegramUserId, query, true);
                    await TelegramApiConnector.sendMessage(chatId, result.answer || "I couldn't generate an answer.");
                } catch (err) {
                    console.error("[telegram-webhook] Ask query failed:", err);
                    const isUnlinked = err instanceof Error && err.message.includes("TELEGRAM_UNLINKED");
                    const isRateLimited = err instanceof Error && err.message.includes("HTTP 429");
                    const errMsg = isRateLimited
                        ? "Too Many Requests\n\nYou're sending messages too fast (max 5 per minute). Please try again after some time."
                        : isUnlinked
                            ? "Your Telegram account is not linked yet. Please go to your MindSpace settings and connect your Telegram bot."
                            : "Sorry, I had trouble recalling your memories. Please try again later.";
                    await TelegramApiConnector.sendMessage(chatId, errMsg);
                }
                ResponseHandler.success(res, { ok: true }, "Query processed", 200);
                return;
            }

            if (text.startsWith("/save ")) {
                const note = text.slice("/save ".length).trim();
                if (!note) {
                    await TelegramApiConnector.sendMessage(chatId, "Please provide some text after the /save command.");
                    ResponseHandler.success(res, { ok: true }, "Empty note", 200);
                    return;
                }

                try {
                    await BeInternalConnector.sendTelegramMessage(telegramUserId, note, false);
                    await TelegramApiConnector.sendMessage(chatId, "Saved to your MindSpace! 🧠");
                } catch (err) {
                    console.error("[telegram-webhook] Save memory failed:", err);
                    const isUnlinked = err instanceof Error && err.message.includes("TELEGRAM_UNLINKED");
                    const isRateLimited = err instanceof Error && err.message.includes("HTTP 429");
                    const errMsg = isRateLimited
                        ? "Too Many Requests\n\nYou're sending messages too fast (max 5 per minute). Please try again after some time."
                        : isUnlinked
                            ? "Your Telegram account is not linked yet. Please go to your MindSpace settings and connect your Telegram bot."
                            : "Failed to save memory. Please try again later.";
                    await TelegramApiConnector.sendMessage(chatId, errMsg);
                }
                ResponseHandler.success(res, { ok: true }, "Save processed", 200);
                return;
            }

            await TelegramApiConnector.sendMessage(chatId, "Please start your message with /save to store a note, or /ask to query your MindSpace.");
            ResponseHandler.success(res, { ok: true }, "Unrecognized command", 200);
        } catch (error) {
            handleError(res, error, "Telegram webhook handler failed");
        }
    }
}
