import { createHmac, timingSafeEqual } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import {
    invalidSignatureError,
    missingSignatureHeadersError,
    replayWindowExceededError,
} from "../errors/slack-webhook-errors";

const REPLAY_WINDOW_SECONDS = 60 * 5;

const computeExpected = (timestamp: string, rawBody: string): string => {
    const base = `v0:${timestamp}:${rawBody}`;
    const hmac = createHmac("sha256", env.SLACK_SIGNING_SECRET);
    hmac.update(base);
    return `v0=${hmac.digest("hex")}`;
};

const safeEqual = (a: string, b: string): boolean => {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
};

export const verifySlackSignature = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    try {
        const timestamp = req.header("x-slack-request-timestamp");
        const signature = req.header("x-slack-signature");
        const rawBody = req.rawBody ?? "";

        if (!timestamp || !signature) throw missingSignatureHeadersError();

        const tsNum = Number(timestamp);
        if (!Number.isFinite(tsNum)) throw missingSignatureHeadersError();

        const nowSec = Math.floor(Date.now() / 1000);
        if (Math.abs(nowSec - tsNum) > REPLAY_WINDOW_SECONDS) {
            throw replayWindowExceededError();
        }

        const expected = computeExpected(timestamp, rawBody);
        if (!safeEqual(expected, signature)) throw invalidSignatureError();

        next();
    } catch (err) {
        next(err);
    }
};
