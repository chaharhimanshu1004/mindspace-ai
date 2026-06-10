import type { Request, Response } from "express";
import { TelegramIntegrationService } from "../services/telegram-integration.service";
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

export class TelegramIntegrationController {
    public static async getPairingToken(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const result = await TelegramIntegrationService.generatePairingToken(userId);
            ResponseHandler.success(res, result, "Pairing token generated", 200);
        } catch (error) {
            handleError(res, error, "Failed to generate pairing token");
        }
    }

    public static async disconnect(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            await TelegramIntegrationService.disconnect(userId);
            ResponseHandler.success(res, null, "Telegram disconnected", 200);
        } catch (error) {
            handleError(res, error, "Failed to disconnect Telegram");
        }
    }

    public static async internalLink(req: Request, res: Response): Promise<void> {
        try {
            const { telegramUserId, token } = req.body as { telegramUserId?: string; token?: string };
            if (!telegramUserId || !token) {
                ResponseHandler.error(res, "Missing telegramUserId or token", null, 400);
                return;
            }
            const result = await TelegramIntegrationService.linkAccount({ telegramUserId, token });
            ResponseHandler.success(res, result, "Account linked", 200);
        } catch (error) {
            handleError(res, error, "Internal pairing failed");
        }
    }

    public static async internalMessage(req: Request, res: Response): Promise<void> {
        try {
            const { telegramUserId, text, isQuery } = req.body as { telegramUserId?: string; text?: string; isQuery?: boolean };
            if (!telegramUserId || !text) {
                ResponseHandler.error(res, "Missing telegramUserId or text", null, 400);
                return;
            }

            if (isQuery) {
                const result = await TelegramIntegrationService.handleIncomingQuery({ telegramUserId, text });
                ResponseHandler.success(res, result, "Query answered", 200);
            } else {
                const result = await TelegramIntegrationService.handleIncomingMessage({ telegramUserId, text });
                ResponseHandler.success(res, result, "Memory saved", 200);
            }
        } catch (error) {
            handleError(res, error, "Failed to process Telegram webhook request");
        }
    }
}
