import type { Request, Response } from "express";
import { SlackIntegrationService } from "../services/slack-integration.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import { env } from "../config/env";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class SlackIntegrationController {
    public static connect(req: Request, res: Response): void {
        try {
            const userId = req.auth!.userId;
            const url = SlackIntegrationService.getAuthUrl(userId);
            res.redirect(url);
        } catch (error) {
            handleError(res, error, "Failed to initiate Slack OAuth");
        }
    }

    public static async callback(req: Request, res: Response): Promise<void> {
        try {
            const { code, state, error } = req.query as {
                code?: string;
                state?: string;
                error?: string;
            };

            if (error) {
                res.redirect(`${env.CORS_ORIGIN}/memories?integration=slack&status=denied`);
                return;
            }
            if (!code || !state) {
                ResponseHandler.error(res, "Missing OAuth params", null, 400);
                return;
            }

            await SlackIntegrationService.handleCallback({ code, state });

            res.redirect(`${env.CORS_ORIGIN}/memories?integration=slack&status=connected`);
        } catch (err) {
            handleError(res, err, "Slack OAuth callback failed");
        }
    }

    public static async disconnect(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            await SlackIntegrationService.disconnect(userId);
            ResponseHandler.success(res, null, "Slack disconnected", 200);
        } catch (error) {
            handleError(res, error, "Failed to disconnect Slack");
        }
    }
}
