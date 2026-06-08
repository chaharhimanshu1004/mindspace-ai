import { z } from "zod";

export const upsertFromSourceSchema = z.object({
    userId: z.number().int().positive(),
    sourceType: z.string().min(1).max(64),
    sourceRef: z.string().min(1).max(256),
    content: z.string().min(1),
    sourceMeta: z.record(z.unknown()).default({}),
});

export type UpsertFromSourceInput = z.infer<typeof upsertFromSourceSchema>;
