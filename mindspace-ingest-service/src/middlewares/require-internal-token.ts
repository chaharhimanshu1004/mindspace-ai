import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { unauthorizedError } from "../errors/integration-errors";

export const requireInternalToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const token = req.header("x-api-key");
    if (!token || token !== env.INTERNAL_API_TOKEN) {
        next(unauthorizedError());
        return;
    }
    next();
};
