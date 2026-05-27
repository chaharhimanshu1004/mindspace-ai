import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sessionRevokedError, unauthorizedError } from "../errors/auth-errors";

const extractBearer = (header: string | undefined): string | null => {
    if (!header) return null;
    const [scheme, value] = header.split(" ");
    if (scheme !== "Bearer" || !value) return null;
    return value.trim();
};

export const requireAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const raw = extractBearer(req.headers.authorization);
        if (!raw) throw unauthorizedError();

        const payload = AuthService.verifyToken(raw);
        const record = await AuthService.findActiveToken(payload.jti);
        if (!record || record.token !== raw) throw sessionRevokedError();
        if (record.expiresAt.getTime() < Date.now()) throw sessionRevokedError();

        req.auth = { userId: payload.sub, tokenId: payload.jti };
        next();
    } catch (err) {
        if ((err as { name?: string }).name === "JsonWebTokenError") {
            next(unauthorizedError());
            return;
        }
        if ((err as { name?: string }).name === "TokenExpiredError") {
            next(sessionRevokedError());
            return;
        }
        next(err);
    }
};
