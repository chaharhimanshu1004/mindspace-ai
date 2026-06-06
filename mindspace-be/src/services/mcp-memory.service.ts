import { MemoryModel } from "../models/memory.model";
import { MemoryQueueService } from "./memoryQueue.service";
import { AiEngineConnector } from "../connectors/ai-engine.connector";
import { toPublicMemory } from "../utils/memory.mapper";
import type { PublicMemory } from "../schemas/memory.types";

const NOISE_GATE_CHARS = 40;

export interface McpSearchHit extends PublicMemory {
    score: number;
}

interface SaveArgs {
    userId: number;
    content: string;
    kind?: string;
    sessionId?: string;
}

interface SearchArgs {
    userId: number;
    query: string;
    limit?: number;
}

interface CheckInResult {
    userEmail: string;
    memoryCount: number;
    recentTitles: string[];
    usageHint: string;
}

const USAGE_HINT =
    "You are connected to MindSpace — the user's personal memory system. " +
    "Use save_memory to store insights, decisions, or ideas from this session. " +
    "Use search_memories to find relevant past thoughts before answering questions. " +
    "Use get_memory to read a specific memory in full. " +
    "Save proactively — the user trusts you to capture what matters.";

export class McpMemoryService {
    public static async checkIn(args: { userId: number; userEmail: string }): Promise<CheckInResult> {
        const { items } = await MemoryModel.listForUser({ userId: args.userId, limit: 5 });
        const total = await MemoryModel.countForUser(args.userId);

        return {
            userEmail: args.userEmail,
            memoryCount: total,
            recentTitles: items.map((m) => m.title ?? m.content.slice(0, 60)),
            usageHint: USAGE_HINT,
        };
    }

    public static async save(args: SaveArgs): Promise<{ memoryId: string | null; status: string; reason?: string }> {
        console.log("[MCP save_memory] incoming content:\n", args.content);
        console.log("[MCP save_memory] chars:", args.content.trim().length, "| kind:", args.kind, "| sessionId:", args.sessionId);

        if (args.content.trim().length < NOISE_GATE_CHARS) {
            return { memoryId: null, status: "filtered", reason: "too_short" };
        }

        const memory = await MemoryModel.createWithSource({
            userId: args.userId,
            content: args.content,
            sourceType: "claude_code",
            sourceRef: args.sessionId ?? null,
            sourceMeta: args.kind ? { kind: args.kind } : null,
        });

        await MemoryQueueService.enqueueForEnrichment({
            memoryId: memory.id,
            userId: memory.userId,
        }).catch((err) => {
            console.error("MCP save_memory: enqueue failed", {
                memoryId: memory.id,
                err,
            });
        });

        return { memoryId: memory.id, status: "queued" };
    }

    public static async search(args: SearchArgs): Promise<McpSearchHit[]> {
        const hits = await AiEngineConnector.search({
            userId: args.userId,
            query: args.query,
            limit: args.limit ?? 8,
        });

        if (!hits.length) return [];

        const ids = hits.map((h) => h.memoryId);
        const memories = await MemoryModel.findManyByIds({ userId: args.userId, ids });
        const byId = new Map(memories.map((m) => [m.id, m]));

        return hits
            .map((h) => {
                const memory = byId.get(h.memoryId);
                if (!memory) return null;
                return { ...toPublicMemory(memory), score: h.score };
            })
            .filter((x): x is McpSearchHit => x !== null);
    }

    public static async get(args: { userId: number; memoryId: string }): Promise<PublicMemory | null> {
        const memory = await MemoryModel.findByIdForUser({ id: args.memoryId, userId: args.userId });
        return memory ? toPublicMemory(memory) : null;
    }
}
