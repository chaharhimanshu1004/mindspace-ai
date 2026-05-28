import { z } from "zod";

export const createMemorySchema = z.object({
    content: z.string().trim().min(1, "Memory cannot be empty").max(10_000, "Memory is too long"),
});

export const listMemoriesSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
    cursor: z.string().uuid().optional(),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type ListMemoriesInput = z.infer<typeof listMemoriesSchema>;
