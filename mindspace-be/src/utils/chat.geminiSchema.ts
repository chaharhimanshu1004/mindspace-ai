import { z } from "zod";

export const chatAnswerSchema = z.object({
    answer: z.string().min(1),
    citedMemoryIds: z.array(z.string().uuid()).default([]),
});

export type ChatAnswerLLM = z.infer<typeof chatAnswerSchema>;

export const chatGeminiResponseSchema: Record<string, unknown> = {
    type: "OBJECT",
    properties: {
        answer: { type: "STRING" },
        citedMemoryIds: {
            type: "ARRAY",
            items: { type: "STRING" },
        },
    },
    required: ["answer", "citedMemoryIds"],
};
