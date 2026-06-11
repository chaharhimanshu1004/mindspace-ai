import { Router } from "express";
import { InternalMemoryController } from "../controllers/internal-memory.controller";
import { TelegramIntegrationController } from "../controllers/telegram-integration.controller";
import { requireInternalToken } from "../middlewares/require-internal-token";

const router = Router();

router.use(requireInternalToken);

router.post("/memories/upsert-from-source", InternalMemoryController.upsertFromSource);
router.post("/integrations/telegram/link", TelegramIntegrationController.internalLink);
router.post("/integrations/telegram/message", TelegramIntegrationController.internalMessage);

export default router;
