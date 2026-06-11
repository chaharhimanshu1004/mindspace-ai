import { Router } from "express";
import { MemoryController } from "../controllers/memory.controller";
import { MemorySourceController } from "../controllers/memory-source.controller";
import { requireAuth } from "../middlewares/require-auth";
import { rateLimit } from "../middlewares/rate-limit";

const router = Router();

router.use(requireAuth);

router
    .get("/sources", MemorySourceController.list)
    .post("/", rateLimit("ui_note"), MemoryController.create)
    .get("/", MemoryController.list)
    .get("/:id", MemoryController.get)
    .delete("/:id", MemoryController.delete);

export default router;
