import { Router } from "express";
import { IntegrationController } from "../controllers/integration.controller";
import { SlackIntegrationController } from "../controllers/slack-integration.controller";
import { SlackChannelsController } from "../controllers/slack-channels.controller";
import { TelegramIntegrationController } from "../controllers/telegram-integration.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.get("/slack/callback", SlackIntegrationController.callback);

router.use(requireAuth);

router
    .get("/", IntegrationController.list)
    .get("/google-calendar/connect", IntegrationController.connectGoogle)
    .get("/google-calendar/callback", IntegrationController.googleCallback)
    .delete("/google-calendar", IntegrationController.disconnectGoogle)
    .get("/slack/connect", SlackIntegrationController.connect)
    .delete("/slack", SlackIntegrationController.disconnect)
    .get("/telegram/connect", TelegramIntegrationController.getPairingToken)
    .delete("/telegram", TelegramIntegrationController.disconnect)
    .get("/slack/channels", SlackChannelsController.listChannels)
    .get("/slack/subscriptions", SlackChannelsController.listSubscriptions)
    .post("/slack/subscriptions", SlackChannelsController.subscribe)
    .delete("/slack/subscriptions/:channelId", SlackChannelsController.unsubscribe)
    .post("/slack/sync", SlackChannelsController.syncNow);

export default router;
