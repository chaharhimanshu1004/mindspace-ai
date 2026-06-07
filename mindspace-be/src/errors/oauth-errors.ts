import { AppError } from "./app-error";

export const invalidClientError = () =>
    new AppError({ message: "Invalid client", status: 401, code: "INVALID_CLIENT" });

export const invalidGrantError = () =>
    new AppError({ message: "Invalid or expired grant", status: 400, code: "INVALID_GRANT" });

export const invalidScopeError = () =>
    new AppError({ message: "Requested scope not allowed", status: 400, code: "INVALID_SCOPE" });

export const invalidRedirectUriError = () =>
    new AppError({ message: "Redirect URI not registered", status: 400, code: "INVALID_REDIRECT_URI" });

export const invalidTokenError = () =>
    new AppError({ message: "Invalid or revoked token", status: 401, code: "INVALID_TOKEN" });

export const insufficientScopeError = () =>
    new AppError({ message: "Insufficient scope", status: 403, code: "INSUFFICIENT_SCOPE" });
