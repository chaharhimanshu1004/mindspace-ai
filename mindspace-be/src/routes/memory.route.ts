import { Router } from "express";
import { MemoryController } from "../controllers/memory.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.use(requireAuth);

router
    .post("/", MemoryController.create)
    .get("/", MemoryController.list)
    .get("/:id", MemoryController.get);

export default router;
