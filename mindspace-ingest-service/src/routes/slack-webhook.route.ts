import { Router } from "express";
import { SlackWebhookController } from "../controllers/slack-webhook.controller";
import { captureRawBody } from "../middlewares/capture-raw-body";
import { verifySlackSignature } from "../middlewares/verify-slack-signature";

const router = Router();

router.post("/events", captureRawBody, verifySlackSignature, SlackWebhookController.receive);

export default router;
