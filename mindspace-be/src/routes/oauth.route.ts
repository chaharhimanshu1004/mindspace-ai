import { Router } from "express";
import { OAuthController } from "../controllers/oauth.controller";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router
    .get("/authorize", OAuthController.authorizeGet)
    .post("/authorize", requireAuth, OAuthController.authorizePost)

    .post("/token", OAuthController.token)
    .get("/tokens", requireAuth, OAuthController.listTokens)
    .delete("/tokens/:id", requireAuth, OAuthController.revokeToken)

export default router;
