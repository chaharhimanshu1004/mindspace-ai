import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4001),

    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    CREDENTIALS_SECRET: z.string().length(64),
    INTERNAL_API_TOKEN: z.string().min(16),

    BE_URL: z.string().url(),

    SLACK_SIGNING_SECRET: z.string().min(1),

    SLACK_DAY_TIMEZONE: z.string().default("Asia/Kolkata"),
    SLACK_NOISE_GATE_CHARS: z.coerce.number().int().min(0).default(40),
    SLACK_NOISE_GATE_HUMAN_COUNT: z.coerce.number().int().min(1).default(2),
});

export type Env = z.infer<typeof envSchema>;
