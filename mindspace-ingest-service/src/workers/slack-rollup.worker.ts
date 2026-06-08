import { AppError } from "../errors/app-error";
import { SlackRollupService } from "../services/slack-rollup.service";

class SlackRollupWorker {
    private running = false;

    private async withLock<T>(action: () => Promise<T>): Promise<T> {
        if (this.running) {
            throw new AppError({
                message: "Rollup already in progress",
                status: 409,
                code: "ROLLUP_BUSY",
            });
        }
        this.running = true;
        try {
            return await action();
        } finally {
            this.running = false;
        }
    }

    public async sync(): Promise<any[]> {
        if (this.running) {
            console.log("[rollup] previous run still in progress, skipping");
            return [];
        }
        this.running = true;
        const startedAt = Date.now();

        try {
            const results = await SlackRollupService.sync();
            console.log(`[rollup] tick processed buckets=${results.length}`);
            for (const r of results) {
                console.log("[rollup]", r);
            }
            return results;
        } catch (err) {
            console.error("[rollup] tick failed", err);
            throw err;
        } finally {
            this.running = false;
            console.log(`[rollup] tick done in ${Date.now() - startedAt}ms`);
        }
    }

    public async runForUser(userId: number) {
        return this.withLock(() => SlackRollupService.runForUser(userId));
    }
}

export const slackRollupWorker = new SlackRollupWorker();
