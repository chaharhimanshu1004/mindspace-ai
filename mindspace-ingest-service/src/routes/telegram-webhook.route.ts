import { Router } from "express";
import { TelegramWebhookController } from "../controllers/telegram-webhook.controller";
import { verifyTelegramSecret } from "../middlewares/verify-telegram-secret";

const router = Router();

router.post("/events", verifyTelegramSecret, TelegramWebhookController.receive);

export default router;
