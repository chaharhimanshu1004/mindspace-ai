import type { NextFunction, Request, Response } from "express";
import { RateLimitService } from "../services/rate-limit.service";
import { unauthorizedError } from "../errors/auth-errors";

export const rateLimit =
    (scope: string) =>
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.auth) throw unauthorizedError();
            await RateLimitService.consume({ scope, id: req.auth.userId });
            next();
        } catch (err) {
            next(err);
        }
    };
