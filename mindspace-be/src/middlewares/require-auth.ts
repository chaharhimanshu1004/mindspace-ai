import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sessionRevokedError, unauthorizedError } from "../errors/auth-errors";
import { readAuthCookie } from "../utils/auth.cookie";

const extractBearer = (header: string | undefined): string | null => {
    if (!header) return null;
    const [scheme, value] = header.split(" ");
    if (scheme !== "Bearer" || !value) return null;
    return value.trim();
};

const extractToken = (req: Request): string | null => {
    const cookieToken = readAuthCookie(req.cookies as Record<string, string> | undefined);
    if (cookieToken) return cookieToken;
    return extractBearer(req.headers.authorization);
};

export const requireAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const raw = extractToken(req);
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
