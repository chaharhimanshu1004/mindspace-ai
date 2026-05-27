import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env";
import authRouter from "../routes/auth.route";
import { errorHandler } from "../middlewares/error-handler";
import { notFoundHandler } from "../middlewares/not-found";

export const createApp = (): Express => {
    const app = express();

    app.disable("x-powered-by");
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json({ limit: "1mb" }));

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.use("/api/auth", authRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
