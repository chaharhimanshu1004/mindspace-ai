import { z } from "zod";

export const askSchema = z.object({
    message: z.string().trim().min(1, "Message required").max(2000),
});

export const historyQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    cursor: z.string().uuid().optional(),
});

export type AskInput = z.infer<typeof askSchema>;
export type HistoryQuery = z.infer<typeof historyQuerySchema>;
