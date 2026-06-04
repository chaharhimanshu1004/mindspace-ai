import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.use(requireAuth);

router.patch("/", ProfileController.update);

export default router;
