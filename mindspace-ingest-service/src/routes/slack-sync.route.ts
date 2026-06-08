import { Router } from "express";
import { SlackSyncController } from "../controllers/slack-sync.controller";
import { requireInternalToken } from "../middlewares/require-internal-token";

const router = Router();

router.use(requireInternalToken);

router.post("/", SlackSyncController.sync);
router.post("/:userId", SlackSyncController.runForUser);

export default router;
