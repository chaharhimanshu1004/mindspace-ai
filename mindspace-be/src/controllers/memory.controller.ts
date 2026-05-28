import type { Request, Response } from "express";
import { ZodError } from "zod";

import { createMemorySchema, listMemoriesSchema } from "../schemas/memory.schema";
import { MemoryService } from "../services/memory.service";
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

export class MemoryController {
    public static async create(req: Request, res: Response): Promise<void> {
        try {
            const ctx = requireAuthCtx(req, res);
            if (!ctx) return;

            const input = createMemorySchema.parse(req.body);
            const memory = await MemoryService.create({ userId: ctx.userId, input });

            ResponseHandler.success(res, memory, "Memory saved", 201);
        } catch (error) {
            handleError(res, error, "Failed to save memory");
        }
    }

    public static async list(req: Request, res: Response): Promise<void> {
        try {
            const ctx = requireAuthCtx(req, res);
            if (!ctx) return;

            const input = listMemoriesSchema.parse(req.query);
            const page = await MemoryService.list({ userId: ctx.userId, input });

            ResponseHandler.success(res, page, "Memories fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch memories");
        }
    }

    public static async get(req: Request, res: Response): Promise<void> {
        try {
            const ctx = requireAuthCtx(req, res);
            if (!ctx) return;

            const memory = await MemoryService.get({
                userId: ctx.userId,
                id: req.params.id,
            });

            ResponseHandler.success(res, memory, "Memory fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch memory");
        }
    }
}
