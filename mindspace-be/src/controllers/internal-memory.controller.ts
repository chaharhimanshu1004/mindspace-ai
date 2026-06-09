import type { Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import { upsertFromSourceSchema } from "../schemas/internal-memory.schema";
import { InternalMemoryService } from "../services/internal-memory.service";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    if (error instanceof ZodError) {
        ResponseHandler.error(res, "Invalid request", error.flatten().fieldErrors, 400);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class InternalMemoryController {
    public static async upsertFromSource(req: Request, res: Response): Promise<void> {
        try {
            const body = upsertFromSourceSchema.parse(req.body);
            const result = await InternalMemoryService.upsertFromSource(body);
            ResponseHandler.success(res, result, "Memory upserted", 200);
        } catch (error) {
            handleError(res, error, "Failed to upsert memory");
        }
    }
}
