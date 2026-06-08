import { Router } from "express";
import { InternalMemoryController } from "../controllers/internal-memory.controller";
import { requireInternalToken } from "../middlewares/require-internal-token";

const router = Router();

router.use(requireInternalToken);

router.post("/memories/upsert-from-source", InternalMemoryController.upsertFromSource);

export default router;
