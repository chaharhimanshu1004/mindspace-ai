import type { Request, Response } from "express";
import { SlackWebhookService } from "../services/slack-webhook.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import type {
    SlackEventCallback,
    SlackWebhookBody,
} from "../schemas/slack-webhook.types";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

const isUrlVerification = (body: SlackWebhookBody): body is { type: "url_verification"; token: string; challenge: string } =>
    body.type === "url_verification";

const isEventCallback = (body: SlackWebhookBody): body is SlackEventCallback =>
    body.type === "event_callback";

const logIncomingEvent = (callback: SlackEventCallback): void => {
    const e = callback.event;
    console.log("[slack-webhook] incoming event", {
        eventId: callback.event_id,
        teamId: callback.team_id,
        eventType: e.type,
        subtype: e.subtype ?? null,
        channel: e.channel,
        ts: e.ts,
        threadTs: e.thread_ts ?? null,
        user: e.user ?? null,
        botId: e.bot_id ?? null,
        textPreview: (e.text ?? "").slice(0, 120),
    });
};

export class SlackWebhookController {
    public static async receive(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as SlackWebhookBody;

            if (isUrlVerification(body)) {
                console.log("[slack-webhook] url_verification received");
                res.status(200).json({ challenge: body.challenge });
                return;
            }

            if (isEventCallback(body)) {
                logIncomingEvent(body);
                const result = await SlackWebhookService.ingestEvent(body);
                console.log("[slack-webhook] ingest result", {
                    eventId: body.event_id,
                    ingested: result.ingested,
                    reason: result.reason ?? null,
                });
                res.status(200).json({ ok: true, ...result });
                return;
            }

            console.log("[slack-webhook] unhandled body type", { type: (body as { type?: string }).type });
            res.status(200).json({ ok: true, reason: "unhandled_type" });
        } catch (error) {
            handleError(res, error, "Slack webhook failed");
        }
    }
}
