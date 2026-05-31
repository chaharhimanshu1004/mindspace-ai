import type { Request, Response } from "express";
import { ZodError } from "zod";

import { askSchema, historyQuerySchema } from "../schemas/chat.schema";
import { ChatService } from "../services/chat.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }

    if (error instanceof ZodError) {
        ResponseHandler.error(res, "Invalid request payload", error.flatten().fieldErrors, 400);
        return;
    }

    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

const requireAuthCtx = (req: Request, res: Response): { userId: number } | null => {
    const auth = req.auth;
    if (!auth) {
        ResponseHandler.error(res, "Authentication required", null, 401);
        return null;
    }
    return { userId: auth.userId };
};

export class ChatController {
    public static async ask(req: Request, res: Response): Promise<void> {
        try {
            const ctx = requireAuthCtx(req, res);
            if (!ctx) return;

            const input = askSchema.parse(req.body);
            const answer = await ChatService.ask({
                userId: ctx.userId,
                message: input.message,
            });

            ResponseHandler.success(res, answer, "Answered", 200);
        } catch (error) {
            handleError(res, error, "Failed to answer question");
        }
    }

    public static async history(req: Request, res: Response): Promise<void> {
        try {
            const ctx = requireAuthCtx(req, res);
            if (!ctx) return;

            const input = historyQuerySchema.parse(req.query);
            const page = await ChatService.history({
                userId: ctx.userId,
                limit: input.limit,
                cursor: input.cursor,
            });

            ResponseHandler.success(res, page, "History fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch chat history");
        }
    }
}
