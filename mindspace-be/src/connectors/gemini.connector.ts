import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

interface StructuredArgs<T> {
    prompt: string;
    system?: string;
    schema: Record<string, unknown>;
    parse: (raw: string) => T;
    model?: string;
    temperature?: number;
}

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
    if (!client) client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    return client;
};

export const GeminiTypes = Type;

export class GeminiConnector {
    public static async completeStructured<T>(args: StructuredArgs<T>): Promise<T> {
        const model = args.model ?? env.GEMINI_CHAT_MODEL;

        const result = await getClient().models.generateContent({
            model,
            contents: args.prompt,
            config: {
                temperature: args.temperature ?? 0.2,
                systemInstruction: args.system,
                responseMimeType: "application/json",
                responseSchema: args.schema as never,
            },
        });

        const raw = (result.text ?? "").trim();
        if (!raw) {
            throw new AppError({
                message: "Gemini returned empty structured output",
                status: 502,
                code: "GEMINI_EMPTY",
            });
        }

        try {
            return args.parse(raw);
        } catch (cause) {
            throw new AppError({
                message: "Gemini structured output failed validation",
                status: 502,
                code: "GEMINI_PARSE",
                details: cause instanceof Error ? cause.message : String(cause),
            });
        }
    }
}
