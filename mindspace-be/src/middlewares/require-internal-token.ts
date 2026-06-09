import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

export const requireInternalToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const token = req.header("x-api-key");
    if (!token || token !== env.INTERNAL_API_TOKEN) {
        next(new AppError({ message: "Unauthorized", status: 401, code: "UNAUTHORIZED" }));
        return;
    }
    next();
};
