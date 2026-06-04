import { AppError } from "./app-error";

export const integrationNotFoundError = () =>
    new AppError({ message: "Integration not connected", status: 404, code: "INTEGRATION_NOT_FOUND" });

export const oauthExchangeError = () =>
    new AppError({ message: "Failed to exchange OAuth code", status: 502, code: "OAUTH_EXCHANGE_FAILED" });

export const tokenRefreshError = () =>
    new AppError({ message: "Failed to refresh access token", status: 502, code: "TOKEN_REFRESH_FAILED" });
