import type { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import { slackRollupWorker } from "../workers/slack-rollup.worker";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class SlackSyncController {
    public static async sync(_req: Request, res: Response): Promise<void> {
        try {
            const summaries = await slackRollupWorker.sync();
            ResponseHandler.success(res, summaries, "Global rollup completed", 200);
        } catch (error) {
            handleError(res, error, "Global rollup failed");
        }
    }

    public static async runForUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (Number.isNaN(userId)) {
                ResponseHandler.error(res, "Invalid userId", null, 400);
                return;
            }
            const summaries = await slackRollupWorker.runForUser(userId);
            ResponseHandler.success(res, summaries, "Rollup completed", 200);
        } catch (error) {
            handleError(res, error, "Rollup failed");
        }
    }
}
