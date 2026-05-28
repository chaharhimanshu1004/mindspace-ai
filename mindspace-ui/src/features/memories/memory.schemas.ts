import { z } from "zod";

export const createMemorySchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Write something first")
        .max(10_000, "That's a long thought — keep it under 10,000 characters"),
});

export type CreateMemoryValues = z.infer<typeof createMemorySchema>;
