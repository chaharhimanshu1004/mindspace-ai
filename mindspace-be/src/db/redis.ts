import Redis from "ioredis";
import { env } from "../config/env";

const redis = new Redis(env.REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});

redis.on("error", (e: unknown) => {
    console.error("Redis error:", e);
});

export { redis };
export default redis;

redis.ping()
    .then(() => {
        console.log("Successfully connected to Redis");
    })
    .catch((e: unknown) => {
        console.error("Failed to connect to Redis:", e);
        process.exit(1);
    });
