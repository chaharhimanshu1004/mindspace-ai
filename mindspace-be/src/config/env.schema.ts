import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "qa", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(4000),

    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("30d"),

    CORS_ORIGIN: z.string().default("http://localhost:3000"),

    BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
});

export type Env = z.infer<typeof envSchema>;
