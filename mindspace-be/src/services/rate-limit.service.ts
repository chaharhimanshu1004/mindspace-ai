import { redis } from "../db/redis";
import { env } from "../config/env";
import { rateLimitExceededError } from "../errors/rate-limit-errors";

const KEY_PREFIX = "rl:";

interface ConsumeArgs {
    scope: string;
    id: string | number;
}

export class RateLimitService {
    public static async consume(args: ConsumeArgs): Promise<void> {
        const key = `${KEY_PREFIX}${args.scope}:${args.id}`;
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, env.RATE_LIMIT_WINDOW_SEC);
        }

        if (count > env.RATE_LIMIT_MAX) {
            const ttl = await redis.ttl(key);
            throw rateLimitExceededError(ttl > 0 ? ttl : env.RATE_LIMIT_WINDOW_SEC);
        }
    }
}
