import { Router } from "express";
import { IntegrationController } from "../controllers/integration.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.use(requireAuth);

router
    .get("/", IntegrationController.list)
    .get("/google-calendar/connect", IntegrationController.connectGoogle)
    .get("/google-calendar/callback", IntegrationController.googleCallback)
    .delete("/google-calendar", IntegrationController.disconnectGoogle);

export default router;
