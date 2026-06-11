import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

export const verifyTelegramSecret = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const token = req.header("x-telegram-bot-api-secret-token");
    if (!token || token !== env.TELEGRAM_WEBHOOK_SECRET) {
        next(
            new AppError({
                message: "Unauthorized: Invalid or missing Telegram secret token header.",
                status: 401,
                code: "TELEGRAM_UNAUTHORIZED",
            }),
        );
        return;
    }
    next();
};
