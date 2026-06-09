import { AppError } from "./app-error";

export const invalidSignatureError = () =>
    new AppError({
        message: "Invalid Slack signature",
        status: 401,
        code: "SLACK_INVALID_SIGNATURE",
    });

export const missingSignatureHeadersError = () =>
    new AppError({
        message: "Missing Slack signature headers",
        status: 400,
        code: "SLACK_MISSING_SIGNATURE_HEADERS",
    });

export const replayWindowExceededError = () =>
    new AppError({
        message: "Slack timestamp outside allowed replay window",
        status: 401,
        code: "SLACK_REPLAY_WINDOW_EXCEEDED",
    });

export const unmappedTeamError = (teamId: string) =>
    new AppError({
        message: `No MindSpace user found for team ${teamId}`,
        status: 404,
        code: "SLACK_UNMAPPED_TEAM",
    });
