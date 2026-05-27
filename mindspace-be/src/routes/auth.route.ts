import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router
    .post("/signup", AuthController.signup)
    .post("/login", AuthController.login)
    .post("/logout", requireAuth, AuthController.logout)
    .get("/verify-session", requireAuth, AuthController.verifySession);

export default router;
