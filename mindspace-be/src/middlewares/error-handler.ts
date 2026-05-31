import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { env } from "../config/env";
import { clearAuthCookie } from "../utils/auth.cookie";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request payload.",
                details: err.flatten().fieldErrors,
            },
        });
        return;
    }

    if (err instanceof AppError) {
        if (err.status === 401) {
            clearAuthCookie(res);
        }
        res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details },
        });
        return;
    }

    if (env.NODE_ENV !== "production") {
        console.error(err);
    }

    res.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
    });
};
