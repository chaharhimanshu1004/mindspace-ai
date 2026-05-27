import { AppError } from "./app-error";

export const emailTakenError = (): AppError =>
    new AppError({
        message: "An account with this email already exists.",
        status: 409,
        code: "EMAIL_TAKEN",
    });

export const invalidCredentialsError = (): AppError =>
    new AppError({
        message: "Invalid email or password.",
        status: 401,
        code: "INVALID_CREDENTIALS",
    });

export const unauthorizedError = (): AppError =>
    new AppError({
        message: "Authentication required.",
        status: 401,
        code: "UNAUTHORIZED",
    });

export const sessionRevokedError = (): AppError =>
    new AppError({
        message: "This session is no longer active.",
        status: 401,
        code: "SESSION_REVOKED",
    });
