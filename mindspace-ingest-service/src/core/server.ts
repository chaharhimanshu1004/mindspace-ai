import { env } from "../config/env";
import { createApp } from "./app";

export const startServer = (): void => {
    const app = createApp();

    app.listen(env.PORT, () => {
        console.log(`mindspace-ingest-service listening on :${env.PORT} (${env.NODE_ENV})`);
    });
};
