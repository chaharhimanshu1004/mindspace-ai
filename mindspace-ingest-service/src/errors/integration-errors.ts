import { AppError } from "./app-error";

export const integrationNotFoundError = () =>
    new AppError({ message: "Integration not connected", status: 404, code: "INTEGRATION_NOT_FOUND" });

export const slackApiError = (detail: string) =>
    new AppError({ message: `Slack API error: ${detail}`, status: 502, code: "SLACK_API_ERROR" });

export const beUpstreamError = (detail: string) =>
    new AppError({ message: `BE upstream error: ${detail}`, status: 502, code: "BE_UPSTREAM_ERROR" });

export const unauthorizedError = () =>
    new AppError({ message: "Unauthorized", status: 401, code: "UNAUTHORIZED" });
