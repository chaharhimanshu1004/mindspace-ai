import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import healthRouter from "../routes/health.route";
import slackSyncRouter from "../routes/slack-sync.route";
import slackWebhookRouter from "../routes/slack-webhook.route";
import { errorHandler } from "../middlewares/error-handler";
import { notFoundHandler } from "../middlewares/not-found";

export const createApp = (): Express => {
    const app = express();

    app.disable("x-powered-by");
    app.use(helmet());
    app.use(morgan("dev"));

    app.use("/webhooks/slack", slackWebhookRouter);

    app.use(express.json({ limit: "1mb" }));

    app.use("/health", healthRouter);
    app.use("/internal/slack/sync", slackSyncRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
