import type { Request, Response } from "express";
import { IntegrationService } from "../services/integration.service";
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

export class IntegrationController {
    public static connectGoogle(req: Request, res: Response): void {
        try {
            const userId = req.auth!.userId;
            const timezone = (req.query.tz as string | undefined) ?? "Asia/Kolkata";
            const url = IntegrationService.getGoogleAuthUrl({ userId, timezone });
            res.redirect(url);
        } catch (error) {
            handleError(res, error, "Failed to initiate Google OAuth");
        }
    }

    public static async googleCallback(req: Request, res: Response): Promise<void> {
        try {
            const { code, state } = req.query as { code?: string; state?: string };

            if (!code || !state) {
                ResponseHandler.error(res, "Missing OAuth params", null, 400);
                return;
            }

            await IntegrationService.handleGoogleCallback({ code, state });

            res.redirect(`${env.CORS_ORIGIN}/memories?integration=google_calendar&status=connected`);
        } catch (error) {
            handleError(res, error, "Google OAuth callback failed");
        }
    }

    public static async disconnectGoogle(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            await IntegrationService.disconnect(userId);
            ResponseHandler.success(res, null, "Google Calendar disconnected", 200);
        } catch (error) {
            handleError(res, error, "Failed to disconnect Google Calendar");
        }
    }

    public static async list(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const integrations = await IntegrationService.listForUser(userId);
            ResponseHandler.success(res, integrations, "Integrations fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch integrations");
        }
    }
}
