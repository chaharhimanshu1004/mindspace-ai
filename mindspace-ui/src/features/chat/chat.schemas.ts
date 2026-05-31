import { z } from "zod";

export const askSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, "Type a question")
        .max(2000, "Too long"),
});

export type AskValues = z.infer<typeof askSchema>;
