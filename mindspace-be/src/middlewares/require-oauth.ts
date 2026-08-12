import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { OAuthService } from "../services/oauth.service";
import { AppError } from "../errors/app-error";
import { insufficientScopeError, invalidTokenError } from "../errors/oauth-errors";
import type { OAuthScope } from "../schemas/oauth.types";

const extractBearer = (header: string | undefined): string | null => {
    if (!header) return null;
    const [scheme, value] = header.split(" ");
    if (scheme !== "Bearer" || !value) return null;
    return value.trim();
};

const RESOURCE_METADATA_URL = `${env.API_URL}/.well-known/oauth-protected-resource/mcp`;

const errorParam = (code: string): string | null => {
    if (code === "INVALID_TOKEN" || code === "INVALID_GRANT") return "invalid_token";
    if (code === "INSUFFICIENT_SCOPE") return "insufficient_scope";
    return null;
};

const setWwwAuthenticate = (res: Response, err: unknown): void => {
    const parts = [
        `Bearer realm="mindspace"`,
        `resource_metadata="${RESOURCE_METADATA_URL}"`,
    ];

    if (err instanceof AppError) {
        const param = errorParam(err.code);
        if (param) parts.push(`error="${param}"`);
        parts.push(`error_description="${err.message.replace(/"/g, "'")}"`);
    }

    res.setHeader("WWW-Authenticate", parts.join(", "));
};

const populate = async (req: Request): Promise<void> => {
    const token = extractBearer(req.headers.authorization);
    if (!token) throw invalidTokenError();

    const record = await OAuthService.validateAccessToken(token);
    req.auth = { userId: record.userId, tokenId: record.id, scopes: record.scopes };
};

export const requireOAuth = (scope: OAuthScope) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await populate(req);
            if (!req.auth!.scopes!.includes(scope)) throw insufficientScopeError();
            next();
        } catch (err) {
            setWwwAuthenticate(res, err);
            next(err);
        }
    };

export const requireOAuthToken =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await populate(req);
            next();
        } catch (err) {
            setWwwAuthenticate(res, err);
            next(err);
        }
    };
