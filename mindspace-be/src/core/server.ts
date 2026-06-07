import { env } from "../config/env";
import { createApp } from "./app";
import { slackSyncWorker } from "../workers/slack-sync.worker";

export const startServer = (): void => {
    const app = createApp();

    app.listen(env.PORT, () => {
        console.log(`mindspace-be listening on :${env.PORT} (${env.NODE_ENV})`);
        slackSyncWorker.start();
    });
};
