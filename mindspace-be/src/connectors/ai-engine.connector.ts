import { env } from "../config/env";
import { AppError } from "../errors/app-error";

interface SearchHit {
    memoryId: string;
    score: number;
    title: string | null;
    summary: string | null;
    content: string;
    createdAt: string;
}

interface SearchResponse {
    hits: SearchHit[];
}

interface SearchArgs {
    userId: number;
    query: string;
    limit: number;
}

export type { SearchHit };

export class AiEngineConnector {
    public static async search(args: SearchArgs): Promise<SearchHit[]> {
        const url = `${env.AI_ENGINE_URL.replace(/\/$/, "")}/internal/search`;

        let res: Response;
        try {
            res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": env.AI_ENGINE_TOKEN,
                },
                body: JSON.stringify({
                    userId: args.userId,
                    query: args.query,
                    limit: args.limit,
                }),
            });
        } catch (cause) {
            throw new AppError({
                message: "AI engine is unreachable",
                status: 503,
                code: "AI_ENGINE_UNREACHABLE",
                details: cause instanceof Error ? cause.message : String(cause),
            });
        }

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new AppError({
                message: "AI engine search failed",
                status: 502,
                code: "AI_ENGINE_FAILED",
                details: { status: res.status, body: text.slice(0, 500) },
            });
        }

        const data = (await res.json()) as SearchResponse;
        return data.hits ?? [];
    }
}
