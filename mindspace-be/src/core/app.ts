import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "../config/env";
import morgan from "morgan"
import authRouter from "../routes/auth.route";
import memoryRouter from "../routes/memory.route";
import chatRouter from '../routes/chat.route'
import integrationRouter from "../routes/integration.route"
import profileRouter from "../routes/profile.route"
import oauthRouter from "../routes/oauth.route"
import mcpRouter from "../routes/mcp.route"
import { OAuthController } from "../controllers/oauth.controller"
import { errorHandler } from "../middlewares/error-handler";
import { notFoundHandler } from "../middlewares/not-found";

export const createApp = (): Express => {
    const app = express();

    const MCP_ORIGINS = [
        env.CORS_ORIGIN,
        "https://claude.ai",
        "https://claude.com",
    ];

    app.disable("x-powered-by");
    app.use(helmet());
    app.use(cors({
        origin: (origin, cb) => {
            if (!origin || MCP_ORIGINS.includes(origin)) return cb(null, true);
            cb(null, false);
        },
        credentials: true,
    }));
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/memories", memoryRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/integrations", integrationRouter);
    app.use("/api/profile", profileRouter);
    app.use("/api/oauth", oauthRouter);
    app.use("/mcp", mcpRouter);
    app.get("/.well-known/oauth-authorization-server", OAuthController.discoveryMetadata);
    app.get("/.well-known/oauth-protected-resource", OAuthController.protectedResourceMetadata);
    app.get("/.well-known/oauth-protected-resource/mcp", OAuthController.protectedResourceMetadata);
    app.post("/api/oauth/register", OAuthController.dynamicClientRegistration);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
