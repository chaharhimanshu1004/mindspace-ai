import "dotenv/config";
import { envSchema, type Env } from "./env.schema";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env: Env = parsed.data;
