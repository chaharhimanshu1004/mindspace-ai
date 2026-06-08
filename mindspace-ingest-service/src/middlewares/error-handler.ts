import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { env } from "../config/env";
import { ResponseHandler } from "../utils/responseHandler";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        ResponseHandler.error(res, err.message, err.details ?? null, err.status);
        return;
    }
    if (env.NODE_ENV !== "production") {
        console.error(err);
    }
    ResponseHandler.error(res, "Something went wrong", null, 500);
};
