import { Router } from "express";

import { ChatController } from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.use(requireAuth);

router
    .post("/ask", ChatController.ask)
    .get("/history", ChatController.history);

export default router;
