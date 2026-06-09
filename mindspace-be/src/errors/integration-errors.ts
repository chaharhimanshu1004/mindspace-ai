import { AppError } from "./app-error";

export const integrationNotFoundError = () =>
    new AppError({ message: "Integration not connected", status: 404, code: "INTEGRATION_NOT_FOUND" });

export const oauthExchangeError = () =>
    new AppError({ message: "Failed to exchange OAuth code", status: 502, code: "OAUTH_EXCHANGE_FAILED" });

export const tokenRefreshError = () =>
    new AppError({ message: "Failed to refresh access token", status: 502, code: "TOKEN_REFRESH_FAILED" });

export const slackApiError = (detail: string) =>
    new AppError({ message: `Slack API error: ${detail}`, status: 502, code: "SLACK_API_ERROR" });

export const slackSubscriptionNotFoundError = () =>
    new AppError({ message: "Slack channel not subscribed", status: 404, code: "SLACK_SUBSCRIPTION_NOT_FOUND" });
