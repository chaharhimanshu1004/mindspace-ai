import { AppError } from "./app-error";

export const rateLimitExceededError = (retryAfterSec: number): AppError =>
    new AppError({
        message: "Too many requests, please try again after some time.",
        status: 429,
        code: "RATE_LIMITED",
        details: { retryAfterSec },
    });
