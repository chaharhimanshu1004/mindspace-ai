import cron from "node-cron";
import { IntegrationModel } from "../models/integration.model";
import { SlackSyncService } from "../services/slack-sync.service";
import { SLACK_SYNC } from "../utils/constants";

class SlackSyncWorker {
    private running = false;

    public async runOnce(): Promise<void> {
        if (this.running) {
            console.log("[slack-sync] previous run still in progress, skipping");
            return;
        }
        this.running = true;
        const startedAt = Date.now();

        try {
            const userIds = await IntegrationModel.findUserIdsByProvider("slack");
            console.log(`[slack-sync] starting tick users=${userIds.length}`);

            for (const userId of userIds) {
                try {
                    const summaries = await SlackSyncService.runForUser(userId);
                    for (const s of summaries) {
                        console.log("[slack-sync]", { userId, ...s });
                    }
                } catch (err) {
                    console.error("[slack-sync] user failed", { userId, err });
                }
            }
        } catch (err) {
            console.error("[slack-sync] tick failed", err);
        } finally {
            this.running = false;
            console.log(`[slack-sync] tick done in ${Date.now() - startedAt}ms`);
        }
    }

    public start(): void {
        cron.schedule(SLACK_SYNC.POLL_CRON, () => {
            void this.runOnce();
        });
        console.log(`[slack-sync] cron registered: ${SLACK_SYNC.POLL_CRON}`);
    }
}

export const slackSyncWorker = new SlackSyncWorker();
