import type { CookieOptions, Response } from "express";
import { env } from "../config/env";

const baseOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

export const setAuthCookie = (res: Response, token: string, expiresAt: Date): void => {
    res.cookie(env.COOKIE_NAME, token, {
        ...baseOptions(),
        expires: expiresAt,
    });
};

export const clearAuthCookie = (res: Response): void => {
    res.clearCookie(env.COOKIE_NAME, baseOptions());
};

export const readAuthCookie = (cookies: Record<string, string> | undefined): string | null => {
    if (!cookies) return null;
    return cookies[env.COOKIE_NAME] ?? null;
};
