import type { Request, Response } from "express";
import { ZodError } from "zod";
import { SlackChannelsService } from "../services/slack-channels.service";
import { SlackSubscriptionService } from "../services/slack-subscription.service";
import { SlackSyncService } from "../services/slack-sync.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import { subscribeChannelSchema, channelIdParamSchema } from "../schemas/slack.schema";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    if (error instanceof ZodError) {
        ResponseHandler.error(res, "Invalid request", error.flatten().fieldErrors, 400);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class SlackChannelsController {
    public static async listChannels(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const channels = await SlackChannelsService.listForUser(userId);
            ResponseHandler.success(res, channels, "Channels fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to list Slack channels");
        }
    }

    public static async listSubscriptions(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const subs = await SlackSubscriptionService.listActive(userId);
            ResponseHandler.success(res, subs, "Subscriptions fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to list Slack subscriptions");
        }
    }

    public static async subscribe(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const body = subscribeChannelSchema.parse(req.body);
            const sub = await SlackSubscriptionService.subscribe({
                userId,
                channelId: body.channelId,
                channelName: body.channelName,
            });
            ResponseHandler.success(res, sub, "Subscribed", 201);
        } catch (error) {
            handleError(res, error, "Failed to subscribe to Slack channel");
        }
    }

    public static async unsubscribe(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const params = channelIdParamSchema.parse(req.params);
            await SlackSubscriptionService.unsubscribe({
                userId,
                channelId: params.channelId,
            });
            ResponseHandler.success(res, null, "Unsubscribed", 200);
        } catch (error) {
            handleError(res, error, "Failed to unsubscribe");
        }
    }

    public static async syncNow(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const summaries = await SlackSyncService.runForUser(userId);
            ResponseHandler.success(res, summaries, "Sync completed", 200);
        } catch (error) {
            handleError(res, error, "Sync failed");
        }
    }
}
