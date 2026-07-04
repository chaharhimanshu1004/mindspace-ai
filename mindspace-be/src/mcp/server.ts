import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpMemoryService } from "../services/mcp-memory.service";
import { AuthModel } from "../models/auth.model";
import { insufficientScopeError } from "../errors/oauth-errors";

interface AuthInfo {
    userId: number;
    scopes: string[];
}

interface SaveMemoryArgs {
    content: string;
    kind?: string;
    session_id?: string;
}

interface SearchMemoriesArgs {
    query: string;
    limit?: number;
}

interface GetMemoryArgs {
    memory_id: string;
}

export const buildMcpServer = (authInfo: AuthInfo): McpServer => {
    const { userId, scopes } = authInfo;

    const server = new McpServer({
        name: "mindspace",
        version: "1.0.0",
    });

    const s = server as unknown as {
        registerTool: (name: string, config: { description: string; inputSchema?: Record<string, unknown> }, cb: (args: unknown) => unknown) => void;
    };

    s.registerTool(
        "checkin",
        {
            description: "Get current user info, memory count, and usage instructions. Call this first.",
        },
        async () => {
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const user = await AuthModel.findUserById(userId);
            const result = await McpMemoryService.checkIn({
                userId,
                userEmail: user?.email ?? "",
            });
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        },
    );

    s.registerTool(
        "save_memory",
        {
            description: "Save a thought, insight, decision, or idea to MindSpace. Min 40 characters.",
            inputSchema: {
                content: z.string().min(1).describe("The memory content to save"),
                kind: z.string().optional().describe("Type: reflection, idea, task, code, decision"),
                session_id: z.string().optional().describe("Current session or conversation ID"),
            },
        },
        async (args) => {
            const { content, kind, session_id } = args as SaveMemoryArgs;
            if (!scopes.includes("memories:write")) throw insufficientScopeError();
            const result = await McpMemoryService.save({
                userId,
                content,
                kind,
                sessionId: session_id,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        },
    );

    s.registerTool(
        "search_memories",
        {
            description: "Search the user's memories using semantic search.",
            inputSchema: {
                query: z.string().min(1).describe("Natural language search query"),
                limit: z.number().int().min(1).max(20).optional().describe("Max results, default 8"),
            },
        },
        async (args) => {
            const { query, limit } = args as SearchMemoriesArgs;
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const results = await McpMemoryService.search({ userId, query, limit });
            return {
                content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
            };
        },
    );

    s.registerTool(
        "get_memory",
        {
            description: "Get full content of a specific memory by ID.",
            inputSchema: {
                memory_id: z.string().uuid().describe("The memory ID to retrieve"),
            },
        },
        async (args) => {
            const { memory_id } = args as GetMemoryArgs;
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const memory = await McpMemoryService.get({ userId, memoryId: memory_id });
            return {
                content: [{ type: "text", text: memory ? JSON.stringify(memory, null, 2) : "Memory not found" }],
            };
        },
    );

    return server;
};
