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

export const otpExpiredError = (): AppError =>
    new AppError({
        message: "Verification code has expired. Please request a new one.",
        status: 400,
        code: "OTP_EXPIRED",
    });

export const invalidOtpError = (): AppError =>
    new AppError({
        message: "Invalid verification code.",
        status: 400,
        code: "INVALID_OTP",
    });

export const googleAuthError = (): AppError =>
    new AppError({
        message: "Google authentication failed. Please try again.",
        status: 502,
        code: "GOOGLE_AUTH_ERROR",
    });

export const invalidStateError = (): AppError =>
    new AppError({
        message: "Invalid or expired auth state. Please try again.",
        status: 400,
        code: "INVALID_STATE",
    });
