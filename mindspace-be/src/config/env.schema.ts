import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(4000),

    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("30d"),

    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    API_URL: z.string().url().default("http://localhost:4000"),

    BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),

    COOKIE_NAME: z.string().default("mindspace.token"),
    COOKIE_DOMAIN: z.string().optional(),

    REDIS_URL: z.string().min(1).default("redis://localhost:6379"),

    AI_ENGINE_URL: z.string().url().default("http://localhost:5000"),
    AI_ENGINE_TOKEN: z.string().min(1),

    GEMINI_API_KEY: z.string().min(1),
    GEMINI_CHAT_MODEL: z.string().default("gemini-2.5-flash"),

    CHAT_TOP_K: z.coerce.number().int().min(1).max(50).default(8),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),

    SLACK_CLIENT_ID: z.string().min(1),
    SLACK_CLIENT_SECRET: z.string().min(1),
    SLACK_REDIRECT_URI: z.string().url(),

    CREDENTIALS_SECRET: z.string().length(64),
});

export type Env = z.infer<typeof envSchema>;
